from datetime import datetime, date, timedelta
from flask import Blueprint, request, jsonify
from sqlalchemy import func, desc
from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.models.category import Category
from app.utils.auth import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_dashboard_metrics():
    today_start = datetime.combine(date.today(), datetime.min.time())

    # Total & Today Sales (excluding cancelled)
    total_sales_val = db.session.query(func.sum(Order.total)).filter(Order.order_status != 'Cancelled').scalar() or 0.0
    today_sales_val = db.session.query(func.sum(Order.total)).filter(
        Order.order_status != 'Cancelled',
        Order.created_at >= today_start
    ).scalar() or 0.0

    # Order counts
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(order_status='Pending').count()
    confirmed_orders = Order.query.filter_by(order_status='Confirmed').count()
    completed_orders = Order.query.filter(Order.order_status.in_(['Delivered', 'Ready'])).count()
    cancelled_orders = Order.query.filter_by(order_status='Cancelled').count()

    # Product counts
    total_products = Product.query.filter_by(is_active=True).count()
    out_of_stock = Product.query.filter(Product.is_active == True, Product.stock_quantity == 0).count()
    low_stock = Product.query.filter(Product.is_active == True, Product.stock_quantity > 0, Product.stock_quantity <= 5).count()

    # Customer count
    total_customers = User.query.filter_by(role='customer').count()

    # Recent 6 Orders
    recent_orders = Order.query.order_by(desc(Order.created_at)).limit(6).all()

    # Low Stock Products list
    low_stock_products = Product.query.filter(Product.is_active == True, Product.stock_quantity <= 5).order_by(Product.stock_quantity.asc()).limit(6).all()

    # Best Selling Products by order item count
    best_sellers = db.session.query(
        OrderItem.product_name,
        func.sum(OrderItem.quantity).label('total_qty'),
        func.sum(OrderItem.subtotal).label('total_revenue')
    ).group_by(OrderItem.product_name).order_by(desc('total_qty')).limit(5).all()

    best_sellers_data = [
        {'name': b[0], 'qty': int(b[1] or 0), 'revenue': float(b[2] or 0.0)}
        for b in best_sellers
    ]

    # Past 7 Days Sales Trend
    seven_days_ago = datetime.utcnow() - timedelta(days=6)
    daily_sales = []
    for i in range(7):
        day_date = (seven_days_ago + timedelta(days=i)).date()
        day_start = datetime.combine(day_date, datetime.min.time())
        day_end = datetime.combine(day_date, datetime.max.time())
        
        day_revenue = db.session.query(func.sum(Order.total)).filter(
            Order.order_status != 'Cancelled',
            Order.created_at >= day_start,
            Order.created_at <= day_end
        ).scalar() or 0.0
        
        day_order_count = Order.query.filter(
            Order.created_at >= day_start,
            Order.created_at <= day_end
        ).count()

        daily_sales.append({
            'date': day_date.strftime('%b %d'),
            'revenue': round(day_revenue, 2),
            'orders': day_order_count
        })

    return jsonify({
        'metrics': {
            'total_sales': round(total_sales_val, 2),
            'today_sales': round(today_sales_val, 2),
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'confirmed_orders': confirmed_orders,
            'completed_orders': completed_orders,
            'cancelled_orders': cancelled_orders,
            'total_products': total_products,
            'out_of_stock': out_of_stock,
            'low_stock': low_stock,
            'total_customers': total_customers
        },
        'recent_orders': [o.to_dict() for o in recent_orders],
        'low_stock_products': [p.to_dict() for p in low_stock_products],
        'best_sellers': best_sellers_data,
        'daily_sales': daily_sales
    }), 200


@admin_bp.route('/customers', methods=['GET'])
@admin_required()
def get_customers():
    """Aggregate customer directory directly from Order records"""
    orders = Order.query.order_by(desc(Order.created_at)).all()
    customer_map = {}

    for o in orders:
        key = (o.customer_phone or o.customer_email or o.customer_name).strip()
        if not key:
            continue
        if key not in customer_map:
            customer_map[key] = {
                'id': o.id,
                'name': o.customer_name,
                'email': o.customer_email,
                'phone': o.customer_phone,
                'city': o.city,
                'total_orders': 0,
                'total_spent': 0.0,
                'last_order_date': o.created_at.strftime('%Y-%m-%d %H:%M') if o.created_at else None,
                'created_at': o.created_at.isoformat() if o.created_at else None
            }
        customer_map[key]['total_orders'] += 1
        if o.order_status != 'Cancelled':
            customer_map[key]['total_spent'] = round(customer_map[key]['total_spent'] + o.total, 2)

    return jsonify({'customers': list(customer_map.values())}), 200



@admin_bp.route('/inventory', methods=['GET'])
@admin_required()
def get_inventory():
    query = Product.query
    search = request.args.get('search', '').strip()
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.sku.ilike(f"%{search}%"))
        )

    category_id = request.args.get('category_id')
    if category_id:
        query = query.filter_by(category_id=int(category_id))

    stock_status = request.args.get('status')
    if stock_status == 'out_of_stock':
        query = query.filter(Product.stock_quantity == 0)
    elif stock_status == 'low_stock':
        query = query.filter(Product.stock_quantity > 0, Product.stock_quantity <= 5)
    elif stock_status == 'in_stock':
        query = query.filter(Product.stock_quantity > 5)

    products = query.order_by(Product.stock_quantity.asc()).all()
    return jsonify({'inventory': [p.to_dict() for p in products]}), 200


@admin_bp.route('/inventory/<int:product_id>', methods=['PUT'])
@admin_required()
def update_stock(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    data = request.get_json() or {}
    
    # Absolute new quantity or delta adjustment
    if 'stock_quantity' in data:
        product.stock_quantity = max(0, int(data['stock_quantity']))
        product.manually_modified = True
    elif 'adjustment' in data:
        adj = int(data['adjustment'])
        product.stock_quantity = max(0, product.stock_quantity + adj)
        product.manually_modified = True

    db.session.commit()
    return jsonify({
        'message': 'Stock updated successfully',
        'product': product.to_dict()
    }), 200


@admin_bp.route('/import', methods=['POST'])
@admin_required()
def trigger_product_import():
    data = request.get_json() or {}
    force_update = bool(data.get('force_update', False))

    try:
        from scripts.import_products import run_import
        stats = run_import(force_update=force_update)
        return jsonify({
            'message': 'Product import process finished successfully',
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({'error': f"Import failed: {str(e)}"}), 500


@admin_bp.route('/login', methods=['POST'])
def admin_login_route():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid administrator credentials'}), 401

    if user.role != 'admin':
        return jsonify({'error': 'Access restricted to administrators only'}), 403

    if not user.is_active:
        return jsonify({'error': 'This administrator account has been deactivated'}), 403

    from flask_jwt_extended import create_access_token
    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Administrator logged in successfully',
        'token': token,
        'user': user.to_dict()
    }), 200


@admin_bp.route('/logout', methods=['POST'])
def admin_logout_route():
    return jsonify({'message': 'Logged out successfully'}), 200

