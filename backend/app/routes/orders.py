import math
import random
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from sqlalchemy import desc
from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.store import Store
from app.models.setting import Setting
from app.utils.auth import admin_required

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

def generate_order_number():
    year = datetime.now(timezone.utc).year
    rand_digits = f"{random.randint(100000, 999999)}"
    return f"CBP-{year}-{rand_digits}"

def get_delivery_fee():
    setting = Setting.query.filter_by(key='delivery_fee').first()
    if setting and setting.value:
        try:
            return float(setting.value)
        except ValueError:
            pass
    return 250.0  # Default Rs 250 delivery fee


@orders_bp.route('', methods=['POST'])
def create_guest_order():
    """Guest Checkout Order Creation - No Customer Login Required"""
    data = request.get_json() or {}
    
    # Customer Information
    customer_name = data.get('customer_name', '').strip()
    customer_email = data.get('customer_email', '').strip()
    customer_phone = data.get('customer_phone', '').strip() or data.get('phone', '').strip()
    
    order_type = (data.get('order_type') or 'delivery').strip().lower()
    store_id = data.get('store_id')
    store_name = data.get('store_name', '').strip()
    
    delivery_address = data.get('delivery_address', '').strip() or data.get('address', '').strip()
    city = data.get('city', '').strip()
    area = data.get('area', '').strip()
    postal_code = data.get('postal_code', '').strip()
    notes = data.get('notes', '').strip()
    items_data = data.get('items', [])
    payment_method = data.get('payment_method', '').strip()

    # Basic validations
    if not customer_name or not customer_phone:
        return jsonify({'error': 'Full Name and Phone Number are required'}), 400

    if order_type == 'pickup':
        if not store_name and not store_id:
            return jsonify({'error': 'Please select a pickup store location'}), 400
        if store_id and not store_name:
            store_obj = db.session.get(Store, int(store_id))
            if store_obj:
                store_name = store_obj.name
        if not payment_method:
            payment_method = 'Cash on Pickup'
        delivery_fee = 0.0
    else:
        order_type = 'delivery'
        if not delivery_address or not city:
            return jsonify({'error': 'Complete delivery address and city are required for delivery orders'}), 400
        if not area:
            return jsonify({'error': 'Area / Sector is required for delivery orders'}), 400
        if not payment_method:
            payment_method = 'Cash on Delivery (COD)'
        delivery_fee = get_delivery_fee()

    if not items_data or len(items_data) == 0:
        return jsonify({'error': 'Cart is empty. Please add items to place an order.'}), 400

    # SERVER-SIDE PRICE & INVENTORY VALIDATION
    calculated_subtotal = 0.0
    order_items_to_create = []

    for item in items_data:
        prod_id = item.get('product_id') or item.get('id')
        qty = int(item.get('quantity', 1))

        if qty <= 0:
            continue

        if qty > 50:
            return jsonify({'error': 'Maximum single order quantity exceeded'}), 400

        product = db.session.get(Product, prod_id)
        if not product:
            return jsonify({'error': f'Product ID {prod_id} not found'}), 400

        if not product.is_active:
            return jsonify({'error': f'Product "{product.name}" is no longer available'}), 400

        if product.stock_quantity < qty:
            return jsonify({
                'error': f'Insufficient stock for "{product.name}". Only {product.stock_quantity} available.'
            }), 400

        # Current authoritative price from DB
        unit_price = product.effective_price()
        item_subtotal = round(unit_price * qty, 2)
        calculated_subtotal += item_subtotal

        # Prepare OrderItem
        order_item = OrderItem(
            product_id=product.id,
            product_name=product.name,
            product_image=product.image,
            price=unit_price,
            quantity=qty,
            subtotal=item_subtotal
        )
        order_items_to_create.append((order_item, product, qty))

    if not order_items_to_create:
        return jsonify({'error': 'No valid items found in order'}), 400

    # Free shipping on delivery threshold
    if order_type == 'delivery' and calculated_subtotal >= 3500.0:
        delivery_fee = 0.0

    total = round(calculated_subtotal + delivery_fee, 2)

    # Unique order number matching format CBP-2026-XXXXXX
    order_number = generate_order_number()
    while Order.query.filter_by(order_number=order_number).first():
        order_number = generate_order_number()

    # Create Order
    new_order = Order(
        order_number=order_number,
        user_id=None,
        order_type=order_type,
        store_id=int(store_id) if store_id else None,
        store_name=store_name or None,
        customer_name=customer_name,
        customer_email=customer_email or f"{customer_phone.replace(' ', '')}@guest.coffeebean.pk",
        customer_phone=customer_phone,
        delivery_address=delivery_address if order_type == 'delivery' else f"In-Store Pickup: {store_name}",
        city=city if order_type == 'delivery' else "Store Pickup",
        area=area if order_type == 'delivery' else None,
        postal_code=postal_code if order_type == 'delivery' else None,
        notes=notes,
        subtotal=calculated_subtotal,
        delivery_fee=delivery_fee,
        total=total,
        payment_method=payment_method,
        payment_status='Pending',
        order_status='Pending',
        created_at=datetime.now(timezone.utc)
    )

    db.session.add(new_order)
    db.session.flush()

    # Link items & decrement stock
    for order_item, product, qty in order_items_to_create:
        order_item.order_id = new_order.id
        db.session.add(order_item)
        product.stock_quantity = max(0, product.stock_quantity - qty)

    db.session.commit()

    return jsonify({
        'message': 'Order placed successfully',
        'order': new_order.to_dict()
    }), 201


