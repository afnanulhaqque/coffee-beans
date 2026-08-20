from datetime import datetime
from app.extensions import db

class Banner(db.Model):
    __tablename__ = 'banners'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(300), nullable=True)
    description = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=False)
    button_text = db.Column(db.String(100), default='Shop Now')
    button_url = db.Column(db.String(255), default='/shop')
    badge_text = db.Column(db.String(100), nullable=True) # e.g. "Special Reserve" or "Limited Edition"
    banner_type = db.Column(db.String(50), default='hero') # 'hero', 'promotional', 'middle'
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    sort_order = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'image': self.image,
            'button_text': self.button_text,
            'button_url': self.button_url,
            'badge_text': self.badge_text,
            'banner_type': self.banner_type,
            'is_active': self.is_active,
            'sort_order': self.sort_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
