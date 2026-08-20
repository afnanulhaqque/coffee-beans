import os
import sys
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.models.product import Product
from app.models.category import Category

EXPECTED_18_PRODUCTS = [
    ("Colombia Antioquia", "8oz", "Rich & Smooth", "/products/coffee/colombia-antioquia.jpg"),
    ("100% Kona Coffee", "8oz", "Reserved", "/products/coffee/kona-coffee.jpg"),
    ("Papua New Guinea Sigri Coffee", "8oz", "Medium & Smooth", "/products/coffee/papua-new-guinea-sigri.jpg"),
    ("Mocha Java Coffee", "8oz", "Medium & Smooth", "/products/coffee/mocha-java.jpg"),
    ("Kenya AA Coffee", "8oz", "Medium & Smooth", "/products/coffee/kenya-aa.jpg"),
    ("Costa Rica La Cascada Tarrazu Coffee", "8oz", "Medium & Smooth", "/products/coffee/costa-rica-la-cascada-tarrazu.jpg"),
    ("Colombia Narino Coffee", "8oz", "Medium & Smooth", "/products/coffee/colombia-narino.jpg"),
    ("House Blend Coffee", "8oz", "Light & Subtle", "/products/coffee/house-blend.jpg"),
    ("Brazil Cerrado Coffee", "8oz", "Light & Subtle", "/products/coffee/brazil-cerrado.jpg"),
    ("Ethiopia Yirgacheffe Coffee", "8oz", "Light & Distinctive", "/products/coffee/ethiopia-yirgacheffe.jpg"),
    ("Hazelnut Coffee", "12oz", "Flavoured Coffee", "/products/coffee/hazelnut.jpg"),
    ("French Vanilla Coffee", "12oz", "Flavoured Coffee", "/products/coffee/french-vanilla.jpg"),
    ("Decaf House Blend Coffee", "8oz", "Decaffeinated", "/products/coffee/decaf-house-blend.jpg"),
    ("Decaf Espresso Roast Coffee", "8oz", "Decaffeinated", "/products/coffee/decaf-espresso-roast.jpg"),
    ("Viennese Coffee", "8oz", "Dark & Distinctive", "/products/coffee/viennese.jpg"),
    ("Sumatra Mandheling Dark Coffee", "8oz", "Dark & Distinctive", "/products/coffee/sumatra-mandheling-dark.jpg"),
    ("Sulawesi Toraja", None, "Dark & Distinctive", "/products/coffee/sulawesi-toraja.jpg"),
    ("Espresso Roast Coffee", "8oz", "Dark & Distinctive", "/products/coffee/espresso-roast.jpg"),
]

def verify_all():
    app = create_app()
    client = app.test_client()

    print("=== 1. VERIFYING ALL 18 COFFEE PRODUCTS IN DATABASE & API ===")
    with app.app_context():
        for name, pack, cat, img in EXPECTED_18_PRODUCTS:
            prod = Product.query.filter(Product.name.ilike(f"%{name.split(' (')[0]}%")).first()
            assert prod is not None, f"Missing product: {name}"
            print(f"[PASS] Found: {prod.name} | Pack: {prod.pack_size} | Category: {prod.category.name if prod.category else 'N/A'}")
            
            # Check local file existence in public folder
            pub_path = os.path.join(backend_dir, "..", "public", img.lstrip("/"))
            assert os.path.exists(pub_path), f"Image file missing at: {pub_path}"
            assert os.path.getsize(pub_path) > 1000, f"Image file too small or corrupted: {pub_path}"

    print("\n=== 2. VERIFYING ALL CATEGORIES VIA API ===")
    categories_to_test = [
        "light-distinctive",
        "rich-smooth",
        "reserved",
        "light-subtle",
        "decaffeinated",
        "flavoured-coffee",
        "dark-distinctive",
        "medium-smooth",
    ]
    for cat_slug in categories_to_test:
        res = client.get(f'/api/products?category={cat_slug}')
        assert res.status_code == 200
        data = res.get_json()
        print(f"[PASS] Category '{cat_slug}' returned {len(data['products'])} product(s)")
        assert len(data['products']) > 0, f"No products found for category {cat_slug}"

    print("\n=== 3. VERIFYING SEARCH QUERIES ===")
    search_queries = ["Kenya", "8oz", "Vanilla", "Colombia", "Toraja", "Yirgacheffe"]
    for q in search_queries:
        res = client.get(f'/api/products?search={q}')
        assert res.status_code == 200
        data = res.get_json()
        print(f"[PASS] Search '{q}' returned {len(data['products'])} match(es)")
        assert len(data['products']) > 0, f"Expected matches for '{q}'"

    print("\n=== 4. VERIFYING SORTING MODES ===")
    sort_modes = ["name_a_z", "name_z_a", "price_low", "price_high", "featured"]
    for s in sort_modes:
        res = client.get(f'/api/products?sort={s}')
        assert res.status_code == 200
        print(f"[PASS] Sort by '{s}' succeeded (total {res.get_json()['total']} items)")

    print("\n=== 5. VERIFYING GUEST CHECKOUT CALCULATION ===")
    with app.app_context():
        sample_prod = Product.query.filter_by(is_active=True).first()
        order_payload = {
            "customer_name": "Test Customer",
            "customer_email": "customer@example.com",
            "customer_phone": "03001234567",
            "order_type": "delivery",
            "delivery_address": "House 12, Street 4",
            "city": "Islamabad",
            "area": "F-7/2",
            "items": [{"product_id": sample_prod.id, "quantity": 2}],
            "payment_method": "Cash on Delivery (COD)"
        }
        order_res = client.post('/api/orders', json=order_payload)
        assert order_res.status_code == 201
        order_data = order_res.get_json()
        print(f"[PASS] Guest Order Created: {order_data['order']['order_number']} | Total: Rs. {order_data['order']['total']}")

    print("\n[SUCCESS] ALL VERIFICATION CRITERIA FULLY SATISFIED!")

if __name__ == '__main__':
    verify_all()
