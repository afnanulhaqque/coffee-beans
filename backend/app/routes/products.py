import os
import math
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import or_, asc, desc
from app.extensions import db
from app.models.product import Product, ProductImage
from app.models.category import Category
from app.utils.auth import admin_required
from app.utils.upload import save_uploaded_file, slugify

products_bp = Blueprint('products', __name__, url_prefix='/api')

@products_bp.route('/products', methods=['GET'])
def get_products():
    query = Product.query

    # Admin all param (shows inactive items too)
    show_all = request.args.get('all', 'false').lower() == 'true'
    if not show_all:
        query = query.filter(Product.is_active == True)

    # Product Type filter (coffee, tea, cake, beverage, food)
    product_type = request.args.get('type', '').strip().lower()
    if product_type:
        query = query.filter(Product.product_type == product_type)

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
                Product.origin.ilike(search_term),
                Product.roast_level.ilike(search_term),
                Product.flavor_profile.ilike(search_term),
                Product.tea_type.ilike(search_term),
                Product.caffeine.ilike(search_term),
                Product.ingredients.ilike(search_term),
                Product.cake_type.ilike(search_term),
                Product.flavor.ilike(search_term),
                Product.beverage_type.ilike(search_term),
                Product.base.ilike(search_term),
                Product.portion.ilike(search_term),
                Product.allergens.ilike(search_term),
                Product.allergen_information.ilike(search_term),
                Product.pack_size.ilike(search_term)
            )
        )

    # Category filter (by slug or parent slug)
    category_param = request.args.get('category', '').strip()
    if category_param and category_param.lower() != 'all':
        cat = Category.query.filter_by(slug=category_param).first()
        if cat:
            if cat.children:
                child_ids = [child.id for child in cat.children]
                child_ids.append(cat.id)
                query = query.filter(
                    or_(
                        Product.category_id.in_(child_ids),
                        Product.subcategory_id.in_(child_ids),
                        Product.categories.any(Category.id.in_(child_ids))
                    )
                )
            else:
                query = query.filter(
                    or_(
                        Product.category_id == cat.id,
                        Product.subcategory_id == cat.id,
                        Product.categories.any(Category.id == cat.id)
                    )
                )

    # Roast Level filter (Light, Medium, Dark, Decaf, Flavoured)
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
        query = query.filter(Product.stock_quantity > 0, Product.availability != 'Out of Stock')

    # Featured or Best Seller
    if request.args.get('featured', '').lower() == 'true':
        query = query.filter(Product.is_featured == True)
    if request.args.get('best_seller', '').lower() == 'true':
        query = query.filter(Product.is_best_seller == True)

    # Sorting
    sort = request.args.get('sort', 'newest').lower()
    if sort in ['price_low', 'price_asc']:
        query = query.order_by(Product.price.is_(None), asc(Product.price))
    elif sort in ['price_high', 'price_desc']:
        query = query.order_by(Product.price.is_(None), desc(Product.price))
    elif sort == 'best_selling':
        query = query.order_by(desc(Product.is_best_seller), desc(Product.id))
    elif sort == 'featured':
        query = query.order_by(desc(Product.is_featured), desc(Product.id))
    elif sort in ['name_asc', 'name_a_z', 'a_z']:
        query = query.order_by(asc(Product.name))
    elif sort in ['name_desc', 'name_z_a', 'z_a']:
        query = query.order_by(desc(Product.name))
    else: # newest or default
        query = query.order_by(desc(Product.id))

    # Pagination
    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = min(100, max(1, int(request.args.get('limit', 50))))
    except ValueError:
        page, limit = 1, 50

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


# Dedicated /api/beverages endpoint
@products_bp.route('/beverages', methods=['GET'])
def get_beverages():
    query = Product.query.filter(Product.product_type == 'beverage', Product.is_active == True)

    category_slug = request.args.get('category', '').strip()
    if category_slug and category_slug.lower() != 'all':
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(
                or_(
                    Product.category_id == cat.id,
                    Product.categories.any(Category.id == cat.id)
                )
            )

    search = request.args.get('search', '').strip()
    if search:
        st = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(st),
                Product.short_description.ilike(st),
                Product.description.ilike(st),
                Product.flavor_profile.ilike(st),
                Product.beverage_type.ilike(st),
                Product.base.ilike(st)
            )
        )

    sort = request.args.get('sort', 'default').lower()
    if sort in ['name_asc', 'name_a_z', 'a_z']:
        query = query.order_by(asc(Product.name))
    elif sort in ['name_desc', 'name_z_a', 'z_a']:
        query = query.order_by(desc(Product.name))
    elif sort in ['price_low', 'price_asc']:
        query = query.order_by(Product.price.is_(None), asc(Product.price))
    elif sort in ['price_high', 'price_desc']:
        query = query.order_by(Product.price.is_(None), desc(Product.price))
    else:
        query = query.order_by(asc(Product.id))

    beverages = query.all()
    return jsonify({
        'products': [b.to_dict() for b in beverages],
        'total': len(beverages)
    }), 200


