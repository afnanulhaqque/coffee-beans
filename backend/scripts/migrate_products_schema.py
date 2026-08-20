import os
import sqlite3

def migrate_db():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coffee_store.db")
    print(f"Migrating SQLite DB at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get existing columns in products
    cursor.execute("PRAGMA table_info(products)")
    existing_cols = [row[1] for row in cursor.fetchall()]
    print("Existing columns in products:", existing_cols)

    new_columns = [
        ("pack_size", "TEXT"),
        ("currency", "TEXT DEFAULT 'PKR'"),
        ("thumbnail", "TEXT"),
        ("flavor_profile", "TEXT"),
        ("availability", "TEXT DEFAULT 'In Stock'"),
    ]

    for col_name, col_type in new_columns:
        if col_name not in existing_cols:
            print(f"Adding column {col_name} ({col_type}) to products...")
            try:
                cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
            except Exception as e:
                print(f"Error adding column {col_name}: {e}")

    conn.commit()
    conn.close()
    print("Migration completed successfully.")

if __name__ == "__main__":
    migrate_db()
