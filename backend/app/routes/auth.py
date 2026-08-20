from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def admin_login():
    """Admin-only authentication endpoint"""
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid administrator credentials'}), 401

    if user.role != 'admin':
        return jsonify({'error': 'Access denied. Administrator privileges required.'}), 403

    if not user.is_active:
        return jsonify({'error': 'This administrator account has been deactivated'}), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Administrator authenticated successfully',
        'token': token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_admin():
    """Verify administrator session"""
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user or user.role != 'admin':
        return jsonify({'error': 'Admin session invalid or expired'}), 403
    return jsonify({'user': user.to_dict()}), 200