@products_bp.route('/beverages/<slug>', methods=['GET'])
def get_beverage_by_slug(slug):
    bev = Product.query.filter_by(slug=slug, product_type='beverage').first()
    if not bev:
        bev = Product.query.filter_by(slug=slug).first()
    if not bev:
        return jsonify({'error': 'Beverage not found'}), 404
    return jsonify({'product': bev.to_dict()}), 200


@products_bp.route('/beverage-categories', methods=['GET'])
def get_beverage_categories():
    cats = Category.query.filter_by(product_type='beverage', is_active=True).order_by(Category.sort_order).all()
    return jsonify({'categories': [c.to_dict(include_children=False) for c in cats]}), 200


# Dedicated /api/food endpoint
@products_bp.route('/food', methods=['GET'])
def get_food():
    query = Product.query.filter(Product.product_type == 'food', Product.is_active == True)

    category_slug = request.args.get('category', '').strip()
    if category_slug and category_slug.lower() != 'all':
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(
                or_(
                    Product.category_id == cat.id,
                    Product.categories.any(Category.id == cat.id)
                )
            )

    search = request.args.get('search', '').strip()
    if search:
        st = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(st),
                Product.short_description.ilike(st),
                Product.description.ilike(st),
                Product.ingredients.ilike(st),
                Product.portion.ilike(st)
            )
        )

    sort = request.args.get('sort', 'default').lower()
    if sort in ['name_asc', 'name_a_z', 'a_z']:
        query = query.order_by(asc(Product.name))
    elif sort in ['name_desc', 'name_z_a', 'z_a']:
        query = query.order_by(desc(Product.name))
    elif sort in ['price_low', 'price_asc']:
        query = query.order_by(Product.price.is_(None), asc(Product.price))
    elif sort in ['price_high', 'price_desc']:
        query = query.order_by(Product.price.is_(None), desc(Product.price))
    else:
        query = query.order_by(asc(Product.id))

    food_items = query.all()
    return jsonify({
        'products': [f.to_dict() for f in food_items],
        'total': len(food_items)
    }), 200


@products_bp.route('/food/<slug>', methods=['GET'])
def get_food_by_slug(slug):
    food_item = Product.query.filter_by(slug=slug, product_type='food').first()
    if not food_item:
        food_item = Product.query.filter_by(slug=slug).first()
    if not food_item:
        return jsonify({'error': 'Food item not found'}), 404
    return jsonify({'product': food_item.to_dict()}), 200


@products_bp.route('/food-categories', methods=['GET'])
def get_food_categories():
    cats = Category.query.filter_by(product_type='food', is_active=True).order_by(Category.sort_order).all()
    return jsonify({'categories': [c.to_dict(include_children=False) for c in cats]}), 200


# Dedicated /api/tea endpoint
@products_bp.route('/tea', methods=['GET'])
def get_tea():
    query = Product.query.filter(Product.product_type == 'tea', Product.is_active == True)

    category_slug = request.args.get('category', '').strip()
    if category_slug and category_slug.lower() != 'all':
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    search = request.args.get('search', '').strip()
    if search:
        st = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(st),
                Product.short_description.ilike(st),
                Product.description.ilike(st),
                Product.tea_type.ilike(st),
                Product.flavor_profile.ilike(st),
                Product.ingredients.ilike(st)
            )
        )

    sort = request.args.get('sort', 'default').lower()
    if sort in ['name_asc', 'name_a_z', 'a_z']:
        query = query.order_by(asc(Product.name))
    elif sort in ['name_desc', 'name_z_a', 'z_a']:
        query = query.order_by(desc(Product.name))
    elif sort in ['price_low', 'price_asc']:
        query = query.order_by(Product.price.is_(None), asc(Product.price))
    elif sort in ['price_high', 'price_desc']:
        query = query.order_by(Product.price.is_(None), desc(Product.price))
    else:
        query = query.order_by(asc(Product.id))

    teas = query.all()
    return jsonify({
        'products': [t.to_dict() for t in teas],
        'total': len(teas)
    }), 200


