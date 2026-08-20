from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            try:
                user_id = int(user_id)
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid user token identity'}), 401
                
            user = User.query.get(user_id)
            if not user or user.role != 'admin' or not user.is_active:
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def get_current_user():
    """Optional helper to get the currently authenticated user if token is present."""
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            return User.query.get(int(user_id))
    except Exception:
        pass
    return None
