import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.store import Store

app = create_app()

with app.app_context():
    stores = Store.query.all()
    print(f"Total stores: {len(stores)}")
    for s in stores:
        print(f"ID: {s.id} | Slug: {s.slug} | Name: {s.name} | City: {s.city}")
