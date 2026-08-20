import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.store import Store, StoreOpeningHours

app = create_app()

with app.app_context():
    legacy_stores = Store.query.filter(Store.id.in_([1, 2, 3, 4, 5, 6])).all()
    print(f"Removing {len(legacy_stores)} legacy mock stores...")
    for s in legacy_stores:
        StoreOpeningHours.query.filter_by(store_id=s.id).delete()
        db.session.delete(s)
    db.session.commit()
    print("Legacy mock stores removed!")
