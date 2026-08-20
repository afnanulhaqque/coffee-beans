from app import create_app
from app.extensions import db
from app.utils.seeder import seed_data

app = create_app()

def seed_database():
    with app.app_context():
        print("Recreating database tables...")
        db.drop_all()
        db.create_all()
        print("Seeding default data (users, categories, products, stores, cafe menu, banners, settings)...")
        seed_data(db.session)
        print("Base database seeded successfully!")

if __name__ == '__main__':
    seed_database()
