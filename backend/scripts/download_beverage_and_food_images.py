import os
import requests

BEVERAGE_IMAGES = [
    ("hot-vanilla.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Hot-Vanilla-550x550.jpg"),
    ("hot-double-chocolate-with-marshmallows.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Hot-Double-Chocolate-with-marshmallows-550x550.jpg"),
    ("tea-to-go.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Tea-to-Go-550x550.jpg"),
    ("moroccan-mint.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Moroccan-Mint-550x550.jpg"),
    ("lung-ching-dragonwell.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Lung-Ching-Dragonwell-550x550.jpg"),
    ("lemon-chamomile-caffeine-free.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Lemon-Chamomile-Caffeine-Free-550x550.jpg"),
    ("ginseng-peppermint-caffeine-free.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Ginseng-Peppermint-Caffeine-Free-550x550.jpg"),
    ("estate-darjeeling.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Estate-Darjeeling-550x550.jpg"),
    ("english-breakfast.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/English-Breakfast-550x550.jpg"),
    ("chai.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Chai-550x550.jpg"),
    ("vanilla-ceylon-tea-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Vanilla-Ceylon-Tea-Latte-550x550.jpg"),
    ("tropical-passion-tea-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Tropical-Passion-Tea-Latte-1-550x550.jpg"),
    ("moroccan-mint-tea-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Moroccan-Mint-Tea-Latte-550x550.jpg"),
    ("matcha-green-tea-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Matcha-Green-Tea-Latte-550x550.jpg"),
    ("english-breakfast-tea-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/English-Breakfast-Tea-Latte-550x550.jpg"),
    ("chai-tea-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Chai-Tea-Latte-550x550.jpg"),
    ("pure-vanilla-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Pure-Vanilla-Ice-Blended-Drink-550x550.jpg"),
    ("pure-double-chocolate-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Pure-Double-Chocolate-Ice-Blended-Drink-550x550.jpg"),
    ("pure-cookies-cream-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Pure-Cookies-Cream-Ice-Blended-Drink-550x550.jpg"),
    ("pure-caramel-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Pure-Caramel-Ice-Blended-Drink-1-550x550.jpg"),
    ("california-sunrise-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/California-Sunrise-Ice-Blended-Drink-1-550x550.jpg"),
    ("the-ultimate-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/The-Ultimate-Ice-Blended-Drink-550x550.jpg"),
    ("the-original-vanilla-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/The-Original-Vanilla-Ice-Blended-Drink-550x550.jpg"),
    ("the-original-mocha-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/The-Original-Mocha-Ice-Blended-Drink-550x550.jpg"),
    ("hazelnut-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Hazelnut-Ice-Blended-Drink-1-550x550.jpg"),
    ("double-chocolate-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Double-Chocolate-Ice-Blended-Drink-550x550.jpg"),
    ("cookies-cream-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Cookies-Cream-Ice-Blended-Drink-1-550x550.jpg"),
    ("caramel-ice-blended-drink.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Caramel-Ice-Blended-Drink-1-550x550.jpg"),
    ("vanilla-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Vanilla-Latte-550x550.jpg"),
    ("mocha-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Mocha-Latte-550x550.jpg"),
    ("hazelnut-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Hazelnut-Latte-550x550.jpg"),
    ("hazelnut-americano.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Hazelnut-Americano-550x550.jpg"),
    ("espresso-macchiato.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Espresso-Macchiato-550x550.jpg"),
    ("espresso.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Espresso-550x550.jpg"),
    ("double-chocolate-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Double-Chocolate-Latte-550x550.jpg"),
    ("caramel-macchiato.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Caramel-Macchiato-550x550.jpg"),
    ("caramel-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Caramel-Latte-550x550.jpg"),
    ("cappuccino.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Cappuccino-550x550.jpg"),
    ("cafe-latte.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Caf%C3%A9-Latte-550x550.jpg"),
    ("americano.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Americano-550x550.jpg"),
    ("todays-fresh-brew.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Todays-Fresh-Brew-550x550.jpg"),
    ("coffee-to-go.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Coffee-to-Go-550x550.jpg"),
    ("matcha-green-tea-ice-blended.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Matcha-Green-Tea-Latte-550x550.jpg"),
    ("passion-fruit-granita-tea-ice-blended.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Tropical-Passion-Tea-Latte-1-550x550.jpg"),
    ("pear-berry-granita-tea-ice-blended.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Swedish-Berries-550x550.jpg")
]

