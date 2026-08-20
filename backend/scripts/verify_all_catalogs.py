import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.models.product import Product
from app.models.category import Category

EXPECTED_26_TEAS = [
    ("Sook Pu-Erh Cha", "tea-masters-collection", "/products/tea/sook-puerh-cha.jpg"),
    ("Sencha Green", "tea-masters-collection", "/products/tea/sencha-green.jpg"),
    ("Tung Ting Oolong", "oolong", "/products/tea/tung-ting-oolong.jpg"),
    ("Osmanthus Oolong", "oolong", "/products/tea/osmanthus-oolong.jpg"),
    ("Dong Ding Oolong Tea", "oolong", "/products/tea/dong-ding-oolong-tea.jpg"),
    ("Organic Green Gunpowder", "limited-edition", "/products/tea/organic-green-gunpowder.jpg"),
    ("Gold Tip Assam", "limited-edition", "/products/tea/gold-tip-assam.jpg"),
    ("20th Anniversary Tea", "limited-edition", "/products/tea/20th-anniversary-tea.jpg"),
    ("Pouchong Oolong", "limited-edition", "/products/tea/pouchong-oolong.jpg"),
    ("Jungsun Korean", "limited-edition", "/products/tea/jungsun-korean.jpg"),
    ("Swedish Berries", "herbal-fruits", "/products/tea/swedish-berries.jpg"),
    ("Lemon Chamomile Tea", "herbal-fruits", "/products/tea/lemon-chamomile-tea.jpg"),
    ("Green Rooibos", "herbal-fruits", "/products/tea/green-rooibos.jpg"),
    ("Ginseng Peppermint Tea", "herbal-fruits", "/products/tea/ginseng-peppermint-tea.jpg"),
    ("African Sunrise", "herbal-fruits", "/products/tea/african-sunrise.jpg"),
    ("Lung Ching Dragonwell Tea", "green", "/products/tea/lung-ching-dragonwell-tea.jpg"),
    ("Jasmine Dragon Phoenix Pearl Tea", "green", "/products/tea/jasmine-dragon-phoenix-pearl-tea.jpg"),
    ("Houjicha Tea", "green", "/products/tea/houjicha-tea.jpg"),
    ("Genmaicha Green Tea", "green", "/products/tea/genmaicha-green-tea.jpg"),
    ("Vanilla Ceylon", "flavoured-tea", "/products/tea/vanilla-ceylon.jpg"),
    ("Earl Grey Tea", "flavoured-tea", "/products/tea/earl-grey-tea.jpg"),
    ("Noori Tea Garden", "black", "/products/tea/noori-tea-garden.jpg"),
    ("Estate Darjeeling Tea", "black", "/products/tea/estate-darjeeling-tea.jpg"),
    ("English Breakfast Tea", "black", "/products/tea/english-breakfast-tea.jpg"),
    ("Chai Tea", "black", "/products/tea/chai-tea.jpg"),
    ("Black Dragon Pearl", "black", "/products/tea/black-dragon-pearl.jpg"),
]

EXPECTED_6_CAKES = [
    ("Lotus cheesecake", "lotus-cheesecake", "/products/cakes/lotus-cheesecake.jpg"),
    ("Belgian Chocolate Cake", "belgian-chocolate-cake", "/products/cakes/belgian-chocolate-cake.jpg"),
    ("LA Cheesecake", "la-cheesecake", "/products/cakes/la-cheesecake.jpg"),
    ("Red Velvet Cake", "red-velvet-cake", "/products/cakes/red-velvet-cake.jpg"),
    ("Homestyle Carrot Cake", "homestyle-carrot-cake", "/products/cakes/homestyle-carrot-cake.jpg"),
    ("Oreo Tiramisu", "oreo-tiramisu", "/products/cakes/oreo-tiramisu.jpg"),
]

