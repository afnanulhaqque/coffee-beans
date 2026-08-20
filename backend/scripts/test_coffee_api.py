import os
import sys
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app

app = create_app()
client = app.test_client()

def test_api():
    print("Testing GET /api/products...")
    res = client.get('/api/products?limit=50')
    assert res.status_code == 200, f"Status: {res.status_code}"
    data = res.get_json()
    products = data.get('products', [])
    print(f"Total products returned: {len(products)} (Expected at least 18)")
    assert len(products) >= 18, f"Expected >= 18 products, got {len(products)}"

    # Check categories
    cat_res = client.get('/api/products?category=rich-smooth')
    assert cat_res.status_code == 200
    rich_prods = cat_res.get_json().get('products', [])
    print(f"Rich & Smooth products count: {len(rich_prods)}")
    for p in rich_prods:
        print(f" - {p['name']} ({p['pack_size']}) - Category: {p['category']}")

    # Check individual slug
    slug_res = client.get('/api/products/colombia-antioquia')
    assert slug_res.status_code == 200
    p_data = slug_res.get_json().get('product')
    print(f"\nProduct Detail: {p_data['name']}")
    print(f" - Slug: {p_data['slug']}")
    print(f" - Pack Size: {p_data['pack_size']}")
    print(f" - Price: {p_data['price']}")
    print(f" - Image: {p_data['image']}")
    print(f" - Flavor Profile: {p_data['flavor_profile']}")
    print(f" - Description: {p_data['description']}")
    print(f" - Availability: {p_data['availability']}")

    # Check search
    search_res = client.get('/api/products?search=Kenya')
    assert search_res.status_code == 200
    search_prods = search_res.get_json().get('products', [])
    print(f"\nSearch for 'Kenya': Found {len(search_prods)} item(s)")
    for p in search_prods:
        print(f" - {p['name']}")

    # Check sorting
    sort_res = client.get('/api/products?sort=name_a_z')
    assert sort_res.status_code == 200
    sorted_prods = sort_res.get_json().get('products', [])
    print(f"\nFirst sorted product A-Z: {sorted_prods[0]['name']}")

    print("\nALL API TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_api()