FOOD_IMAGES = [
    ("loaded-french-fries-with-cuban-chicken.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-17-550x550.png"),
    ("french-fries.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-16-550x550.png"),
    ("chicken-nuggets.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-18-550x550.png"),
    ("la-club-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-21-550x550.png"),
    ("grilled-cheese-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-23-550x550.png"),
    ("mexican-bbq-chicken-steak.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-14-550x550.png"),
    ("mushroom-chicken-steak.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-15-550x550.png"),
    ("texan-bbq-chicken-burger.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-13-550x550.png"),
    ("mushroom-cheese-omelette.png", "https://www.coffeebean.pk/wp-content/uploads/2022/04/Asset-4-550x550.png"),
    ("mexican-omelette.png", "https://www.coffeebean.pk/wp-content/uploads/2019/09/Asset-5-550x550.png"),
    ("waffles.jpg", "https://www.coffeebean.pk/wp-content/uploads/2018/10/waffles-550x550.jpg"),
    ("scrambled-eggs.png", "https://www.coffeebean.pk/wp-content/uploads/2018/10/Asset-2-550x550.png"),
    ("egg-cheese-croissant.jpg", "https://www.coffeebean.pk/wp-content/uploads/2018/10/egg-and-cheese-crossant-550x550.jpg"),
    ("french-toast.jpg", "https://www.coffeebean.pk/wp-content/uploads/2018/09/french-toast-550x550.jpg"),
    ("egg-cheese-wrap.png", "https://www.coffeebean.pk/wp-content/uploads/2018/09/Asset-30-550x550.png"),
    ("spicy-chicken-wrap.png", "https://www.coffeebean.pk/wp-content/uploads/2018/09/Asset-29-550x550.png"),
    ("cuban-chicken-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2018/09/Asset-20-550x550.png"),
    ("chicken-mushroom-croissant-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2018/09/Asset-24-550x550.png"),
    ("italian-chicken-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2018/09/Asset-26-550x550.png"),
    ("chipotle-chicken-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Asset-25-550x550.png"),
    ("chefs-tuna-sandwich.png", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Asset-22-550x550.png"),
    ("cranberry-salad.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Cranberry-Salad-1-550x550.jpg"),
    ("caesar-salad.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Caesar-Salad-1-550x550.jpg"),
    ("chicken-tomato-herb-pasta.png", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Asset-10-550x550.png"),
    ("chicken-lasagna.png", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Asset-12-550x550.png"),
    ("chicken-mushroom-pasta.png", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Asset-11-550x550.png"),
    ("chicken-sausage-pizza.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Chicken-Sausage-Pizza-550x550.jpg"),
    ("chicken-jalapeno-pizza.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/chicken-Jalapeno-550x550.jpg"),
    ("margherita-pizza.jpg", "https://www.coffeebean.pk/wp-content/uploads/2017/10/Margherita-Pizza-2-550x550.jpg")
]

def download_images():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    bev_dir = os.path.join(base_dir, "public", "products", "beverages")
    food_dir = os.path.join(base_dir, "public", "products", "food")

    os.makedirs(bev_dir, exist_ok=True)
    os.makedirs(food_dir, exist_ok=True)

    headers = {'User-Agent': 'Mozilla/5.0'}

    print("=== Downloading 45 Beverage Images ===")
    for filename, url in BEVERAGE_IMAGES:
        dest = os.path.join(bev_dir, filename)
        if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
            try:
                r = requests.get(url, headers=headers, timeout=15)
                if r.status_code == 200:
                    with open(dest, 'wb') as f:
                        f.write(r.content)
                    print(f"[OK] Beverage: {filename}")
                else:
                    print(f"[FAIL {r.status_code}] {url}")
            except Exception as e:
                print(f"[ERROR] {filename}: {e}")
        else:
            print(f"[EXISTS] {filename}")

    print("\n=== Downloading 29 Food Images ===")
    for filename, url in FOOD_IMAGES:
        dest = os.path.join(food_dir, filename)
        if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
            try:
                r = requests.get(url, headers=headers, timeout=15)
                if r.status_code == 200:
                    with open(dest, 'wb') as f:
                        f.write(r.content)
                    print(f"[OK] Food: {filename}")
                else:
                    print(f"[FAIL {r.status_code}] {url}")
            except Exception as e:
                print(f"[ERROR] {filename}: {e}")
        else:
            print(f"[EXISTS] {filename}")

if __name__ == '__main__':
    download_images()
