import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.product import Product
from app.models.category import Category
from app.models.store import Store, StoreOpeningHours

app = create_app()

with app.app_context():
    print("==================================================")
    print("FULL SYSTEM & MODULES VERIFICATION REPORT")
    print("==================================================")

    # 1. Product Counts Verification
    coffees = Product.query.filter_by(product_type='coffee').all()
    teas = Product.query.filter_by(product_type='tea').all()
    cakes = Product.query.filter_by(product_type='cake').all()
    beverages = Product.query.filter_by(product_type='beverage').all()
    foods = Product.query.filter_by(product_type='food').all()

    print(f"\n[CATALOG COUNTS]")
    print(f"• Packaged Coffee Beans: {len(coffees)} / 18 expected")
    print(f"• Packaged Artisan Teas: {len(teas)} / 26 expected")
    print(f"• Cake To Go Products:   {len(cakes)} / 6 expected")
    print(f"• Cafe Menu Beverages:   {len(beverages)} / 45 expected")
    print(f"• Cafe Menu Food Items:  {len(foods)} / 29 expected")
    print(f"• TOTAL ACTIVE CATALOG:  {len(coffees) + len(teas) + len(cakes) + len(beverages) + len(foods)} / 124 expected")

    assert len(coffees) == 18, f"Expected 18 coffees, got {len(coffees)}"
    assert len(teas) == 26, f"Expected 26 teas, got {len(teas)}"
    assert len(cakes) == 6, f"Expected 6 cakes, got {len(cakes)}"
    assert len(beverages) == 45, f"Expected 45 beverages, got {len(beverages)}"
    assert len(foods) == 29, f"Expected 29 food items, got {len(foods)}"

    # 2. Image Asset Verification
    project_root = os.path.dirname(backend_dir)
    public_dir = os.path.join(project_root, "public")

    missing_images = []
    all_products = coffees + teas + cakes + beverages + foods
    for p in all_products:
        if p.image and p.image.startswith('/'):
            rel_path = p.image.lstrip('/')
            full_path = os.path.join(public_dir, rel_path)
            if not os.path.exists(full_path):
                missing_images.append((p.name, p.image))

    print(f"\n[IMAGE ASSET VERIFICATION]")
    if missing_images:
        print(f"[FAIL] Missing {len(missing_images)} image files:")
        for name, img in missing_images[:5]:
            print(f"  - {name}: {img}")
        sys.exit(1)
    else:
        print(f"[PASS] 100% of product images ({len(all_products)} files) exist on disk in /public!")

    # 3. Store Locator Verification
    stores = Store.query.all()
    print(f"\n[STORE LOCATOR VERIFICATION]")
    print(f"• Total Physical Stores: {len(stores)} / 33 expected")
    assert len(stores) == 33, f"Expected 33 stores, got {len(stores)}"

    cities = sorted(list(set(s.city for s in stores)))
    print(f"• Unique Cities Represented ({len(cities)}): {', '.join(cities)}")
    assert len(cities) >= 10, f"Expected at least 10 cities, got {len(cities)}"

    # Test dynamic open status
    open_count = 0
    closed_count = 0
    for s in stores:
        status = s.get_current_status()
        assert 'is_open' in status
        assert 'badge' in status
        if status['is_open']:
            open_count += 1
        else:
            closed_count += 1

    print(f"• Live Pakistan Time Status Calculator: {open_count} Open, {closed_count} Closed")

    # 4. API Endpoints Simulation
    client = app.test_client()

    bev_res = client.get('/api/beverages')
    assert bev_res.status_code == 200
    bev_data = bev_res.get_json()
    assert bev_data['total'] == 45
    print(f"[PASS] GET /api/beverages returns 45 items (HTTP 200)")

    food_res = client.get('/api/food')
    assert food_res.status_code == 200
    food_data = food_res.get_json()
    assert food_data['total'] == 29
    print(f"[PASS] GET /api/food returns 29 items (HTTP 200)")

    stores_res = client.get('/api/stores')
    assert stores_res.status_code == 200
    stores_data = stores_res.get_json()
    assert len(stores_data['stores']) == 33
    print(f"[PASS] GET /api/stores returns 33 physical stores (HTTP 200)")

    nearest_res = client.get('/api/stores/nearest?lat=33.7297&lng=73.0768')
    assert nearest_res.status_code == 200
    nearest_data = nearest_res.get_json()
    assert len(nearest_data['stores']) > 0
    print(f"[PASS] GET /api/stores/nearest calculated closest branch: {nearest_data['stores'][0]['name']} ({nearest_data['stores'][0]['distance_km']} km)")

    print("\n==================================================")
    print("ALL MODULES SUCCESSFULLY TESTED AND VERIFIED (CODE 0)")
    print("==================================================")