@products_bp.route('/tea/<slug>', methods=['GET'])
def get_tea_by_slug(slug):
    tea = Product.query.filter_by(slug=slug, product_type='tea').first()
    if not tea:
        tea = Product.query.filter_by(slug=slug).first()
    if not tea:
        return jsonify({'error': 'Tea product not found'}), 404
    return jsonify({'product': tea.to_dict()}), 200


# Dedicated /api/cake-to-go and /api/cakes endpoint
@products_bp.route('/cake-to-go', methods=['GET'])
@products_bp.route('/cakes', methods=['GET'])
def get_cakes():
    query = Product.query.filter(Product.product_type == 'cake', Product.is_active == True)

    category_slug = request.args.get('category', '').strip()
    if category_slug and category_slug.lower() != 'all':
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    search = request.args.get('search', '').strip()
    if search:
        st = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(st),
                Product.short_description.ilike(st),
                Product.description.ilike(st),
                Product.cake_type.ilike(st),
                Product.flavor.ilike(st),
                Product.serving_size.ilike(st)
            )
        )

    sort = request.args.get('sort', 'default').lower()
    if sort in ['name_asc', 'name_a_z', 'a_z']:
        query = query.order_by(asc(Product.name))
    elif sort in ['name_desc', 'name_z_a', 'z_a']:
        query = query.order_by(desc(Product.name))
    elif sort in ['price_low', 'price_asc']:
        query = query.order_by(Product.price.is_(None), asc(Product.price))
    elif sort in ['price_high', 'price_desc']:
        query = query.order_by(Product.price.is_(None), desc(Product.price))
    else:
        query = query.order_by(asc(Product.id))

    cakes = query.all()
    return jsonify({
        'products': [c.to_dict() for c in cakes],
        'total': len(cakes)
    }), 200


@products_bp.route('/cakes/<slug>', methods=['GET'])
@products_bp.route('/cake-to-go/<slug>', methods=['GET'])
def get_cake_by_slug(slug):
    cake = Product.query.filter_by(slug=slug, product_type='cake').first()
    if not cake:
        cake = Product.query.filter_by(slug=slug).first()
    if not cake:
        return jsonify({'error': 'Cake product not found'}), 404
    return jsonify({'product': cake.to_dict()}), 200


@products_bp.route('/products/<identifier>', methods=['GET'])
def get_product(identifier):
    if identifier.isdigit():
        product = Product.query.get(int(identifier))
    else:
        product = Product.query.filter_by(slug=identifier).first()

    if not product:
        return jsonify({'error': 'Product not found'}), 404

    return jsonify({'product': product.to_dict()}), 200


@products_bp.route('/products/upload-image', methods=['POST'])
@products_bp.route('/admin/products/upload-image', methods=['POST'])
@admin_required()
def upload_product_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    file_url = save_uploaded_file(file, folder='products')
    if not file_url:
        return jsonify({'error': 'Invalid file format or upload failed'}), 400

    return jsonify({
        'message': 'Image uploaded successfully',
        'url': file_url
    }), 200


