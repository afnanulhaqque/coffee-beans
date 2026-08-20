from app import create_app
from app.extensions import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    with db.engine.connect() as conn:
        for col, col_type in [('order_type', "VARCHAR(30) DEFAULT 'delivery'"), ('store_id', 'INTEGER'), ('store_name', 'VARCHAR(120)')]:
            try:
                conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col} {col_type}"))
                print(f"Added column {col}")
            except Exception as ex:
                print(f"Column {col} notice: {ex}")
        conn.commit()
    print("Database migration complete.")
