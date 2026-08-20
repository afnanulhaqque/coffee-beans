import sqlite3
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(backend_dir, "coffee_store.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(product_images)")
cols = [col[1] for col in cursor.fetchall()]
print(f"product_images cols: {cols}")

if 'created_at' not in cols:
    cursor.execute("ALTER TABLE product_images ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
    print("Added created_at to product_images")

conn.commit()
conn.close()
