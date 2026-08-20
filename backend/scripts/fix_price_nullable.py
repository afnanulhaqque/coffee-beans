import os
import sqlite3

def fix_price_nullable():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coffee_store.db")
    print(f"Altering products table to allow NULL price in: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("PRAGMA foreign_keys=OFF;")
    
    # 1. Create temporary new products table with nullable price
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(220) UNIQUE NOT NULL,
        source_url VARCHAR(500) UNIQUE,
        description TEXT,
        short_description VARCHAR(300),
        pack_size VARCHAR(50),
        price FLOAT,
        sale_price FLOAT,
        currency VARCHAR(10) DEFAULT 'PKR' NOT NULL,
        sku VARCHAR(100),
        stock_quantity INTEGER DEFAULT 20 NOT NULL,
        image VARCHAR(500),
        thumbnail VARCHAR(500),
        category_id INTEGER REFERENCES categories(id),
        tags VARCHAR(255),
        roast_level VARCHAR(50),
        origin VARCHAR(100),
        flavor_profile TEXT,
        availability VARCHAR(50) DEFAULT 'In Stock',
        is_active BOOLEAN DEFAULT 1 NOT NULL,
        is_featured BOOLEAN DEFAULT 0 NOT NULL,
        is_best_seller BOOLEAN DEFAULT 0 NOT NULL,
        manually_modified BOOLEAN DEFAULT 0 NOT NULL,
        source_last_updated DATETIME,
        last_imported_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """)

    # 2. Copy over common columns
    cursor.execute("""
    INSERT OR IGNORE INTO products_new (
        id, name, slug, source_url, description, short_description, pack_size, price, sale_price, currency,
        sku, stock_quantity, image, thumbnail, category_id, tags, roast_level, origin, flavor_profile,
        availability, is_active, is_featured, is_best_seller, manually_modified, source_last_updated,
        last_imported_at, created_at, updated_at
    )
    SELECT 
        id, name, slug, source_url, description, short_description, pack_size, price, sale_price, currency,
        sku, stock_quantity, image, thumbnail, category_id, tags, roast_level, origin, flavor_profile,
        availability, is_active, is_featured, is_best_seller, manually_modified, source_last_updated,
        last_imported_at, created_at, updated_at
    FROM products;
    """)

    # 3. Drop old and rename
    cursor.execute("DROP TABLE products;")
    cursor.execute("ALTER TABLE products_new RENAME TO products;")
    
    # 4. Create indices
    cursor.execute("CREATE INDEX IF NOT EXISTS ix_products_slug ON products (slug);")
    cursor.execute("CREATE INDEX IF NOT EXISTS ix_products_source_url ON products (source_url);")
    
    cursor.execute("PRAGMA foreign_keys=ON;")
    conn.commit()
    conn.close()
    print("Table products updated successfully with nullable price.")

if __name__ == "__main__":
    fix_price_nullable()
