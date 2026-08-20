import os
import sqlite3

def migrate():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coffee_store.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Columns to add to products table if missing
    product_cols = [
        ("product_type", "TEXT DEFAULT 'coffee'"),
        ("subcategory_id", "INTEGER"),
        ("tea_type", "TEXT"),
        ("caffeine", "TEXT"),
        ("ingredients", "TEXT"),
        ("brewing_instructions", "TEXT"),
        ("cake_type", "TEXT"),
        ("flavor", "TEXT"),
        ("size", "TEXT"),
        ("weight", "TEXT"),
        ("serving_size", "TEXT"),
        ("allergen_information", "TEXT"),
    ]

    cursor.execute("PRAGMA table_info(products)")
    existing_product_cols = [row[1] for row in cursor.fetchall()]

    for col_name, col_def in product_cols:
        if col_name not in existing_product_cols:
            print(f"Adding column '{col_name}' to products...")
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_def}")

    # Columns to add to categories table if missing
    cursor.execute("PRAGMA table_info(categories)")
    existing_cat_cols = [row[1] for row in cursor.fetchall()]
    if "product_type" not in existing_cat_cols:
        print("Adding column 'product_type' to categories...")
        cursor.execute("ALTER TABLE categories ADD COLUMN product_type TEXT DEFAULT 'coffee'")

    conn.commit()
    conn.close()
    print("Schema migration completed successfully!")

if __name__ == "__main__":
    migrate()
