from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.category import Category
from app.utils.auth import admin_required
from app.utils.upload import slugify, save_uploaded_file

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('', methods=['GET'])
def get_categories():
    include_inactive = request.args.get('all', 'false').lower() == 'true'
    flat = request.args.get('flat', 'false').lower() == 'true'
    type_param = request.args.get('type', '').strip().lower()

    query = Category.query
    if not include_inactive:
        query = query.filter_by(is_active=True)

    if type_param:
        query = query.filter(Category.product_type == type_param)

    query = query.order_by(Category.sort_order.asc(), Category.name.asc())

    if flat:
        categories = query.all()
        return jsonify({'categories': [c.to_dict(include_children=False) for c in categories]}), 200

    # Hierarchical tree: only top-level (parent_id is None) or if filtering by type, show children of that type
    if type_param:
        # If type specified, return relevant categories
        categories = query.all()
        return jsonify({'categories': [c.to_dict(include_children=True) for c in categories]}), 200

    top_level = query.filter(Category.parent_id == None).all()
    return jsonify({'categories': [c.to_dict(include_children=True) for c in top_level]}), 200


@categories_bp.route('/<slug>', methods=['GET'])
def get_category_by_slug(slug):
    category = Category.query.filter_by(slug=slug).first()
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    return jsonify({'category': category.to_dict(include_children=True)}), 200


@categories_bp.route('/upload-image', methods=['POST'])
@admin_required()
def upload_category_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    url, err = save_uploaded_file(file, folder_name='categories')
    if err:
        return jsonify({'error': err}), 400
    return jsonify({'url': url, 'message': 'Category image uploaded'}), 200


@categories_bp.route('', methods=['POST'])
@admin_required()
def create_category():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Category name is required'}), 400

    custom_slug = data.get('slug', '').strip()
    slug = slugify(custom_slug) if custom_slug else slugify(name)

    existing = Category.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Category.query.count() + 1}"

    category = Category(
        name=name,
        slug=slug,
        product_type=data.get('product_type', 'coffee').strip().lower(),
        description=data.get('description', ''),
        image=data.get('image', ''),
        parent_id=int(data['parent_id']) if data.get('parent_id') else None,
        is_active=bool(data.get('is_active', True)),
        sort_order=int(data.get('sort_order', 0))
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': 'Category created successfully',
        'category': category.to_dict()
    }), 201


@categories_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required()
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    data = request.get_json() or {}

    if 'name' in data:
        category.name = data['name'].strip()
    if 'slug' in data and data['slug'].strip():
        new_slug = slugify(data['slug'])
        existing = Category.query.filter(Category.slug == new_slug, Category.id != category_id).first()
        if not existing:
            category.slug = new_slug
    if 'product_type' in data:
        category.product_type = data['product_type'].strip().lower()
    if 'description' in data:
        category.description = data['description']
    if 'image' in data:
        category.image = data['image']
    if 'parent_id' in data:
        category.parent_id = int(data['parent_id']) if data['parent_id'] else None
    if 'is_active' in data:
        category.is_active = bool(data['is_active'])
    if 'sort_order' in data:
        category.sort_order = int(data['sort_order'])

    db.session.commit()

    return jsonify({
        'message': 'Category updated successfully',
        'category': category.to_dict()
    }), 200


@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required()
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category not found'}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Category deleted successfully'}), 200
