from datetime import datetime
from app.extensions import db

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    product_type = db.Column(db.String(50), default='coffee', nullable=False)  # 'coffee', 'tea', 'cake'
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    sort_order = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    parent = db.relationship('Category', remote_side=[id], backref=db.backref('children', lazy='joined', order_by='Category.sort_order'))
    products = db.relationship('Product', foreign_keys='Product.category_id', backref='category', lazy='dynamic')

    def to_dict(self, include_children=True):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'product_type': self.product_type,
            'description': self.description,
            'image': self.image,
            'parent_id': self.parent_id,
            'is_active': self.is_active,
            'sort_order': self.sort_order,
            'parent_name': self.parent.name if self.parent else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_children and hasattr(self, 'children'):
            data['children'] = [child.to_dict(include_children=False) for child in self.children if child.is_active]
        return data
