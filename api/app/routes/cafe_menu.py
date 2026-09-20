from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.cafe_menu import CafeMenuCategory, CafeMenuItem
from app.utils.auth import admin_required
from app.utils.upload import slugify, save_uploaded_file

cafe_bp = Blueprint('cafe_menu', __name__, url_prefix='/api/cafe-menu')

@cafe_bp.route('', methods=['GET'])
def get_menu():
    include_inactive = request.args.get('all', 'false').lower() == 'true'
    cat_query = CafeMenuCategory.query
    if not include_inactive:
        cat_query = cat_query.filter_by(is_active=True)

    categories = cat_query.order_by(CafeMenuCategory.sort_order.asc()).all()
    return jsonify({'categories': [c.to_dict(include_items=True) for c in categories]}), 200


@cafe_bp.route('/upload-image', methods=['POST'])
@admin_required()
def upload_item_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    url, err = save_uploaded_file(file, folder_name='cafe')
    if err:
        return jsonify({'error': err}), 400
    return jsonify({'url': url, 'message': 'Image uploaded'}), 200


# Category endpoints
@cafe_bp.route('/categories', methods=['POST'])
@admin_required()
def create_category():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Category name required'}), 400

    slug = slugify(name)
    category = CafeMenuCategory(
        name=name,
        slug=slug,
        description=data.get('description', ''),
        sort_order=int(data.get('sort_order', 0)),
        is_active=bool(data.get('is_active', True))
    )
    db.session.add(category)
    db.session.commit()
    return jsonify({'message': 'Menu category created', 'category': category.to_dict()}), 201


@cafe_bp.route('/categories/<int:category_id>', methods=['PUT'])
@admin_required()
def update_category(category_id):
    cat = CafeMenuCategory.query.get(category_id)
    if not cat:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        cat.name = data['name'].strip()
        cat.slug = slugify(cat.name)
    if 'description' in data:
        cat.description = data['description']
    if 'sort_order' in data:
        cat.sort_order = int(data['sort_order'])
    if 'is_active' in data:
        cat.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({'message': 'Menu category updated', 'category': cat.to_dict()}), 200


@cafe_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@admin_required()
def delete_category(category_id):
    cat = CafeMenuCategory.query.get(category_id)
    if not cat:
        return jsonify({'error': 'Category not found'}), 404

    cat.is_active = False
    db.session.commit()
    return jsonify({'message': 'Menu category deactivated'}), 200


# Item endpoints
@cafe_bp.route('/items', methods=['POST'])
@admin_required()
def create_item():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    price = data.get('price')
    category_id = data.get('category_id')

    if not name or price is None or not category_id:
        return jsonify({'error': 'Name, price, and category_id are required'}), 400

    item = CafeMenuItem(
        category_id=int(category_id),
        name=name,
        description=data.get('description', ''),
        price=float(price),
        image=data.get('image', ''),
        calories=data.get('calories', ''),
        is_popular=bool(data.get('is_popular', False)),
        is_active=bool(data.get('is_active', True)),
        sort_order=int(data.get('sort_order', 0))
    )

    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Menu item created', 'item': item.to_dict()}), 201


@cafe_bp.route('/items/<int:item_id>', methods=['PUT'])
@admin_required()
def update_item(item_id):
    item = CafeMenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        item.name = data['name'].strip()
    if 'description' in data:
        item.description = data['description']
    if 'price' in data:
        item.price = float(data['price'])
    if 'category_id' in data:
        item.category_id = int(data['category_id'])
    if 'image' in data:
        item.image = data['image']
    if 'calories' in data:
        item.calories = data['calories']
    if 'is_popular' in data:
        item.is_popular = bool(data['is_popular'])
    if 'is_active' in data:
        item.is_active = bool(data['is_active'])
    if 'sort_order' in data:
        item.sort_order = int(data['sort_order'])

    db.session.commit()
    return jsonify({'message': 'Menu item updated', 'item': item.to_dict()}), 200


@cafe_bp.route('/items/<int:item_id>', methods=['DELETE'])
@admin_required()
def delete_item(item_id):
    item = CafeMenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found'}), 404

    item.is_active = False
    db.session.commit()
    return jsonify({'message': 'Menu item deactivated'}), 200
