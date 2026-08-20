from datetime import datetime
from app.extensions import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False, index=True)
    source_url = db.Column(db.String(500), unique=True, nullable=True, index=True)
    description = db.Column(db.Text, nullable=True)
    short_description = db.Column(db.String(300), nullable=True)
    price = db.Column(db.Float, nullable=False)
    sale_price = db.Column(db.Float, nullable=True)
    sku = db.Column(db.String(100), nullable=True)
    stock_quantity = db.Column(db.Integer, default=20, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    tags = db.Column(db.String(255), nullable=True)
    roast_level = db.Column(db.String(50), nullable=True)
    origin = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    is_best_seller = db.Column(db.Boolean, default=False, nullable=False)
    manually_modified = db.Column(db.Boolean, default=False, nullable=False)
    source_last_updated = db.Column(db.DateTime, nullable=True)
    last_imported_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    gallery_images = db.relationship('ProductImage', backref='product', cascade='all, delete-orphan', lazy='joined', order_by='ProductImage.sort_order')

    def effective_price(self):
        return self.sale_price if self.sale_price and self.sale_price > 0 else self.price

    def is_in_stock(self):
        return self.stock_quantity > 0

    def to_dict(self):
        gallery = [img.image_url for img in self.gallery_images] if self.gallery_images else []
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'source_url': self.source_url,
            'description': self.description,
            'short_description': self.short_description,
            'price': self.price,
            'sale_price': self.sale_price,
            'effective_price': self.effective_price(),
            'sku': self.sku,
            'stock_quantity': self.stock_quantity,
            'is_in_stock': self.is_in_stock(),
            'image': self.image,
            'gallery_images': [img.to_dict() for img in (self.gallery_images or [])],
            'additional_images': gallery,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'category_slug': self.category.slug if self.category else None,
            'tags': [t.strip() for t in self.tags.split(',')] if self.tags else [],
            'roast_level': self.roast_level,
            'origin': self.origin,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'is_best_seller': self.is_best_seller,
            'manually_modified': self.manually_modified,
            'last_imported_at': self.last_imported_at.isoformat() if self.last_imported_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class ProductImage(db.Model):
    __tablename__ = 'product_images'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    sort_order = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'sort_order': self.sort_order,
        }
