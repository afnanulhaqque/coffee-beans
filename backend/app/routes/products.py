import os
import math
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import or_, asc, desc
from app.extensions import db
from app.models.product import Product, ProductImage
from app.models.category import Category
from app.utils.auth import admin_required
from app.utils.upload import save_uploaded_file, slugify

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
def get_products():
    query = Product.query

    # Admin all param (shows inactive items too)
    show_all = request.args.get('all', 'false').lower() == 'true'
    if not show_all:
        query = query.filter(Product.is_active == True)

    # Search Keyword filter
    search = request.args.get('search', '').strip()
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.short_description.ilike(search_term),
                Product.tags.ilike(search_term),
                Product.sku.ilike(search_term),
                Product.origin.ilike(search_term)
            )
        )

    # Category filter (by slug or parent slug)
    category_param = request.args.get('category', '').strip()
    if category_param:
        cat = Category.query.filter_by(slug=category_param).first()
        if cat:
            if cat.children:
                child_ids = [child.id for child in cat.children]
                child_ids.append(cat.id)
                query = query.filter(Product.category_id.in_(child_ids))
            else:
                query = query.filter(Product.category_id == cat.id)

    # Roast Level filter (Light, Medium, Dark, Decaf, Flavoured, Tea)
    roast = request.args.get('roast', '').strip()
    if roast:
        query = query.filter(Product.roast_level.ilike(f"%{roast}%"))

    # Origin filter
    origin = request.args.get('origin', '').strip()
    if origin:
        query = query.filter(Product.origin.ilike(f"%{origin}%"))

    # Price range
    min_price = request.args.get('min_price')
    if min_price:
        try:
            query = query.filter(Product.price >= float(min_price))
        except ValueError:
            pass

    max_price = request.args.get('max_price')
    if max_price:
        try:
            query = query.filter(Product.price <= float(max_price))
        except ValueError:
            pass

    # Availability / In Stock filter
    in_stock = request.args.get('in_stock', '').lower()
    if in_stock == 'true':
        query = query.filter(Product.stock_quantity > 0)

    # Featured or Best Seller
    if request.args.get('featured', '').lower() == 'true':
        query = query.filter(Product.is_featured == True)
    if request.args.get('best_seller', '').lower() == 'true':
        query = query.filter(Product.is_best_seller == True)

    # Sorting
    sort = request.args.get('sort', 'newest').lower()
    if sort == 'price_low' or sort == 'price_asc':
        query = query.order_by(asc(Product.price))
    elif sort == 'price_high' or sort == 'price_desc':
        query = query.order_by(desc(Product.price))
    elif sort == 'best_selling':
        query = query.order_by(desc(Product.is_best_seller), desc(Product.id))
    elif sort == 'featured':
        query = query.order_by(desc(Product.is_featured), desc(Product.id))
    elif sort == 'name_asc':
        query = query.order_by(asc(Product.name))
    elif sort == 'name_desc':
        query = query.order_by(desc(Product.name))
    else: # newest
        query = query.order_by(desc(Product.created_at))

    # Pagination
    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = min(50, max(1, int(request.args.get('limit', 12))))
    except ValueError:
        page, limit = 1, 12

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1
    products = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'products': [p.to_dict() for p in products],
        'total': total,
        'page': page,
        'pages': pages,
        'limit': limit
    }), 200


@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    limit = int(request.args.get('limit', 8))
    products = Product.query.filter_by(is_active=True, is_featured=True).limit(limit).all()
    if len(products) < 4:
        products = Product.query.filter_by(is_active=True).order_by(desc(Product.id)).limit(limit).all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200


@products_bp.route('/best-sellers', methods=['GET'])
def get_best_seller_products():
    limit = int(request.args.get('limit', 8))
    products = Product.query.filter_by(is_active=True, is_best_seller=True).limit(limit).all()
    if len(products) < 4:
        products = Product.query.filter_by(is_active=True).order_by(desc(Product.price)).limit(limit).all()
    return jsonify({'products': [p.to_dict() for p in products]}), 200


@products_bp.route('/<slug>', methods=['GET'])
def get_product_by_slug(slug):
    product = None
    if slug.isdigit():
        product = Product.query.get(int(slug))
    if not product:
        product = Product.query.filter_by(slug=slug).first()

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    product_dict = product.to_dict()

    # Get related products (same category or roast level)
    related = Product.query.filter(
        Product.id != product.id,
        Product.is_active == True,
        or_(
            Product.category_id == product.category_id,
            Product.roast_level == product.roast_level
        )
    ).limit(4).all()

    product_dict['related_products'] = [r.to_dict() for r in related]

    return jsonify({'product': product_dict}), 200


