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
