import os
import sys
import json
import sqlite3

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DB_PATH = os.path.join(BASE_DIR, 'coffee_store.db')
OUTPUT_SQL_PATH = os.path.join(BASE_DIR, '..', 'supabase_schema_and_data.sql')

def escape_sql_value(val):
    if val is None:
        return 'NULL'
    elif isinstance(val, bool):
        return 'TRUE' if val else 'FALSE'
    elif isinstance(val, (int, float)):
        return str(val)
    elif isinstance(val, str):
        # Escape single quotes
        escaped = val.replace("'", "''")
        return f"'{escaped}'"
    elif isinstance(val, (dict, list)):
        escaped = json.dumps(val).replace("'", "''")
        return f"'{escaped}'"
    else:
        escaped = str(val).replace("'", "''")
        return f"'{escaped}'"

def generate_schema_and_data_sql():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    sql_statements = []
    sql_statements.append("-- ========================================================")
    sql_statements.append("-- COFFEE BEAN & TEA LEAF - SUPABASE POSTGRESQL MIGRATION")
    sql_statements.append("-- Generated automatically for Supabase SQL Editor")
    sql_statements.append("-- ========================================================\n")

    # 1. Enable UUID Extension
    sql_statements.append("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n")

    # 2. Table Definitions
    ddl = """
-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    product_type VARCHAR(50) DEFAULT 'coffee',
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    product_type VARCHAR(50) DEFAULT 'coffee',
    short_description VARCHAR(300),
    description TEXT,
    price NUMERIC(10,2),
    sale_price NUMERIC(10,2),
    sku VARCHAR(50) UNIQUE,
    stock_quantity INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    main_image VARCHAR(255),
    roast_type VARCHAR(50),
    flavor_notes TEXT,
    origin VARCHAR(100),
    caffeine_level VARCHAR(50),
    package_weight VARCHAR(50),
    grind_options JSONB DEFAULT '[]'::jsonb,
    size_options JSONB DEFAULT '{}'::jsonb,
    milk_options JSONB DEFAULT '[]'::jsonb,
    flavor_options JSONB DEFAULT '[]'::jsonb,
    tea_type VARCHAR(50),
    caffeine_type VARCHAR(50),
    beverage_type VARCHAR(50),
    base VARCHAR(100),
    hot_available BOOLEAN DEFAULT TRUE,
    iced_available BOOLEAN DEFAULT FALSE,
    extra_shot_available BOOLEAN DEFAULT FALSE,
    whipped_cream_available BOOLEAN DEFAULT FALSE,
    customization_enabled BOOLEAN DEFAULT FALSE,
    category_name VARCHAR(100),
    category_slug VARCHAR(120),
    source_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Categories Join Table
CREATE TABLE IF NOT EXISTS product_categories (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 5. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(150),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0
);

-- 6. Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) DEFAULT 'Punjab',
    address TEXT NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(120),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    has_drive_thru BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT TRUE,
    has_dine_in BOOLEAN DEFAULT TRUE,
    has_takeaway BOOLEAN DEFAULT TRUE,
    has_outdoor_seating BOOLEAN DEFAULT FALSE,
    has_wheelchair_access BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Store Opening Hours Table
CREATE TABLE IF NOT EXISTS store_opening_hours (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    open_time VARCHAR(10),
    close_time VARCHAR(10),
    is_closed BOOLEAN DEFAULT FALSE,
    is_24_hours BOOLEAN DEFAULT FALSE
);

-- 8. Cafe Menu Categories Table
CREATE TABLE IF NOT EXISTS cafe_menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. Cafe Menu Items Table
CREATE TABLE IF NOT EXISTS cafe_menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES cafe_menu_categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image_url VARCHAR(255),
    calories VARCHAR(50),
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- 10. Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    image_url VARCHAR(255) NOT NULL,
    mobile_image_url VARCHAR(255),
    link_url VARCHAR(255),
    button_text VARCHAR(50) DEFAULT 'Shop Now',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    position VARCHAR(50) DEFAULT 'hero_slider',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    group_name VARCHAR(50) DEFAULT 'general',
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    order_type VARCHAR(20) DEFAULT 'delivery',
    delivery_address TEXT,
    city VARCHAR(100),
    area VARCHAR(100),
    postal_code VARCHAR(20),
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    store_name VARCHAR(150),
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    tax_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    order_status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    product_sku VARCHAR(50),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    selected_options JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS Policies (Allow read/write for anon and authenticated users)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow Public Access (SELECT)
CREATE POLICY IF NOT EXISTS "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view stores" ON stores FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view store_hours" ON store_opening_hours FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view cafe_categories" ON cafe_menu_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view cafe_items" ON cafe_menu_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view banners" ON banners FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public can view order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public can view users" ON users FOR SELECT USING (true);
"""
    sql_statements.append(ddl)
    sql_statements.append("\n-- ========================================================")
    sql_statements.append("-- DATA INSERTS")
    sql_statements.append("-- ========================================================\n")

    # Ordered table insert list to respect foreign keys
    tables_order = [
        'users',
        'categories',
        'products',
        'product_categories',
        'product_images',
        'stores',
        'store_opening_hours',
        'cafe_menu_categories',
        'cafe_menu_items',
        'banners',
        'settings',
        'orders',
        'order_items'
    ]

    for table in tables_order:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        if not rows:
            continue
        
        col_names = [description[0] for description in cursor.description]
        # In SQLite group column is group or group_name
        pg_cols = []
        for c in col_names:
            if table == 'settings' and c == 'group':
                pg_cols.append('group_name')
            else:
                pg_cols.append(c)

        sql_statements.append(f"\n-- Data for {table} ({len(rows)} records)")
        for row in rows:
            val_strs = []
            for idx, col in enumerate(col_names):
                val = row[col]
                # Fix boolean integers
                if isinstance(val, int) and col in ('is_active', 'is_featured', 'is_closed', 'is_24_hours', 'has_drive_thru', 'has_wifi', 'has_dine_in', 'has_takeaway', 'has_outdoor_seating', 'has_wheelchair_access', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'is_available', 'hot_available', 'iced_available', 'extra_shot_available', 'whipped_cream_available', 'customization_enabled', 'is_primary'):
                    val = bool(val)
                
                # Check json fields
                if col in ('grind_options', 'size_options', 'milk_options', 'flavor_options', 'selected_options') and isinstance(val, str):
                    try:
                        parsed = json.loads(val)
                        val = json.dumps(parsed)
                    except Exception:
                        pass

                val_strs.append(escape_sql_value(val))

            cols_str = ", ".join(pg_cols)
            vals_str = ", ".join(val_strs)
            sql_statements.append(f"INSERT INTO {table} ({cols_str}) VALUES ({vals_str}) ON CONFLICT DO NOTHING;")

    # Reset sequences for auto-increment IDs
    sql_statements.append("\n-- ========================================================")
    sql_statements.append("-- RESET SERIAL SEQUENCES")
    sql_statements.append("-- ========================================================")
    for table in ['users', 'categories', 'products', 'product_images', 'stores', 'store_opening_hours', 'cafe_menu_categories', 'cafe_menu_items', 'banners', 'settings', 'orders', 'order_items']:
        sql_statements.append(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) + 1 FROM {table}), 1), false);")

    full_sql = "\n".join(sql_statements)
    with open(OUTPUT_SQL_PATH, 'w', encoding='utf-8') as f:
        f.write(full_sql)

    print(f"Successfully generated {OUTPUT_SQL_PATH} ({len(full_sql)} bytes)")

if __name__ == '__main__':
    generate_schema_and_data_sql()
