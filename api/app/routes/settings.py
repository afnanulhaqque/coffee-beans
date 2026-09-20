from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.setting import Setting
from app.utils.auth import admin_required

settings_bp = Blueprint('settings', __name__, url_prefix='/api')

DEFAULT_SETTINGS = {
    'store_name': 'The Coffee Bean & Tea Leaf',
    'store_tagline': 'Crafted with Character since 1963',
    'contact_email': 'info@coffeebean.pk',
    'contact_phone': '+92 21 111 232 675',
    'support_whatsapp': '+92 300 1234567',
    'store_address': 'Plot 4-C, 10th Commercial Lane, Zamzama DHA Phase 5, Karachi',
    'delivery_fee': '250',
    'free_delivery_threshold': '3500',
    'currency_symbol': 'Rs.',
    'currency_code': 'PKR',
    'facebook_url': 'https://facebook.com/coffeebean',
    'instagram_url': 'https://instagram.com/coffeebean',
    'opening_hours': 'Mon - Sun: 8:00 AM - Midnight',
    'announcement_bar': 'Enjoy Free Express Delivery across Pakistan on all orders above Rs. 3,500! ☕'
}

@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    settings = Setting.query.all()
    result = {**DEFAULT_SETTINGS}
    for s in settings:
        result[s.key] = s.value
    return jsonify({'settings': result}), 200


@settings_bp.route('/settings', methods=['PUT'])
@admin_required()
def update_settings():
    data = request.get_json() or {}

    for key, value in data.items():
        setting = Setting.query.filter_by(key=key).first()
        if setting:
            setting.value = str(value)
        else:
            setting = Setting(key=key, value=str(value), group='general')
            db.session.add(setting)

    db.session.commit()
    return jsonify({'message': 'Settings updated successfully'}), 200


@settings_bp.route('/contact', methods=['POST'])
def submit_contact_inquiry():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({'error': 'Name, email, and message are required.'}), 400

    # Return success response
    return jsonify({
        'message': f'Thank you {name}. Your inquiry has been received by The Coffee Bean & Tea Leaf team. We will respond within 24 hours.',
        'status': 'received'
    }), 200
