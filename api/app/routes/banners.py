from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.banner import Banner
from app.utils.auth import admin_required
from app.utils.upload import save_uploaded_file

banners_bp = Blueprint('banners', __name__, url_prefix='/api/banners')

@banners_bp.route('', methods=['GET'])
def get_banners():
    include_inactive = request.args.get('all', 'false').lower() == 'true'
    banner_type = request.args.get('type') # hero, promotional

    query = Banner.query
    if not include_inactive:
        query = query.filter_by(is_active=True)

    if banner_type:
        query = query.filter_by(banner_type=banner_type)

    banners = query.order_by(Banner.sort_order.asc(), Banner.id.asc()).all()
    return jsonify({'banners': [b.to_dict() for b in banners]}), 200


@banners_bp.route('/upload-image', methods=['POST'])
@admin_required()
def upload_banner_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    url, err = save_uploaded_file(file, folder_name='banners')
    if err:
        return jsonify({'error': err}), 400
    return jsonify({'url': url, 'message': 'Image uploaded'}), 200


@banners_bp.route('', methods=['POST'])
@admin_required()
def create_banner():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    image = data.get('image', '').strip()

    if not title or not image:
        return jsonify({'error': 'Title and Image are required'}), 400

    banner = Banner(
        title=title,
        subtitle=data.get('subtitle', ''),
        description=data.get('description', ''),
        image=image,
        button_text=data.get('button_text', 'Shop Now'),
        button_url=data.get('button_url', '/shop'),
        badge_text=data.get('badge_text', ''),
        banner_type=data.get('banner_type', 'hero'),
        sort_order=int(data.get('sort_order', 0)),
        is_active=bool(data.get('is_active', True))
    )

    db.session.add(banner)
    db.session.commit()
    return jsonify({'message': 'Banner created successfully', 'banner': banner.to_dict()}), 201


@banners_bp.route('/<int:banner_id>', methods=['PUT'])
@admin_required()
def update_banner(banner_id):
    banner = Banner.query.get(banner_id)
    if not banner:
        return jsonify({'error': 'Banner not found'}), 404

    data = request.get_json() or {}
    if 'title' in data:
        banner.title = data['title'].strip()
    if 'subtitle' in data:
        banner.subtitle = data['subtitle']
    if 'description' in data:
        banner.description = data['description']
    if 'image' in data:
        banner.image = data['image']
    if 'button_text' in data:
        banner.button_text = data['button_text']
    if 'button_url' in data:
        banner.button_url = data['button_url']
    if 'badge_text' in data:
        banner.badge_text = data['badge_text']
    if 'banner_type' in data:
        banner.banner_type = data['banner_type']
    if 'sort_order' in data:
        banner.sort_order = int(data['sort_order'])
    if 'is_active' in data:
        banner.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({'message': 'Banner updated successfully', 'banner': banner.to_dict()}), 200


@banners_bp.route('/<int:banner_id>', methods=['DELETE'])
@admin_required()
def delete_banner(banner_id):
    banner = Banner.query.get(banner_id)
    if not banner:
        return jsonify({'error': 'Banner not found'}), 404

    banner.is_active = False
    db.session.commit()
    return jsonify({'message': 'Banner deactivated successfully'}), 200
