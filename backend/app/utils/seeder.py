import os
import sys
from app.extensions import db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.store import Store, StoreOpeningHours
from app.models.banner import Banner
from app.models.setting import Setting
from app.routes.settings import DEFAULT_SETTINGS

def seed_data(session=None):
    if session is None:
        session = db.session

    # 1. Admin & Customer Users
    if not User.query.filter_by(email="admin@coffeebean.com").first():
        admin = User(
            name="Store Administrator",
            email="admin@coffeebean.com",
            phone="+92 300 0000000",
            role="admin",
            is_active=True
        )
        admin.set_password("admin123")
        session.add(admin)

    # 2. Settings
    for k, v in DEFAULT_SETTINGS.items():
        if not Setting.query.filter_by(key=k).first():
            session.add(Setting(key=k, value=v, group="general"))

    session.commit()

    # 3. Seed Full Official Catalogs if database is fresh / unseeded
    if Product.query.count() < 100 or Store.query.count() < 30:
        try:
            backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            scripts_dir = os.path.join(backend_dir, 'scripts')
            if scripts_dir not in sys.path:
                sys.path.insert(0, scripts_dir)

            import seed_coffee_catalog
            import seed_tea_and_cake_catalog
            import seed_all_modules

            if hasattr(seed_coffee_catalog, 'seed_database'):
                seed_coffee_catalog.seed_database()
            if hasattr(seed_tea_and_cake_catalog, 'seed_catalogs'):
                seed_tea_and_cake_catalog.seed_catalogs()
            if hasattr(seed_all_modules, 'seed_all'):
                seed_all_modules.seed_all()
        except Exception as e:
            print(f"[SEEDER WARNING] Auto-seed execution encountered: {e}")
