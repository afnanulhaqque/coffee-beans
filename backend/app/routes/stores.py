from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.store import Store
from app.utils.auth import admin_required
from app.utils.upload import save_uploaded_file

stores_bp = Blueprint('stores', __name__, url_prefix='/api/stores')

@stores_bp.route('', methods=['GET'])
def get_stores():
    include_inactive = request.args.get('all', 'false').lower() == 'true'
    query = Store.query
    if not include_inactive:
        query = query.filter_by(is_active=True)

    city = request.args.get('city', '').strip()
    if city:
        query = query.filter(Store.city.ilike(f"%{city}%"))

    stores = query.order_by(Store.city.asc(), Store.name.asc()).all()
    
    # Also extract unique cities
    all_active_stores = Store.query.filter_by(is_active=True).all()
    cities = sorted(list(set(s.city for s in all_active_stores if s.city)))

    return jsonify({
        'stores': [s.to_dict() for s in stores],
        'cities': cities
    }), 200


@stores_bp.route('/<int:store_id>', methods=['GET'])
def get_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'error': 'Store not found'}), 404
    return jsonify({'store': store.to_dict()}), 200


@stores_bp.route('/upload-image', methods=['POST'])
@admin_required()
def upload_store_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    file = request.files['file']
    url, err = save_uploaded_file(file, folder_name='stores')
    if err:
        return jsonify({'error': err}), 400
    return jsonify({'url': url, 'message': 'Image uploaded'}), 200


@stores_bp.route('', methods=['POST'])
@admin_required()
def create_store():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    address = data.get('address', '').strip()
    city = data.get('city', 'Karachi').strip()

    if not name or not address:
        return jsonify({'error': 'Store name and address are required'}), 400

    store = Store(
        name=name,
        address=address,
        city=city,
        phone=data.get('phone', ''),
        email=data.get('email', ''),
        opening_hours=data.get('opening_hours', '8:00 AM - 11:00 PM'),
        latitude=float(data['latitude']) if data.get('latitude') else None,
        longitude=float(data['longitude']) if data.get('longitude') else None,
        image=data.get('image', ''),
        features=data.get('features', ''),
        is_active=bool(data.get('is_active', True))
    )

    db.session.add(store)
    db.session.commit()
    return jsonify({'message': 'Store created successfully', 'store': store.to_dict()}), 201


@stores_bp.route('/<int:store_id>', methods=['PUT'])
@admin_required()
def update_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'error': 'Store not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        store.name = data['name'].strip()
    if 'address' in data:
        store.address = data['address'].strip()
    if 'city' in data:
        store.city = data['city'].strip()
    if 'phone' in data:
        store.phone = data['phone']
    if 'email' in data:
        store.email = data['email']
    if 'opening_hours' in data:
        store.opening_hours = data['opening_hours']
    if 'latitude' in data:
        store.latitude = float(data['latitude']) if data['latitude'] else None
    if 'longitude' in data:
        store.longitude = float(data['longitude']) if data['longitude'] else None
    if 'image' in data:
        store.image = data['image']
    if 'features' in data:
        store.features = data['features']
    if 'is_active' in data:
        store.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({'message': 'Store updated successfully', 'store': store.to_dict()}), 200


@stores_bp.route('/<int:store_id>', methods=['DELETE'])
@admin_required()
def delete_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'error': 'Store not found'}), 404

    store.is_active = False
    db.session.commit()
    return jsonify({'message': 'Store deactivated successfully'}), 200