@products_bp.route('', methods=['POST'])
@admin_required()
def create_product():
    data = request.get_json() or {}

    name = data.get('name', '').strip()
    price = data.get('price')

    if not name or price is None:
        return jsonify({'error': 'Product name and price are required'}), 400

    try:
        price = float(price)
    except ValueError:
        return jsonify({'error': 'Price must be a valid number'}), 400

    custom_slug = data.get('slug', '').strip()
    slug = slugify(custom_slug) if custom_slug else slugify(name)
    
    existing = Product.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Product.query.count() + 1}"

    sale_price = data.get('sale_price')
    if sale_price is not None and sale_price != '':
        try:
            sale_price = float(sale_price)
        except ValueError:
            sale_price = None
    else:
        sale_price = None

    product = Product(
        name=name,
        slug=slug,
        description=data.get('description', ''),
        short_description=data.get('short_description', ''),
        price=price,
        sale_price=sale_price,
        sku=data.get('sku', '').strip() or None,
        stock_quantity=int(data.get('stock_quantity', 0)),
        image=data.get('image', ''),
        category_id=int(data['category_id']) if data.get('category_id') else None,
        tags=data.get('tags', ''),
        roast_level=data.get('roast_level', ''),
        origin=data.get('origin', ''),
        is_active=bool(data.get('is_active', True)),
        is_featured=bool(data.get('is_featured', False)),
        is_best_seller=bool(data.get('is_best_seller', False)),
        manually_modified=True
    )

    db.session.add(product)
    db.session.flush()

    # Additional gallery images
    gallery = data.get('additional_images', [])
    for idx, g_url in enumerate(gallery, 1):
        if g_url:
            pi = ProductImage(product_id=product.id, image_url=g_url, sort_order=idx)
            db.session.add(pi)

    db.session.commit()

    return jsonify({
        'message': 'Product created successfully',
        'product': product.to_dict()
    }), 201


@products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required()
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json() or {}
    
    if 'name' in data:
        product.name = data['name'].strip()
    if 'slug' in data and data['slug'].strip():
        new_slug = slugify(data['slug'])
        existing = Product.query.filter(Product.slug == new_slug, Product.id != product_id).first()
        if not existing:
            product.slug = new_slug
    if 'price' in data:
        product.price = float(data['price'])
    if 'sale_price' in data:
        sp = data['sale_price']
        product.sale_price = float(sp) if sp is not None and sp != '' else None
    if 'description' in data:
        product.description = data['description']
    if 'short_description' in data:
        product.short_description = data['short_description']
    if 'sku' in data:
        product.sku = data['sku'].strip() or None
    if 'stock_quantity' in data:
        product.stock_quantity = int(data['stock_quantity'])
    if 'image' in data:
        product.image = data['image']
    if 'category_id' in data:
        product.category_id = int(data['category_id']) if data['category_id'] else None
    if 'tags' in data:
        product.tags = data['tags']
    if 'roast_level' in data:
        product.roast_level = data['roast_level']
    if 'origin' in data:
        product.origin = data['origin']
    if 'is_active' in data:
        product.is_active = bool(data['is_active'])
    if 'is_featured' in data:
        product.is_featured = bool(data['is_featured'])
    if 'is_best_seller' in data:
        product.is_best_seller = bool(data['is_best_seller'])

    # Handle gallery images update if provided
    if 'additional_images' in data:
        ProductImage.query.filter_by(product_id=product.id).delete()
        for idx, g_url in enumerate(data['additional_images'], 1):
            if g_url:
                db.session.add(ProductImage(product_id=product.id, image_url=g_url, sort_order=idx))

    product.manually_modified = True
    db.session.commit()

    return jsonify({
        'message': 'Product updated successfully',
        'product': product.to_dict()
    }), 200


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required()
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Soft delete to preserve historical order records
    product.is_active = False
    product.manually_modified = True
    db.session.commit()
    return jsonify({'message': 'Product deactivated successfully'}), 200


@products_bp.route('/upload-image', methods=['POST'])
@admin_required()
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file submitted'}), 400

    file = request.files['file']
    try:
        url = save_uploaded_file(file, subfolder='products')
        return jsonify({'url': url, 'message': 'Image uploaded successfully'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 500