@products_bp.route('/products', methods=['POST'])
@products_bp.route('/admin/products', methods=['POST'])
@admin_required()
def create_product():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Product name is required'}), 400

    slug_val = slugify(data.get('slug', '') or name)
    existing = Product.query.filter_by(slug=slug_val).first()
    if existing:
        slug_val = f"{slug_val}-{int(math.floor(math.sin(1)*100000))}"

    price_val = None
    if data.get('price') is not None and str(data.get('price')).strip() != '':
        try:
            price_val = float(data['price'])
        except ValueError:
            price_val = None

    sale_price_val = None
    if data.get('sale_price') is not None and str(data.get('sale_price')).strip() != '':
        try:
            sale_price_val = float(data['sale_price'])
        except ValueError:
            sale_price_val = None

    product = Product(
        name=name,
        slug=slug_val,
        product_type=data.get('product_type', 'coffee').strip().lower(),
        pack_size=data.get('pack_size', '').strip() or None,
        price=price_val,
        sale_price=sale_price_val,
        currency=data.get('currency', 'PKR'),
        description=data.get('description', ''),
        short_description=data.get('short_description', ''),
        flavor_profile=data.get('flavor_profile', ''),
        tea_type=data.get('tea_type', ''),
        caffeine=data.get('caffeine', ''),
        ingredients=data.get('ingredients', ''),
        brewing_instructions=data.get('brewing_instructions', ''),
        cake_type=data.get('cake_type', ''),
        flavor=data.get('flavor', ''),
        size=data.get('size', ''),
        weight=data.get('weight', ''),
        serving_size=data.get('serving_size', ''),
        allergen_information=data.get('allergen_information', ''),
        beverage_type=data.get('beverage_type', ''),
        base=data.get('base', ''),
        portion=data.get('portion', ''),
        sku=data.get('sku', '').strip() or None,
        stock_quantity=int(data.get('stock_quantity', 50)),
        availability=data.get('availability', 'In Stock'),
        image=data.get('image', ''),
        thumbnail=data.get('thumbnail', '') or data.get('image', ''),
        category_id=int(data['category_id']) if data.get('category_id') else None,
        subcategory_id=int(data['subcategory_id']) if data.get('subcategory_id') else None,
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


@products_bp.route('/products/<int:product_id>', methods=['PUT'])
@products_bp.route('/admin/products/<int:product_id>', methods=['PUT'])
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
    if 'product_type' in data:
        product.product_type = data['product_type'].strip().lower()
    if 'pack_size' in data:
        product.pack_size = data['pack_size'].strip() if data['pack_size'] else None
    if 'price' in data:
        val = data['price']
        if val is None or str(val).strip() == '':
            product.price = None
        else:
            try:
                product.price = float(val)
            except ValueError:
                pass
    if 'sale_price' in data:
        sp = data['sale_price']
        product.sale_price = float(sp) if sp is not None and str(sp).strip() != '' else None
    if 'currency' in data:
        product.currency = data['currency']
    if 'description' in data:
        product.description = data['description']
    if 'short_description' in data:
        product.short_description = data['short_description']
    if 'flavor_profile' in data:
        product.flavor_profile = data['flavor_profile']
    if 'tea_type' in data:
        product.tea_type = data['tea_type']
    if 'caffeine' in data:
        product.caffeine = data['caffeine']
    if 'ingredients' in data:
        product.ingredients = data['ingredients']
    if 'brewing_instructions' in data:
        product.brewing_instructions = data['brewing_instructions']
    if 'cake_type' in data:
        product.cake_type = data['cake_type']
    if 'flavor' in data:
        product.flavor = data['flavor']
    if 'size' in data:
        product.size = data['size']
    if 'weight' in data:
        product.weight = data['weight']
    if 'serving_size' in data:
        product.serving_size = data['serving_size']
    if 'allergen_information' in data:
        product.allergen_information = data['allergen_information']
    if 'beverage_type' in data:
        product.beverage_type = data['beverage_type']
    if 'base' in data:
        product.base = data['base']
    if 'portion' in data:
        product.portion = data['portion']
    if 'sku' in data:
        product.sku = data['sku'].strip() or None
    if 'stock_quantity' in data:
        product.stock_quantity = int(data['stock_quantity'])
    if 'availability' in data:
        product.availability = data['availability']
    if 'image' in data:
        product.image = data['image']
    if 'thumbnail' in data:
        product.thumbnail = data['thumbnail']
    if 'category_id' in data:
        product.category_id = int(data['category_id']) if data['category_id'] else None
    if 'subcategory_id' in data:
        product.subcategory_id = int(data['subcategory_id']) if data['subcategory_id'] else None
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

    product.manually_modified = True

    if 'additional_images' in data:
        ProductImage.query.filter_by(product_id=product.id).delete()
        for idx, g_url in enumerate(data['additional_images'], 1):
            if g_url:
                pi = ProductImage(product_id=product.id, image_url=g_url, sort_order=idx)
                db.session.add(pi)

    db.session.commit()

    return jsonify({
        'message': 'Product updated successfully',
        'product': product.to_dict()
    }), 200


@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
@products_bp.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required()
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200


@products_bp.route('/admin/products/<int:product_id>/status', methods=['PATCH'])
@admin_required()
def toggle_product_status(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json() or {}
    if 'is_active' in data:
        product.is_active = bool(data['is_active'])
    if 'availability' in data:
        product.availability = data['availability']

    db.session.commit()
    return jsonify({
        'message': 'Product status updated',
        'product': product.to_dict()
    }), 200


@products_bp.route('/admin/products/<int:product_id>/featured', methods=['PATCH'])
@admin_required()
def toggle_product_featured(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json() or {}
    if 'is_featured' in data:
        product.is_featured = bool(data['is_featured'])

    db.session.commit()
    return jsonify({
        'message': 'Product featured status updated',
        'product': product.to_dict()
    }), 200
