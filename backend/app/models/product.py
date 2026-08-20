import json
from datetime import datetime
from app.extensions import db

# Secondary association table for many-to-many relationship
product_categories = db.Table(
    'product_categories',
    db.Column('product_id', db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
)

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False, index=True)
    product_type = db.Column(db.String(50), default='coffee', nullable=False, index=True)  # 'coffee', 'tea', 'cake', 'beverage', 'food'
    source_url = db.Column(db.String(500), unique=True, nullable=True, index=True)
    description = db.Column(db.Text, nullable=True)
    short_description = db.Column(db.String(300), nullable=True)
    pack_size = db.Column(db.String(50), nullable=True)
    price = db.Column(db.Float, nullable=True)  # Nullable if price is not provided by official source
    sale_price = db.Column(db.Float, nullable=True)
    currency = db.Column(db.String(10), default='PKR', nullable=False)
    sku = db.Column(db.String(100), nullable=True)
    stock_quantity = db.Column(db.Integer, default=50, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    thumbnail = db.Column(db.String(500), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    tags = db.Column(db.String(255), nullable=True)
    
    # Coffee specific attributes
    roast_level = db.Column(db.String(50), nullable=True)
    origin = db.Column(db.String(100), nullable=True)
    flavor_profile = db.Column(db.Text, nullable=True)
    
    # Tea specific attributes
    tea_type = db.Column(db.String(100), nullable=True)
    caffeine = db.Column(db.String(100), nullable=True)
    ingredients = db.Column(db.Text, nullable=True)
    brewing_instructions = db.Column(db.Text, nullable=True)
    
    # Cake specific attributes
    cake_type = db.Column(db.String(100), nullable=True)
    flavor = db.Column(db.String(100), nullable=True)
    size = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.String(50), nullable=True)
    serving_size = db.Column(db.String(50), nullable=True)
    allergen_information = db.Column(db.Text, nullable=True)

    # Beverage specific attributes
    hot_available = db.Column(db.Boolean, default=True, nullable=True)
    iced_available = db.Column(db.Boolean, default=True, nullable=True)
    beverage_type = db.Column(db.String(100), nullable=True)
    base = db.Column(db.String(100), nullable=True)
    size_options = db.Column(db.Text, nullable=True)  # JSON string e.g. {"Small": 650, "Regular": 750, "Large": 850}
    milk_options = db.Column(db.Text, nullable=True)  # JSON string e.g. ["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]
    flavor_options = db.Column(db.Text, nullable=True)  # JSON string e.g. ["Vanilla", "Caramel", "Hazelnut", "Chocolate"]
    extra_shot_available = db.Column(db.Boolean, default=False, nullable=True)
    whipped_cream_available = db.Column(db.Boolean, default=False, nullable=True)
    customization_enabled = db.Column(db.Boolean, default=False, nullable=True)

    # Food specific attributes
    portion = db.Column(db.String(100), nullable=True)
    calories = db.Column(db.String(50), nullable=True)
    nutrition = db.Column(db.Text, nullable=True)
    allergens = db.Column(db.Text, nullable=True)
    dietary_information = db.Column(db.String(100), nullable=True)
    spice_level = db.Column(db.String(50), nullable=True)
    serving_information = db.Column(db.Text, nullable=True)

    availability = db.Column(db.String(50), default='In Stock', nullable=True)
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    is_best_seller = db.Column(db.Boolean, default=False, nullable=False)
    manually_modified = db.Column(db.Boolean, default=False, nullable=False)
    source_last_updated = db.Column(db.DateTime, nullable=True)
    last_imported_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    gallery_images = db.relationship('ProductImage', backref='product', cascade='all, delete-orphan', lazy='joined', order_by='ProductImage.sort_order')
    categories = db.relationship('Category', secondary=product_categories, backref=db.backref('tagged_products', lazy='dynamic'), lazy='joined')

    def effective_price(self):
        if self.sale_price and self.sale_price > 0:
            return self.sale_price
        return self.price

    def is_in_stock(self):
        return self.is_available and (self.stock_quantity > 0) and (self.availability != 'Out of Stock')

    def get_product_url(self):
        if self.product_type == 'tea':
            return f'/tea/{self.slug}'
        elif self.product_type == 'cake':
            return f'/cake-to-go/{self.slug}'
        elif self.product_type == 'beverage':
            return f'/beverage/{self.slug}'
        elif self.product_type == 'food':
            return f'/food/{self.slug}'
        return f'/coffee/{self.slug}'

    def parse_json_field(self, field_value):
        if not field_value:
            return None
        if isinstance(field_value, (list, dict)):
            return field_value
        try:
            return json.loads(field_value)
        except Exception:
            return field_value

    def to_dict(self):
        gallery = [img.image_url for img in self.gallery_images] if self.gallery_images else []
        
        # Build category hierarchy info
        cat_name = self.category.name if self.category else None
        cat_slug = self.category.slug if self.category else None
        
        # Gather all assigned categories
        all_categories = []
        if self.category:
            if self.category.parent:
                all_categories.append(self.category.parent.name)
            all_categories.append(self.category.name)
        for cat in (self.categories or []):
            if cat.name not in all_categories:
                all_categories.append(cat.name)

        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'product_type': self.product_type or 'coffee',
            'product_url': self.get_product_url(),
            'source_url': self.source_url,
            'description': self.description,
            'short_description': self.short_description,
            'pack_size': self.pack_size,
            'price': self.price,
            'sale_price': self.sale_price,
            'effective_price': self.effective_price(),
            'currency': self.currency or 'PKR',
            'sku': self.sku,
            'stock_quantity': self.stock_quantity,
            'is_in_stock': self.is_in_stock(),
            'is_available': self.is_available,
            'availability': self.availability or ('In Stock' if self.is_in_stock() else 'Out of Stock'),
            'image': self.image,
            'image_url': self.image,
            'thumbnail': self.thumbnail or self.image,
            'thumbnail_url': self.thumbnail or self.image,
            'gallery_images': [img.to_dict() for img in (self.gallery_images or [])],
            'additional_images': gallery,
            'category': cat_name,
            'category_id': self.category_id,
            'subcategory_id': self.subcategory_id,
            'category_name': cat_name,
            'category_slug': cat_slug,
            'categories': all_categories,
            'all_categories': [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in (self.categories or [])],
            'tags': [t.strip() for t in self.tags.split(',')] if self.tags else [],
            'roast_level': self.roast_level,
            'origin': self.origin,
            'flavor_profile': self.flavor_profile,
            'tea_type': self.tea_type,
            'caffeine': self.caffeine,
            'ingredients': self.ingredients,
            'brewing_instructions': self.brewing_instructions,
            'cake_type': self.cake_type,
            'flavor': self.flavor,
            'size': self.size,
            'weight': self.weight,
            'serving_size': self.serving_size,
            'allergen_information': self.allergen_information,
            'hot_available': self.hot_available,
            'iced_available': self.iced_available,
            'beverage_type': self.beverage_type,
            'base': self.base,
            'size_options': self.parse_json_field(self.size_options),
            'milk_options': self.parse_json_field(self.milk_options),
            'flavor_options': self.parse_json_field(self.flavor_options),
            'extra_shot_available': self.extra_shot_available,
            'whipped_cream_available': self.whipped_cream_available,
            'customization_enabled': self.customization_enabled,
            'portion': self.portion,
            'calories': self.calories,
            'nutrition': self.nutrition,
            'allergens': self.allergens or self.allergen_information,
            'dietary_information': self.dietary_information,
            'spice_level': self.spice_level,
            'serving_information': self.serving_information,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'is_best_seller': self.is_best_seller,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(200), nullable=True)
    sort_order = db.Column(db.Integer, default=0, nullable=False)
    is_primary = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'alt_text': self.alt_text,
            'sort_order': self.sort_order,
            'is_primary': self.is_primary,
        }
