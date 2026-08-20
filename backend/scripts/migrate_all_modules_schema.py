import sqlite3
import os

def migrate_database():
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(backend_dir, "coffee_store.db")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print(f"Connecting to database at: {db_path}")

    # 1. Update categories table
    cursor.execute("PRAGMA table_info(categories)")
    cat_columns = [col[1] for col in cursor.fetchall()]
    print(f"Categories columns: {cat_columns}")
    
    if 'product_type' not in cat_columns:
        cursor.execute("ALTER TABLE categories ADD COLUMN product_type VARCHAR(50) DEFAULT 'coffee'")
        print("Added product_type to categories.")
    if 'sort_order' not in cat_columns:
        cursor.execute("ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0")
        print("Added sort_order to categories.")

    # 2. Update products table
    cursor.execute("PRAGMA table_info(products)")
    prod_columns = [col[1] for col in cursor.fetchall()]
    print(f"Products columns count: {len(prod_columns)}")

    new_prod_cols = [
        ('product_type', 'VARCHAR(50) DEFAULT "coffee"'),
        ('hot_available', 'BOOLEAN DEFAULT 1'),
        ('iced_available', 'BOOLEAN DEFAULT 1'),
        ('beverage_type', 'VARCHAR(100)'),
        ('base', 'VARCHAR(100)'),
        ('size_options', 'TEXT'),
        ('milk_options', 'TEXT'),
        ('flavor_options', 'TEXT'),
        ('extra_shot_available', 'BOOLEAN DEFAULT 0'),
        ('whipped_cream_available', 'BOOLEAN DEFAULT 0'),
        ('customization_enabled', 'BOOLEAN DEFAULT 0'),
        ('portion', 'VARCHAR(100)'),
        ('calories', 'VARCHAR(50)'),
        ('nutrition', 'TEXT'),
        ('allergens', 'TEXT'),
        ('dietary_information', 'VARCHAR(100)'),
        ('spice_level', 'VARCHAR(50)'),
        ('serving_information', 'TEXT'),
        ('source_url', 'VARCHAR(500)'),
        ('is_available', 'BOOLEAN DEFAULT 1'),
        ('tea_type', 'VARCHAR(100)'),
        ('caffeine', 'VARCHAR(100)'),
        ('ingredients', 'TEXT'),
        ('brewing_instructions', 'TEXT'),
        ('cake_type', 'VARCHAR(100)'),
        ('flavor', 'VARCHAR(100)'),
        ('size', 'VARCHAR(50)'),
        ('weight', 'VARCHAR(50)'),
        ('serving_size', 'VARCHAR(50)'),
        ('allergen_information', 'TEXT')
    ]

    for col_name, col_type in new_prod_cols:
        if col_name not in prod_columns:
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
            print(f"Added {col_name} to products.")

    # 3. Create product_categories join table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS product_categories (
        product_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
    """)
    print("Checked/created product_categories join table.")

    # 4. Update stores table
    cursor.execute("PRAGMA table_info(stores)")
    store_columns = [col[1] for col in cursor.fetchall()]

    new_store_cols = [
        ('slug', 'VARCHAR(150)'),
        ('province', 'VARCHAR(100)'),
        ('country', 'VARCHAR(100) DEFAULT "Pakistan"'),
        ('google_maps_url', 'VARCHAR(500)'),
        ('description', 'TEXT'),
        ('featured', 'BOOLEAN DEFAULT 0'),
        ('delivery_available', 'BOOLEAN DEFAULT 1'),
        ('dine_in', 'BOOLEAN DEFAULT 1'),
        ('takeaway', 'BOOLEAN DEFAULT 1'),
        ('drive_thru', 'BOOLEAN DEFAULT 0'),
        ('wifi', 'BOOLEAN DEFAULT 1'),
        ('outdoor_seating', 'BOOLEAN DEFAULT 0'),
        ('parking', 'BOOLEAN DEFAULT 1'),
        ('accessible', 'BOOLEAN DEFAULT 1'),
        ('source_url', 'VARCHAR(500)'),
        ('status', 'VARCHAR(50) DEFAULT "Active"')
    ]

    for col_name, col_type in new_store_cols:
        if col_name not in store_columns:
            cursor.execute(f"ALTER TABLE stores ADD COLUMN {col_name} {col_type}")
            print(f"Added {col_name} to stores.")

    # 5. Create store_opening_hours table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS store_opening_hours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id INTEGER NOT NULL,
        day_of_week VARCHAR(20) NOT NULL,
        open_time VARCHAR(10),
        close_time VARCHAR(10),
        is_closed BOOLEAN DEFAULT 0,
        is_24_hours BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    )
    """)
    print("Checked/created store_opening_hours table.")

    conn.commit()
    conn.close()
    print("[SUCCESS] Database migration completed successfully.")

if __name__ == '__main__':
    migrate_database()
