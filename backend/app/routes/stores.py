import math
from flask import Blueprint, request, jsonify
from sqlalchemy import or_, asc
from app.extensions import db
from app.models.store import Store, StoreOpeningHours
from app.utils.auth import admin_required
from app.utils.upload import save_uploaded_file, slugify

stores_bp = Blueprint('stores', __name__, url_prefix='/api/stores')

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance in kilometers between two points using the Haversine formula
    """
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return None
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


@stores_bp.route('', methods=['GET'])
def get_stores():
    include_inactive = request.args.get('all', 'false').lower() == 'true'
    query = Store.query
    if not include_inactive:
        query = query.filter_by(is_active=True)

    city = request.args.get('city', '').strip()
    if city and city.lower() != 'all':
        query = query.filter(Store.city.ilike(f"%{city}%"))

    search = request.args.get('search', '').strip()
    if search:
        st = f"%{search}%"
        query = query.filter(
            or_(
                Store.name.ilike(st),
                Store.address.ilike(st),
                Store.city.ilike(st),
                Store.phone.ilike(st)
            )
        )

    # Optional geolocation for nearest sorting
    user_lat = request.args.get('lat')
    user_lng = request.args.get('lng')

    stores = query.order_by(Store.city.asc(), Store.name.asc()).all()
    
    # Extract unique active cities
    all_active_stores = Store.query.filter_by(is_active=True).all()
    cities = sorted(list(set(s.city for s in all_active_stores if s.city)))

    store_dicts = []
    for s in stores:
        d = s.to_dict()
        if user_lat and user_lng and s.latitude and s.longitude:
            try:
                dist = haversine_distance(float(user_lat), float(user_lng), s.latitude, s.longitude)
                d['distance_km'] = dist
            except (ValueError, TypeError):
                d['distance_km'] = None
        else:
            d['distance_km'] = None
        store_dicts.append(d)

    # If coordinates provided, sort by distance
    if user_lat and user_lng:
        store_dicts.sort(key=lambda x: (x['distance_km'] is None, x['distance_km'] if x['distance_km'] is not None else 99999))

    return jsonify({
        'stores': store_dicts,
        'cities': cities,
        'total': len(store_dicts)
    }), 200


@stores_bp.route('/cities', methods=['GET'])
def get_cities():
    all_active = Store.query.filter_by(is_active=True).all()
    cities = sorted(list(set(s.city for s in all_active if s.city)))
    return jsonify({'cities': cities}), 200


@stores_bp.route('/nearest', methods=['GET'])
def get_nearest_stores():
    user_lat = request.args.get('lat')
    user_lng = request.args.get('lng')

    if not user_lat or not user_lng:
        return jsonify({'error': 'Latitude and longitude parameters are required'}), 400

    try:
        u_lat = float(user_lat)
        u_lng = float(user_lng)
    except ValueError:
        return jsonify({'error': 'Invalid coordinates provided'}), 400

    stores = Store.query.filter(Store.is_active == True, Store.latitude.isnot(None), Store.longitude.isnot(None)).all()
    
    results = []
    for s in stores:
        dist = haversine_distance(u_lat, u_lng, s.latitude, s.longitude)
        d = s.to_dict()
        d['distance_km'] = dist
        results.append(d)

    results.sort(key=lambda x: x['distance_km'])

    return jsonify({
        'stores': results[:10],
        'total': len(results)
    }), 200


@stores_bp.route('/<identifier>', methods=['GET'])
def get_store(identifier):
    if identifier.isdigit():
        store = Store.query.get(int(identifier))
    else:
        store = Store.query.filter_by(slug=identifier).first()

    if not store:
        return jsonify({'error': 'Store not found'}), 404

    return jsonify({'store': store.to_dict()}), 200


@stores_bp.route('/upload-image', methods=['POST'])
@admin_required()
def upload_store_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    file = request.files['file']
    url = save_uploaded_file(file, folder='stores')
    if not url:
        return jsonify({'error': 'Failed to upload image'}), 400
    return jsonify({'url': url, 'message': 'Image uploaded'}), 200


@stores_bp.route('', methods=['POST'])
@admin_required()
def create_store():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    address = data.get('address', '').strip()
    city = data.get('city', 'Islamabad').strip()

    if not name:
        return jsonify({'error': 'Store name is required'}), 400

    slug_val = slugify(data.get('slug', '') or f"{city}-{name}")
    existing = Store.query.filter_by(slug=slug_val).first()
    if existing:
        slug_val = f"{slug_val}-{len(Store.query.all())+1}"

    store = Store(
        name=name,
        slug=slug_val,
        address=address or None,
        city=city,
        province=data.get('province', ''),
        country=data.get('country', 'Pakistan'),
        phone=data.get('phone', '').strip() or None,
        email=data.get('email', '').strip() or None,
        opening_hours=data.get('opening_hours', '8:00 AM - 1:00 AM'),
        latitude=float(data['latitude']) if data.get('latitude') else None,
        longitude=float(data['longitude']) if data.get('longitude') else None,
        google_maps_url=data.get('google_maps_url', ''),
        image=data.get('image', ''),
        description=data.get('description', ''),
        delivery_available=bool(data.get('delivery_available', True)),
        dine_in=bool(data.get('dine_in', True)),
        takeaway=bool(data.get('takeaway', True)),
        drive_thru=bool(data.get('drive_thru', False)),
        wifi=bool(data.get('wifi', True)),
        outdoor_seating=bool(data.get('outdoor_seating', False)),
        parking=bool(data.get('parking', True)),
        accessible=bool(data.get('accessible', True)),
        status=data.get('status', 'Active'),
        is_active=bool(data.get('is_active', True)),
        featured=bool(data.get('featured', False))
    )

    db.session.add(store)
    db.session.flush()

    # Opening hours
    schedules = data.get('schedules', [])
    for sch in schedules:
        soh = StoreOpeningHours(
            store_id=store.id,
            day_of_week=sch.get('day_of_week', 'Monday'),
            open_time=sch.get('open_time', '08:00'),
            close_time=sch.get('close_time', '01:00'),
            is_closed=bool(sch.get('is_closed', False)),
            is_24_hours=bool(sch.get('is_24_hours', False))
        )
        db.session.add(soh)

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
        store.address = data['address'].strip() or None
    if 'city' in data:
        store.city = data['city'].strip()
    if 'province' in data:
        store.province = data['province'].strip()
    if 'phone' in data:
        store.phone = data['phone'].strip() or None
    if 'email' in data:
        store.email = data['email'].strip() or None
    if 'opening_hours' in data:
        store.opening_hours = data['opening_hours']
    if 'latitude' in data:
        store.latitude = float(data['latitude']) if data['latitude'] is not None and str(data['latitude']).strip() != '' else None
    if 'longitude' in data:
        store.longitude = float(data['longitude']) if data['longitude'] is not None and str(data['longitude']).strip() != '' else None
    if 'google_maps_url' in data:
        store.google_maps_url = data['google_maps_url']
    if 'image' in data:
        store.image = data['image']
    if 'description' in data:
        store.description = data['description']
    if 'status' in data:
        store.status = data['status']
    if 'is_active' in data:
        store.is_active = bool(data['is_active'])
    if 'featured' in data:
        store.featured = bool(data['featured'])
    if 'delivery_available' in data:
        store.delivery_available = bool(data['delivery_available'])
    if 'dine_in' in data:
        store.dine_in = bool(data['dine_in'])
    if 'takeaway' in data:
        store.takeaway = bool(data['takeaway'])
    if 'drive_thru' in data:
        store.drive_thru = bool(data['drive_thru'])
    if 'wifi' in data:
        store.wifi = bool(data['wifi'])
    if 'outdoor_seating' in data:
        store.outdoor_seating = bool(data['outdoor_seating'])
    if 'parking' in data:
        store.parking = bool(data['parking'])
    if 'accessible' in data:
        store.accessible = bool(data['accessible'])

    if 'schedules' in data:
        StoreOpeningHours.query.filter_by(store_id=store.id).delete()
        for sch in data['schedules']:
            soh = StoreOpeningHours(
                store_id=store.id,
                day_of_week=sch.get('day_of_week', 'Monday'),
                open_time=sch.get('open_time', '08:00'),
                close_time=sch.get('close_time', '01:00'),
                is_closed=bool(sch.get('is_closed', False)),
                is_24_hours=bool(sch.get('is_24_hours', False))
            )
            db.session.add(soh)

    db.session.commit()
    return jsonify({'message': 'Store updated successfully', 'store': store.to_dict()}), 200


@stores_bp.route('/<int:store_id>', methods=['DELETE'])
@admin_required()
def delete_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'error': 'Store not found'}), 404

    db.session.delete(store)
    db.session.commit()
    return jsonify({'message': 'Store deleted successfully'}), 200
