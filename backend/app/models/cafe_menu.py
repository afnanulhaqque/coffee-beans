from datetime import datetime
from app.extensions import db

class CafeMenuCategory(db.Model):
    __tablename__ = 'cafe_menu_categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    sort_order = db.Column(db.Integer, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    items = db.relationship('CafeMenuItem', backref='category', lazy='joined', order_by='CafeMenuItem.sort_order')

    def to_dict(self, include_items=True):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'sort_order': self.sort_order,
            'is_active': self.is_active,
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items if item.is_active]
        return data


class CafeMenuItem(db.Model):
    __tablename__ = 'cafe_menu_items'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('cafe_menu_categories.id'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(255), nullable=True)
    calories = db.Column(db.String(50), nullable=True)
    is_popular = db.Column(db.Boolean, default=False, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    sort_order = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image': self.image,
            'calories': self.calories,
            'is_popular': self.is_popular,
            'is_active': self.is_active,
            'sort_order': self.sort_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
