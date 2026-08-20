import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.product import Product

app = create_app()

with app.app_context():
    # IDs 1 to 13 were initial seed sample products
    samples = Product.query.filter(Product.id.in_(list(range(1, 14)))).all()
    print(f"Removing {len(samples)} legacy sample products...")
    for s in samples:
        db.session.delete(s)
    db.session.commit()
    print("Legacy samples removed!")
