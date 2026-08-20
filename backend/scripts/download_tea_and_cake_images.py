import os
import ssl
import urllib.request

ssl_context = ssl._create_unverified_context()

TEA_PRODUCTS = [
    {"filename": "sook-puerh-cha.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Sook-Pu-Erh-Cha-550x550.jpg"},
    {"filename": "sencha-green.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Sencha-Green-550x550.jpg"},
    {"filename": "tung-ting-oolong.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Tung-Ting-Oolong-550x550.jpg"},
    {"filename": "osmanthus-oolong.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Osmanthus-Oolong-550x550.jpg"},
    {"filename": "dong-ding-oolong-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Dong-Ding-Oolong-Tea-550x550.jpg"},
    {"filename": "organic-green-gunpowder.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Organic-Green-Gunpowder-1-550x550.jpg"},
    {"filename": "gold-tip-assam.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Gold-Tip-Assam-550x550.jpg"},
    {"filename": "20th-anniversary-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/20th-Anniversary-Tea-550x550.jpg"},
    {"filename": "pouchong-oolong.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Pouchong-Oolong-550x550.jpg"},
    {"filename": "jungsun-korean.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Jungsun-Korean-550x550.jpg"},
    {"filename": "swedish-berries.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Swedish-Berries-550x550.jpg"},
    {"filename": "lemon-chamomile-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Lemon-Chamomile-Tea-550x550.jpg"},
    {"filename": "green-rooibos.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Green-Rooibos-550x550.jpg"},
    {"filename": "ginseng-peppermint-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Ginseng-Peppermint-Tea-550x550.jpg"},
    {"filename": "african-sunrise.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/African-Sunrise-550x550.jpg"},
    {"filename": "lung-ching-dragonwell-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Lung-Ching-Dragonwell-Tea-550x550.jpg"},
    {"filename": "jasmine-dragon-phoenix-pearl-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Jasmine-Dragon-Phoenix-Pearl-Tea-550x550.jpg"},
    {"filename": "houjicha-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Houjicha-Tea-550x550.jpg"},
    {"filename": "genmaicha-green-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Genmaicha-Green-Tea-550x550.jpg"},
    {"filename": "vanilla-ceylon.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Vanilla-Ceylon-550x550.jpg"},
    {"filename": "earl-grey-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Earl-Grey-Tea-550x550.jpg"},
    {"filename": "noori-tea-garden.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Noori-Tea-Garden-2-550x550.jpg"},
    {"filename": "estate-darjeeling-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Estate-Darjeeling-Tea-550x550.jpg"},
    {"filename": "english-breakfast-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/English-Breakfast-Tea-550x550.jpg"},
    {"filename": "chai-tea.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Chai-Tea-550x550.jpg"},
    {"filename": "black-dragon-pearl.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Black-Dragon-Pearl-550x550.jpg"},
]

CAKE_PRODUCTS = [
    {"filename": "lotus-cheesecake.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2019/09/DSC0970-550x550.jpg"},
    {"filename": "belgian-chocolate-cake.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2018/10/Belgian-550x550.jpg"},
    {"filename": "la-cheesecake.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/la-cheese-cake1-550x550.jpg"},
    {"filename": "red-velvet-cake.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/DSC0999-550x550.jpg"},
    {"filename": "homestyle-carrot-cake.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/homestyle-carrot-cake-550x550.jpg"},
    {"filename": "oreo-tiramisu.jpg", "url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/oreo-550x550.jpg"},
]

def download_images():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, "..", "public", "products")
    
    tea_dir = os.path.join(public_dir, "tea")
    cakes_dir = os.path.join(public_dir, "cakes")
    
    os.makedirs(tea_dir, exist_ok=True)
    os.makedirs(cakes_dir, exist_ok=True)
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    print("=== Downloading 26 Tea Images ===")
    for item in TEA_PRODUCTS:
        target = os.path.join(tea_dir, item["filename"])
        if not os.path.exists(target) or os.path.getsize(target) < 500:
            try:
                req = urllib.request.Request(item["url"], headers=headers)
                with urllib.request.urlopen(req, context=ssl_context, timeout=20) as resp:
                    data = resp.read()
                    with open(target, "wb") as f:
                        f.write(data)
                print(f"[DOWNLOADED] {item['filename']} ({len(data)} bytes)")
            except Exception as e:
                print(f"[ERROR] {item['filename']}: {e}")
        else:
            print(f"[EXISTS] {item['filename']}")

    print("\n=== Downloading 6 Cake Images ===")
    for item in CAKE_PRODUCTS:
        target = os.path.join(cakes_dir, item["filename"])
        if not os.path.exists(target) or os.path.getsize(target) < 500:
            try:
                req = urllib.request.Request(item["url"], headers=headers)
                with urllib.request.urlopen(req, context=ssl_context, timeout=20) as resp:
                    data = resp.read()
                    with open(target, "wb") as f:
                        f.write(data)
                print(f"[DOWNLOADED] {item['filename']} ({len(data)} bytes)")
            except Exception as e:
                print(f"[ERROR] {item['filename']}: {e}")
        else:
            print(f"[EXISTS] {item['filename']}")

if __name__ == "__main__":
    download_images()
