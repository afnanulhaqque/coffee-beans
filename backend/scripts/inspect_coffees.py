import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.product import Product

app = create_app()

with app.app_context():
    coffees = Product.query.filter_by(product_type='coffee').all()
    print(f"Total coffees: {len(coffees)}")
    for c in coffees:
        print(f"ID: {c.id} | Slug: {c.slug} | Name: {c.name} | Price: {c.price}")