@orders_bp.route('/track', methods=['GET'])
def track_guest_order():
    """Public Order Tracking - Search by Order Number & Phone (No Login Required)"""
    order_number = request.args.get('order_number', '').strip()
    phone = request.args.get('phone', '').strip()

    if not order_number:
        return jsonify({'error': 'Order number is required'}), 400

    query = Order.query.filter(Order.order_number.ilike(order_number))
    if phone:
        query = query.filter(Order.customer_phone.ilike(f"%{phone}%"))

    order = query.first()
    if not order:
        return jsonify({'error': 'No matching order found with the provided details'}), 404

    return jsonify({'order': order.to_dict()}), 200


@orders_bp.route('/<order_ref>', methods=['GET'])
def get_order_by_ref(order_ref):
    """Public Order Details for Confirmation Screen"""
    order = None
    if order_ref.isdigit():
        order = db.session.get(Order, int(order_ref))
    if not order:
        order = Order.query.filter_by(order_number=order_ref).first()

    if not order:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({'order': order.to_dict()}), 200


@orders_bp.route('', methods=['GET'])
@admin_required()
def list_orders_admin():
    """Admin Order List with Search & Filtering"""
    query = Order.query

    status = request.args.get('status')
    if status and status != 'all':
        query = query.filter(Order.order_status.ilike(status))

    order_type = request.args.get('order_type')
    if order_type and order_type != 'all':
        query = query.filter(Order.order_type.ilike(order_type))

    search = request.args.get('search', '').strip()
    if search:
        term = f"%{search}%"
        query = query.filter(
            (Order.order_number.ilike(term)) |
            (Order.customer_name.ilike(term)) |
            (Order.customer_email.ilike(term)) |
            (Order.customer_phone.ilike(term)) |
            (Order.store_name.ilike(term))
        )

    query = query.order_by(desc(Order.created_at))

    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = min(50, max(1, int(request.args.get('limit', 15))))
    except ValueError:
        page, limit = 1, 15

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1
    orders = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        'orders': [o.to_dict() for o in orders],
        'total': total,
        'page': page,
        'pages': pages,
        'limit': limit
    }), 200


@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@admin_required()
def update_order_status(order_id):
    """Admin Status Update"""
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    data = request.get_json() or {}
    new_status = data.get('order_status')
    payment_status = data.get('payment_status')

    valid_statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Completed', 'Delivered', 'Cancelled']
    if new_status and new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {valid_statuses}'}), 400

    old_status = order.order_status

    if new_status:
        if new_status == 'Cancelled' and old_status != 'Cancelled':
            for item in order.items:
                if item.product_id:
                    prod = db.session.get(Product, item.product_id)
                    if prod:
                        prod.stock_quantity += item.quantity
        elif old_status == 'Cancelled' and new_status != 'Cancelled':
            for item in order.items:
                if item.product_id:
                    prod = db.session.get(Product, item.product_id)
                    if prod:
                        prod.stock_quantity = max(0, prod.stock_quantity - item.quantity)

        order.order_status = new_status

    if payment_status:
        order.payment_status = payment_status

    db.session.commit()
    return jsonify({
        'message': 'Order status updated successfully',
        'order': order.to_dict()
    }), 200
