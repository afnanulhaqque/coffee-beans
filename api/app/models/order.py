from datetime import datetime, timezone
from app.extensions import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Nullable for guest checkout
    
    order_type = db.Column(db.String(30), default='delivery', nullable=False) # 'delivery' or 'pickup'
    store_id = db.Column(db.Integer, nullable=True)
    store_name = db.Column(db.String(120), nullable=True)

    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(30), nullable=False)
    
    subtotal = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, default=0.0, nullable=False)
    total = db.Column(db.Float, nullable=False)
    
    payment_method = db.Column(db.String(50), default='Cash on Delivery', nullable=False)
    payment_status = db.Column(db.String(50), default='Pending', nullable=False) # Pending, Paid, Failed
    order_status = db.Column(db.String(50), default='Pending', nullable=False) 
    # Statuses: Pending, Confirmed, Preparing, Ready, Out for Delivery, Completed, Cancelled
    
    delivery_address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    area = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(30), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'order_type': self.order_type or 'delivery',
            'store_id': self.store_id,
            'store_name': self.store_name,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'subtotal': self.subtotal,
            'delivery_fee': self.delivery_fee,
            'total': self.total,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'order_status': self.order_status,
            'delivery_address': self.delivery_address,
            'city': self.city,
            'area': self.area,
            'postal_code': self.postal_code,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)
    product_name = db.Column(db.String(200), nullable=False)
    product_image = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False) # Preserved historical price
    quantity = db.Column(db.Integer, nullable=False, default=1)
    subtotal = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_image': self.product_image,
            'price': self.price,
            'quantity': self.quantity,
            'subtotal': self.subtotal,
        }
