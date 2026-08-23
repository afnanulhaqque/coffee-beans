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
        escaped = val.replace("'", "''")
        return f"'{escaped}'"
    elif isinstance(val, (dict, list)):
        escaped = json.dumps(val).replace("'", "''")
        return f"'{escaped}'"
    else:
        escaped = str(val).replace("'", "''")
        return f"'{escaped}'"

def get_sqlite_type_to_pg(col_name, col_type, table_name):
    col_upper = col_type.upper()
    name_lower = col_name.lower()

    if col_name == 'id':
        return 'SERIAL PRIMARY KEY'
    
    if name_lower in ('is_active', 'is_featured', 'is_closed', 'is_24_hours', 'has_drive_thru', 
                      'has_wifi', 'has_dine_in', 'has_takeaway', 'has_outdoor_seating', 
                      'has_wheelchair_access', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 
                      'is_available', 'hot_available', 'iced_available', 'extra_shot_available', 
                      'whipped_cream_available', 'customization_enabled', 'is_primary'):
        return 'BOOLEAN DEFAULT TRUE'
    
    if name_lower in ('grind_options', 'size_options', 'milk_options', 'flavor_options', 'selected_options'):
        return 'JSONB DEFAULT \'[]\'::jsonb'

    if 'INT' in col_upper:
        return 'INTEGER DEFAULT 0'
    elif 'NUMERIC' in col_upper or 'FLOAT' in col_upper or 'REAL' in col_upper or 'DOUBLE' in col_upper:
        if name_lower in ('latitude', 'longitude'):
            return 'DOUBLE PRECISION'
        return 'NUMERIC(10,2) DEFAULT 0.00'
    elif 'DATETIME' in col_upper or 'TIMESTAMP' in col_upper or name_lower in ('created_at', 'updated_at'):
        return 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP'
    elif 'TEXT' in col_upper:
        return 'TEXT'
    elif 'VARCHAR' in col_upper:
        return col_type
    else:
        return 'TEXT'

def generate_exact_schema_and_data():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

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

    sql_statements = []
    sql_statements.append("-- ========================================================")
    sql_statements.append("-- COFFEE BEAN & TEA LEAF - SUPABASE POSTGRESQL MIGRATION")
    sql_statements.append("-- Generated automatically with exact SQLite table schemas")
    sql_statements.append("-- ========================================================\n")

    sql_statements.append("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n")

    # Drop existing tables cleanly to avoid half-created column mismatch errors
    sql_statements.append("-- ========================================================")
    sql_statements.append("-- CLEAN EXISTING TABLES (FRESH MIGRATION)")
    sql_statements.append("-- ========================================================")
    for table in reversed(tables_order):
        sql_statements.append(f"DROP TABLE IF EXISTS {table} CASCADE;")
    sql_statements.append("\n")

    # Generate CREATE TABLE for each table based on PRAGMA table_info
    for table in tables_order:
        cursor.execute(f"PRAGMA table_info({table});")
        columns = cursor.fetchall()
        if not columns:
            continue

        sql_statements.append(f"-- Table: {table}")
        col_defs = []
        for col in columns:
            cid, col_name, col_type, notnull, dflt, pk = col
            
            # Map column name if needed (e.g. settings.group -> group_name if required or keep quoted)
            pg_col_name = f'"{col_name}"' if col_name in ('group', 'order', 'user', 'primary') else col_name

            if pk and col_name == 'id':
                col_defs.append(f"    {pg_col_name} SERIAL PRIMARY KEY")
            else:
                pg_type = get_sqlite_type_to_pg(col_name, col_type, table)
                null_str = " NOT NULL" if notnull and not pk else ""
                col_defs.append(f"    {pg_col_name} {pg_type}{null_str}")

        if table == 'product_categories':
            col_defs.append("    PRIMARY KEY (product_id, category_id)")

        cols_body = ",\n".join(col_defs)
        sql_statements.append(f"CREATE TABLE IF NOT EXISTS {table} (\n{cols_body}\n);\n")

    # Add RLS & Policies
    sql_statements.append("-- ========================================================")
    sql_statements.append("-- ROW LEVEL SECURITY & POLICIES")
    sql_statements.append("-- ========================================================")
    for table in tables_order:
        sql_statements.append(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
        sql_statements.append(f"DROP POLICY IF EXISTS \"Public can view {table}\" ON {table};")
        sql_statements.append(f"CREATE POLICY \"Public can view {table}\" ON {table} FOR SELECT USING (true);")
        
        if table in ('orders', 'order_items', 'users'):
            sql_statements.append(f"DROP POLICY IF EXISTS \"Public can insert {table}\" ON {table};")
            sql_statements.append(f"CREATE POLICY \"Public can insert {table}\" ON {table} FOR INSERT WITH CHECK (true);")
            sql_statements.append(f"DROP POLICY IF EXISTS \"Public can update {table}\" ON {table};")
            sql_statements.append(f"CREATE POLICY \"Public can update {table}\" ON {table} FOR UPDATE USING (true);")

    # Generate Data Inserts
    sql_statements.append("\n-- ========================================================")
    sql_statements.append("-- DATA INSERTS")
    sql_statements.append("-- ========================================================\n")

    for table in tables_order:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        if not rows:
            continue

        raw_cols = [description[0] for description in cursor.description]
        quoted_cols = [f'"{c}"' if c in ('group', 'order', 'user', 'primary') else c for c in raw_cols]
        cols_str = ", ".join(quoted_cols)

        sql_statements.append(f"-- Data for {table} ({len(rows)} records)")
        for row in rows:
            val_strs = []
            for col in raw_cols:
                val = row[col]
                # Booleans
                if col.startswith('is_') or col.startswith('has_') or col.endswith('_available') or col == 'customization_enabled':
                    if val is not None:
                        val = bool(val)
                # JSON
                if col in ('grind_options', 'size_options', 'milk_options', 'flavor_options', 'selected_options') and isinstance(val, str):
                    try:
                        parsed = json.loads(val)
                        val = json.dumps(parsed)
                    except Exception:
                        pass
                val_strs.append(escape_sql_value(val))

            vals_str = ", ".join(val_strs)
            sql_statements.append(f"INSERT INTO {table} ({cols_str}) VALUES ({vals_str}) ON CONFLICT DO NOTHING;")

    # Reset Sequences
    sql_statements.append("\n-- ========================================================")
    sql_statements.append("-- RESET SERIAL SEQUENCES")
    sql_statements.append("-- ========================================================")
    for table in tables_order:
        if table != 'product_categories':
            sql_statements.append(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) + 1 FROM {table}), 1), false);")

    full_sql = "\n".join(sql_statements)
    with open(OUTPUT_SQL_PATH, 'w', encoding='utf-8') as f:
        f.write(full_sql)

    print(f"Generated {OUTPUT_SQL_PATH} with EXACT matching schema ({len(full_sql)} bytes)")

if __name__ == '__main__':
    generate_exact_schema_and_data()