def verify_catalogs():
    app = create_app()
    client = app.test_client()

    print("=== 1. VERIFYING ALL 26 TEA PRODUCTS IN DB & LOCAL FILES ===")
    with app.app_context():
        for name, cat_slug, img in EXPECTED_26_TEAS:
            prod = Product.query.filter_by(name=name, product_type="tea").first()
            assert prod is not None, f"Missing tea product: {name}"
            
            # Check image
            pub_path = os.path.join(backend_dir, "..", "public", img.lstrip("/"))
            assert os.path.exists(pub_path), f"Missing local tea image: {pub_path}"
            assert os.path.getsize(pub_path) > 1000, f"Tea image corrupted or empty: {pub_path}"
            print(f"[PASS] Tea: {prod.name} | Category: {prod.category.name if prod.category else 'N/A'} | Image: {os.path.basename(img)}")

    print("\n=== 2. VERIFYING ALL 6 CAKE PRODUCTS IN DB & LOCAL FILES ===")
    with app.app_context():
        for name, slug, img in EXPECTED_6_CAKES:
            prod = Product.query.filter_by(name=name, product_type="cake").first()
            assert prod is not None, f"Missing cake product: {name}"
            
            # Check image
            pub_path = os.path.join(backend_dir, "..", "public", img.lstrip("/"))
            assert os.path.exists(pub_path), f"Missing local cake image: {pub_path}"
            assert os.path.getsize(pub_path) > 1000, f"Cake image corrupted or empty: {pub_path}"
            print(f"[PASS] Cake: {prod.name} | Type: {prod.cake_type} | Image: {os.path.basename(img)}")

    print("\n=== 3. VERIFYING API DEDICATED ENDPOINTS ===")
    # Tea endpoint
    res_tea = client.get('/api/tea')
    assert res_tea.status_code == 200
    tea_data = res_tea.get_json()
    print(f"[PASS] GET /api/tea returned {len(tea_data['products'])} teas")
    assert len(tea_data['products']) == 26

    # Cake endpoint
    res_cakes = client.get('/api/cake-to-go')
    assert res_cakes.status_code == 200
    cake_data = res_cakes.get_json()
    print(f"[PASS] GET /api/cake-to-go returned {len(cake_data['products'])} cakes")
    assert len(cake_data['products']) == 6

    # Single tea slug lookup
    res_single_tea = client.get('/api/tea/sencha-green')
    assert res_single_tea.status_code == 200
    print(f"[PASS] GET /api/tea/sencha-green returned: {res_single_tea.get_json()['product']['name']}")

    # Single cake slug lookup
    res_single_cake = client.get('/api/cakes/lotus-cheesecake')
    assert res_single_cake.status_code == 200
    print(f"[PASS] GET /api/cakes/lotus-cheesecake returned: {res_single_cake.get_json()['product']['name']}")

    print("\n=== 4. VERIFYING CATEGORY FILTERING & SEARCH ===")
    # Filter tea categories
    for cat_slug in ["limited-edition", "green", "oolong", "flavoured-tea", "herbal-fruits", "black", "tea-masters-collection"]:
        res_cat = client.get(f'/api/products?type=tea&category={cat_slug}')
        assert res_cat.status_code == 200
        print(f"[PASS] Filter Tea category '{cat_slug}': {len(res_cat.get_json()['products'])} item(s)")

    # Search tea
    for term in ["Oolong", "Chamomile", "Dragon", "Vanilla", "Darjeeling", "Korean"]:
        res_s = client.get(f'/api/products?type=tea&search={term}')
        assert res_s.status_code == 200
        print(f"[PASS] Search Tea '{term}': {len(res_s.get_json()['products'])} item(s)")

    # Search cakes
    for term in ["Lotus", "Chocolate", "Carrot", "Tiramisu", "Cheesecake"]:
        res_c = client.get(f'/api/products?type=cake&search={term}')
        assert res_c.status_code == 200
        print(f"[PASS] Search Cake '{term}': {len(res_c.get_json()['products'])} item(s)")

    print("\n[SUCCESS] ALL TEA AND CAKE VERIFICATION CHECKS PASSED FULLY!")

if __name__ == '__main__':
    verify_catalogs()
