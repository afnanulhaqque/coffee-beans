import os
import sys
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product
from app.models.store import Store, StoreOpeningHours

BEVERAGE_CATEGORIES = [
    ("Brewed", "brewed", "Freshly brewed artisan single-origin and master-blend coffees.", 1),
    ("Non-Coffee Favorites", "non-coffee-favorites", "Indulgent chocolates, vanillas, and non-caffeinated treats.", 2),
    ("Non-Coffee", "non-coffee", "Refreshing fruity and pure ice blended beverages without coffee.", 3),
    ("Tea Latte", "tea-latte", "Handcrafted premium loose-leaf tea steeped and steamed with silky milk.", 4),
    ("Coffee base", "coffee-base", "Iconic Ice Blended drinks crafted with our signature coffee extract.", 5),
    ("Hot Tea", "hot-tea", "Whole-leaf artisan teas sourced from top tea estates worldwide.", 6),
    ("Espresso", "espresso", "Handcrafted espresso drinks made with our signature 5-origin blend.", 7),
]

FOOD_CATEGORIES = [
    ("Burger", "burger", "Juicy, flame-grilled artisan burgers served with crispy fries.", 1),
    ("Steak", "steak", "Tender marinated chicken steaks grilled to perfection with signature sauces.", 2),
    ("Wrap", "wrap", "Freshly rolled gourmet wraps with savory fillings and vibrant flavors.", 3),
    ("Salad", "salad", "Crisp farm-fresh garden greens tossed with artisanal dressings.", 4),
    ("Small Bites", "small-bites", "Crispy golden appetizers and loaded sharing platters.", 5),
    ("Pizza", "pizza", "Thin-crust artisan pizzas baked fresh with premium cheese and toppings.", 6),
    ("Pasta", "pasta", "Al dente pasta dishes tossed in rich house-made Italian sauces.", 7),
    ("Sandwich", "sandwich", "Toasted gourmet sandwiches and buttery croissant creations.", 8),
    ("Breakfast All Day", "breakfast-all-day", "Fluffy omelettes, fresh waffles, french toasts, and breakfast favorites.", 9),
]

# 45 Canonical Beverages
BEVERAGES_DATA = [
    {
        "name": "Hot Vanilla",
        "slug": "hot-vanilla",
        "categories": ["non-coffee-favorites", "non-coffee"],
        "image": "/products/beverages/hot-vanilla.jpg",
        "short_description": "Silky steamed milk combined with our French Deluxe Vanilla powder.",
        "description": "A comforting, caffeine-free hot drink made with steamed milk and our exclusive French Deluxe Vanilla powder.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Non-Coffee",
        "base": "Vanilla Powder & Milk",
        "size_options": json.dumps({"Small": 690, "Regular": 790, "Large": 890}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/hot-vanilla/"
    },
    {
        "name": "Hot Double Chocolate With Marshmallows",
        "slug": "hot-double-chocolate-with-marshmallows",
        "categories": ["non-coffee-favorites", "non-coffee"],
        "image": "/products/beverages/hot-double-chocolate-with-marshmallows.jpg",
        "short_description": "Decadent Special Dutch chocolate with steamed milk and fluffy marshmallows.",
        "description": "Our signature Special Dutch chocolate melted with rich steamed milk and topped with soft mini marshmallows.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Non-Coffee",
        "base": "Dutch Chocolate & Milk",
        "size_options": json.dumps({"Small": 740, "Regular": 840, "Large": 940}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Chocolate", "Vanilla", "Hazelnut", "Caramel"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/hot-double-chocolate-with-marshmallows/"
    },
    {
        "name": "Tea-to-Go",
        "slug": "tea-to-go",
        "categories": ["hot-tea"],
        "image": "/products/beverages/tea-to-go.jpg",
        "short_description": "Large carrier flask filled with your choice of freshly brewed whole leaf tea.",
        "description": "Perfect for meetings and gatherings. Serves up to 8 cups of fresh artisan hot tea.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Hot Tea",
        "base": "Brewed Tea",
        "size_options": json.dumps({"Carrier (96oz)": 3200}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/tea-to-go/"
    },
    {
        "name": "Moroccan Mint",
        "slug": "moroccan-mint",
        "categories": ["hot-tea"],
        "image": "/products/beverages/moroccan-mint.jpg",
        "short_description": "Refreshing blend of Gunpowder green tea and brisk Oregon peppermint.",
        "description": "A classic North African tradition combining fine whole gunpowder green tea with fragrant peppermint leaves.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Hot Tea",
        "base": "Whole Leaf Green Tea",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/moroccan-mint/"
    },
    {
        "name": "Lung Ching Dragonwell",
        "slug": "lung-ching-dragonwell",
        "categories": ["hot-tea"],
        "image": "/products/beverages/lung-ching-dragonwell.jpg",
        "short_description": "Renowned Chinese green tea with delicate roasted chestnut aroma.",
        "description": "Pan-fired green tea leaves with a flat, spear-like shape and a smooth, mellow jade liquor.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Hot Tea",
        "base": "Chinese Green Tea",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/lung-ching-dragonwell/"
    },
    {
        "name": "Lemon Chamomile (Caffeine Free)",
        "slug": "lemon-chamomile-caffeine-free",
        "categories": ["hot-tea"],
        "image": "/products/beverages/lemon-chamomile-caffeine-free.jpg",
        "short_description": "Soothing chamomile blossoms balanced with bright lemongrass.",
        "description": "Calming herbal infusion of Egyptian chamomile flower heads, lemongrass, and aromatic citrus peel.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Herbal Tea",
        "base": "Chamomile & Lemongrass",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/lemon-chamomile-caffeine-free/"
    },
    {
        "name": "Ginseng Peppermint (Caffeine Free)",
        "slug": "ginseng-peppermint-caffeine-free",
        "categories": ["hot-tea"],
        "image": "/products/beverages/ginseng-peppermint-caffeine-free.jpg",
        "short_description": "Invigorating blend of cooling peppermint and Siberian ginseng.",
        "description": "A crisp, herbal blend that awakens the senses naturally with aromatic peppermint and adaptogenic ginseng.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Herbal Tea",
        "base": "Peppermint & Ginseng",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/ginseng-peppermint-caffeine-free/"
    },
    {
        "name": "Estate Darjeeling",
        "slug": "estate-darjeeling",
        "categories": ["hot-tea"],
        "image": "/products/beverages/estate-darjeeling.jpg",
        "short_description": "The Champagne of teas from high-elevation Himalayan gardens.",
        "description": "Exquisite whole leaf black tea offering distinct muscatel grape notes and refined floral aroma.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Black Tea",
        "base": "Darjeeling Black Tea",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/estate-darjeeling/"
    },
    {
        "name": "English Breakfast",
        "slug": "english-breakfast",
        "categories": ["hot-tea"],
        "image": "/products/beverages/english-breakfast.jpg",
        "short_description": "Classic brisk and robust blend of fine Ceylon black teas.",
        "description": "Full-bodied whole leaf Ceylon black tea with an amber liquor and brisk, satisfying malt character.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Black Tea",
        "base": "Ceylon Black Tea",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/english-breakfast/"
    },
    {
        "name": "Chai",
        "slug": "chai",
        "categories": ["hot-tea"],
        "image": "/products/beverages/chai.jpg",
        "short_description": "Robust black tea infused with cinnamon, clove, ginger, and cardamom.",
        "description": "Traditional spiced Indian black tea infused with sweet warming spices.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Spiced Black Tea",
        "base": "Spiced Black Tea",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/chai/"
    },
    {
        "name": "Vanilla Ceylon Tea Latte",
        "slug": "vanilla-ceylon-tea-latte",
        "categories": ["tea-latte"],
        "image": "/products/beverages/vanilla-ceylon-tea-latte.jpg",
        "short_description": "Brisk Ceylon black tea steeped fresh with French Deluxe Vanilla and steamed milk.",
        "description": "An original CBTL invention. Premium Ceylon black tea infused with creamy vanilla powder and topped with silky milk foam.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Tea Latte",
        "base": "Ceylon Tea & Vanilla Powder",
        "size_options": json.dumps({"Small": 680, "Regular": 780, "Large": 880}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/vanilla-ceylon-tea-latte/"
    },
    {
        "name": "Tropical Passion Tea Latte",
        "slug": "tropical-passion-tea-latte",
        "categories": ["tea-latte"],
        "image": "/products/beverages/tropical-passion-tea-latte.jpg",
        "short_description": "Fragrant black tea with passion fruit notes, French Deluxe Vanilla, and steamed milk.",
        "description": "Exotic tropical black tea steeped into rich vanilla cream with a frothy crown of steamed milk.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Tea Latte",
        "base": "Tropical Passion Tea & Vanilla",
        "size_options": json.dumps({"Small": 680, "Regular": 780, "Large": 880}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/tropical-passion-tea-latte/"
    },
    {
        "name": "Moroccan Mint Tea Latte",
        "slug": "moroccan-mint-tea-latte",
        "categories": ["tea-latte"],
        "image": "/products/beverages/moroccan-mint-tea-latte.jpg",
        "short_description": "Gunpowder green tea, cooling peppermint, French Deluxe Vanilla, and steamed milk.",
        "description": "Minty and sweet. Steamed with our signature vanilla powder and finished with silky velvety milk foam.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Tea Latte",
        "base": "Moroccan Mint Tea & Vanilla",
        "size_options": json.dumps({"Small": 680, "Regular": 780, "Large": 880}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/moroccan-mint-tea-latte/"
    },
    {
        "name": "Matcha Green Tea Latte",
        "slug": "matcha-green-tea-latte",
        "categories": ["tea-latte"],
        "image": "/products/beverages/matcha-green-tea-latte.jpg",
        "short_description": "Ceremonial grade Japanese shade-grown matcha whisked with sweet vanilla and steamed milk.",
        "description": "Vibrant Japanese matcha green tea blended with French Deluxe Vanilla powder and velvety steamed milk.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Tea Latte",
        "base": "Japanese Matcha & Milk",
        "size_options": json.dumps({"Small": 720, "Regular": 820, "Large": 920}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/matcha-green-tea-latte/"
    },
    {
        "name": "English Breakfast Tea Latte",
        "slug": "english-breakfast-tea-latte",
        "categories": ["tea-latte"],
        "image": "/products/beverages/english-breakfast-tea-latte.jpg",
        "short_description": "Robust English Breakfast Ceylon tea with French Deluxe Vanilla and steamed milk.",
        "description": "The quintessential morning tea latte with rich malty notes softened by smooth vanilla cream.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Tea Latte",
        "base": "Ceylon Tea & Vanilla",
        "size_options": json.dumps({"Small": 680, "Regular": 780, "Large": 880}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/english-breakfast-tea-latte/"
    },
    {
        "name": "Chai Tea Latte",
        "slug": "chai-tea-latte",
        "categories": ["tea-latte"],
        "image": "/products/beverages/chai-tea-latte.jpg",
        "short_description": "Spiced black tea concentrate combined with French Deluxe Vanilla and steamed milk.",
        "description": "Warming blend of cardamom, cinnamon, and cloves softened with sweet vanilla and creamy steamed milk.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Tea Latte",
        "base": "Spiced Chai & Vanilla",
        "size_options": json.dumps({"Small": 680, "Regular": 780, "Large": 880}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/chai-tea-latte/"
    },
    {
        "name": "Pure Vanilla Ice Blended Drink",
        "slug": "pure-vanilla-ice-blended-drink",
        "categories": ["non-coffee", "non-coffee-favorites"],
        "image": "/products/beverages/pure-vanilla-ice-blended-drink.jpg",
        "short_description": "Non-coffee blend of French Deluxe Vanilla powder, non-fat milk, and pebble ice.",
        "description": "Decadent, creamy, and caffeine-free. Blended with our proprietary vanilla powder and topped with fresh whipped cream.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Vanilla Powder & Milk",
        "size_options": json.dumps({"Small": 790, "Regular": 890, "Large": 990}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/pure-vanilla-ice-blended-drink/"
    },
    {
        "name": "Pure Double Chocolate Ice Blended Drink",
        "slug": "pure-double-chocolate-ice-blended-drink",
        "categories": ["non-coffee", "non-coffee-favorites"],
        "image": "/products/beverages/pure-double-chocolate-ice-blended-drink.jpg",
        "short_description": "Special Dutch chocolate powder blended with non-fat milk, chocolate sauce, and ice.",
        "description": "An ultra-rich chocolate dream without coffee. Topped with whipped cream and chocolate drizzle.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Dutch Chocolate & Milk",
        "size_options": json.dumps({"Small": 820, "Regular": 920, "Large": 1020}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Chocolate", "Vanilla"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/pure-double-chocolate-ice-blended-drink/"
    },
    {
        "name": "Pure Cookies & Cream Ice Blended Drink",
        "slug": "pure-cookies-cream-ice-blended-drink",
        "categories": ["non-coffee"],
        "image": "/products/beverages/pure-cookies-cream-ice-blended-drink.jpg",
        "short_description": "Crunchy chocolate sandwich cookies blended with vanilla powder, milk, and ice.",
        "description": "Cookie crumbles folded into sweet French Deluxe vanilla cream, topped with whipped cream and cookie dust.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Oreo Cookies & Vanilla",
        "size_options": json.dumps({"Small": 850, "Regular": 950, "Large": 1050}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/pure-cookies-cream-ice-blended-drink/"
    },
    {
        "name": "Pure Caramel Ice Blended Drink",
        "slug": "pure-caramel-ice-blended-drink",
        "categories": ["non-coffee"],
        "image": "/products/beverages/pure-caramel-ice-blended-drink.jpg",
        "short_description": "Artisan caramel sauce blended with French Deluxe Vanilla powder, milk, and ice.",
        "description": "Buttery caramel blended with creamy vanilla and milk, finished with whipped cream and caramel swirl.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Caramel Sauce & Vanilla",
        "size_options": json.dumps({"Small": 820, "Regular": 920, "Large": 1020}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Caramel", "Vanilla"]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/pure-caramel-ice-blended-drink/"
    },
    {
        "name": "California Sunrise Ice Blended Drink",
        "slug": "california-sunrise-ice-blended-drink",
        "categories": ["non-coffee"],
        "image": "/products/beverages/california-sunrise-ice-blended-drink.jpg",
        "short_description": "Zesty orange and citrus fruit blended with vanilla powder and ice.",
        "description": "A bright, sunny California refresher bursting with zesty citrus flavor and sweet vanilla notes.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Citrus & Vanilla",
        "size_options": json.dumps({"Small": 790, "Regular": 890, "Large": 990}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/california-sunrise-ice-blended-drink/"
    },
    {
        "name": "The Ultimate Ice Blended Drink",
        "slug": "the-ultimate-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/the-ultimate-ice-blended-drink.jpg",
        "short_description": "Signature coffee extract blended with chocolate-covered espresso beans, vanilla, and ice.",
        "description": "The ultimate coffee lover's treat with crunchy dark chocolate espresso bean bits blended right into the drink.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Chocolate Espresso Beans",
        "size_options": json.dumps({"Small": 890, "Regular": 990, "Large": 1090}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Mocha", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/the-ultimate-ice-blended-drink/"
    },
    {
        "name": "The Original Vanilla Ice Blended Drink",
        "slug": "the-original-vanilla-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/the-original-vanilla-ice-blended-drink.jpg",
        "short_description": "The original 1987 creation. Coffee extract, French Deluxe Vanilla, milk, and pebble ice.",
        "description": "The world's original Ice Blended drink invented by The Coffee Bean & Tea Leaf in 1987 in Westwood, California.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Vanilla Powder",
        "size_options": json.dumps({"Small": 820, "Regular": 920, "Large": 1020}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/the-original-vanilla-ice-blended-drink/"
    },
    {
        "name": "The Original Mocha Ice Blended Drink",
        "slug": "the-original-mocha-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/the-original-mocha-ice-blended-drink.jpg",
        "short_description": "Coffee extract blended with Special Dutch chocolate powder, milk, and pebble ice.",
        "description": "Our timeless classic blending rich Dutch chocolate with proprietary coffee extract and topped with whipped cream.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Dutch Chocolate",
        "size_options": json.dumps({"Small": 820, "Regular": 920, "Large": 1020}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Mocha", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/the-original-mocha-ice-blended-drink/"
    },
    {
        "name": "Hazelnut Ice Blended Drink",
        "slug": "hazelnut-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/hazelnut-ice-blended-drink.jpg",
        "short_description": "Coffee extract, aromatic hazelnut powder, milk, and pebble ice.",
        "description": "Nutty and smooth. Blended with our exclusive hazelnut powder and finished with a swirl of whipped cream.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Hazelnut Powder",
        "size_options": json.dumps({"Small": 820, "Regular": 920, "Large": 1020}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Hazelnut", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/hazelnut-ice-blended-drink/"
    },
    {
        "name": "Double Chocolate Ice Blended Drink",
        "slug": "double-chocolate-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/double-chocolate-ice-blended-drink.jpg",
        "short_description": "Dark Dutch chocolate and chocolate syrup blended with coffee extract and ice.",
        "description": "Double the chocolate intensity blended with rich coffee extract and finished with whipped cream.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Dark Chocolate",
        "size_options": json.dumps({"Small": 850, "Regular": 950, "Large": 1050}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Chocolate", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/double-chocolate-ice-blended-drink/"
    },
    {
        "name": "Cookies & Cream Ice Blended Drink",
        "slug": "cookies-cream-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/cookies-cream-ice-blended-drink.jpg",
        "short_description": "Chocolate sandwich cookies blended with coffee extract, vanilla, and ice.",
        "description": "A delightful crunch of Oreo cookies blended into coffee-infused vanilla cream with whipped cream topping.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Cookies",
        "size_options": json.dumps({"Small": 880, "Regular": 980, "Large": 1080}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/cookies-cream-ice-blended-drink/"
    },
    {
        "name": "Caramel Ice Blended Drink",
        "slug": "caramel-ice-blended-drink",
        "categories": ["coffee-base"],
        "image": "/products/beverages/caramel-ice-blended-drink.jpg",
        "short_description": "Buttery caramel sauce blended with coffee extract, vanilla, milk, and ice.",
        "description": "Rich artisanal caramel blended with signature coffee extract, topped with whipped cream and caramel drizzle.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Ice Blended",
        "base": "Coffee Extract & Caramel",
        "size_options": json.dumps({"Small": 850, "Regular": 950, "Large": 1050}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Caramel", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/caramel-ice-blended-drink/"
    },
    {
        "name": "Vanilla Latte",
        "slug": "vanilla-latte",
        "categories": ["espresso"],
        "image": "/products/beverages/vanilla-latte.jpg",
        "short_description": "Espresso roast shots with French Deluxe Vanilla and steamed milk.",
        "description": "Freshly pulled espresso combined with proprietary French Deluxe Vanilla powder and velvety steamed milk.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Vanilla",
        "size_options": json.dumps({"Small": 720, "Regular": 820, "Large": 920}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/vanilla-latte/"
    },
    {
        "name": "Mocha Latte",
        "slug": "mocha-latte",
        "categories": ["espresso"],
        "image": "/products/beverages/mocha-latte.jpg",
        "short_description": "Rich espresso shots with Special Dutch chocolate and velvety steamed milk.",
        "description": "Our signature 5-bean espresso paired with decadent Dutch chocolate powder and silky steamed microfoam.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Dutch Chocolate",
        "size_options": json.dumps({"Small": 720, "Regular": 820, "Large": 920}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Chocolate", "Vanilla", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/mocha-latte/"
    },
    {
        "name": "Hazelnut Latte",
        "slug": "hazelnut-latte",
        "categories": ["espresso"],
        "image": "/products/beverages/hazelnut-latte.jpg",
        "short_description": "Espresso shots blended with aromatic hazelnut and steamed milk.",
        "description": "Smooth espresso balanced with sweet, nutty hazelnut powder and topped with silky foam.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Hazelnut",
        "size_options": json.dumps({"Small": 720, "Regular": 820, "Large": 920}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Hazelnut", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/hazelnut-latte/"
    },
    {
        "name": "Hazelnut Americano",
        "slug": "hazelnut-americano",
        "categories": ["espresso"],
        "image": "/products/beverages/hazelnut-americano.jpg",
        "short_description": "Espresso shots combined with hot water and sweet toasted hazelnut flavor.",
        "description": "Bold espresso poured over hot water with a smooth touch of hazelnut sweetness.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Hazelnut",
        "size_options": json.dumps({"Small": 560, "Regular": 640, "Large": 720}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps(["Hazelnut", "Vanilla", "Caramel"]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/hazelnut-americano/"
    },
    {
        "name": "Espresso Macchiato",
        "slug": "espresso-macchiato",
        "categories": ["espresso"],
        "image": "/products/beverages/espresso-macchiato.jpg",
        "short_description": "Intense espresso 'marked' with a delicate dollop of steamed milk foam.",
        "description": "Our signature dark espresso roast marked with a spoonful of dense, creamy milk froth.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Espresso",
        "base": "Espresso & Foam",
        "size_options": json.dumps({"Single": 420, "Double": 520}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/espresso-macchiato/"
    },
    {
        "name": "Espresso",
        "slug": "espresso",
        "categories": ["espresso"],
        "image": "/products/beverages/espresso.jpg",
        "short_description": "Pure, concentrated shots extracted from our signature 5-origin master espresso blend.",
        "description": "Thick golden-red crema over a rich body with notes of dark chocolate and roasted caramel.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Espresso",
        "base": "Espresso",
        "size_options": json.dumps({"Single": 380, "Double": 480}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/espresso/"
    },
    {
        "name": "Double Chocolate Latte",
        "slug": "double-chocolate-latte",
        "categories": ["espresso"],
        "image": "/products/beverages/double-chocolate-latte.jpg",
        "short_description": "Espresso shots with Dutch chocolate powder, chocolate syrup, and steamed milk.",
        "description": "Extra rich chocolate notes balanced with our dark espresso blend and velvety microfoam.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Dark Chocolate",
        "size_options": json.dumps({"Small": 750, "Regular": 850, "Large": 950}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Chocolate", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/double-chocolate-latte/"
    },
    {
        "name": "Caramel Macchiato",
        "slug": "caramel-macchiato",
        "categories": ["espresso"],
        "image": "/products/beverages/caramel-macchiato.jpg",
        "short_description": "Vanilla-infused steamed milk marked with bold espresso and crosshatched with caramel sauce.",
        "description": "Layers of vanilla steamed milk and fresh espresso crowned with artisanal golden caramel drizzle.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso, Vanilla & Caramel",
        "size_options": json.dumps({"Small": 740, "Regular": 840, "Large": 940}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Caramel", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/caramel-macchiato/"
    },
    {
        "name": "Caramel Latte",
        "slug": "caramel-latte",
        "categories": ["espresso"],
        "image": "/products/beverages/caramel-latte.jpg",
        "short_description": "Espresso with French Deluxe Vanilla, artisan caramel sauce, and steamed milk.",
        "description": "Smooth espresso mixed with sweet caramel sauce and steamed milk, finished with caramel drizzle.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Caramel",
        "size_options": json.dumps({"Small": 720, "Regular": 820, "Large": 920}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Caramel", "Vanilla"]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/caramel-latte/"
    },
    {
        "name": "Cappuccino",
        "slug": "cappuccino",
        "categories": ["espresso"],
        "image": "/products/beverages/cappuccino.jpg",
        "short_description": "Equal parts espresso, steamed milk, and a thick cushion of velvety milk foam.",
        "description": "Authentic Italian style with deep espresso depth under a luxurious mountain of airy microfoam.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Milk Foam",
        "size_options": json.dumps({"Small": 620, "Regular": 720, "Large": 820}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/cappuccino/"
    },
    {
        "name": "Café Latte",
        "slug": "cafe-latte",
        "categories": ["espresso"],
        "image": "/products/beverages/cafe-latte.jpg",
        "short_description": "Rich espresso shots balanced with creamy steamed milk and a light layer of foam.",
        "description": "A classic espresso drink made with freshly pulled shots and expertly steamed sweet milk.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Steamed Milk",
        "size_options": json.dumps({"Small": 620, "Regular": 720, "Large": 820}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut", "Chocolate"]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/cafe-latte/"
    },
    {
        "name": "Americano",
        "slug": "americano",
        "categories": ["espresso"],
        "image": "/products/beverages/americano.jpg",
        "short_description": "Espresso shots topped with hot water for a smooth, rich cup with full crema.",
        "description": "Espresso shots combined with hot water, preserving the nuanced flavor and crema of our espresso.",
        "hot_available": True,
        "iced_available": True,
        "beverage_type": "Espresso",
        "base": "Espresso & Water",
        "size_options": json.dumps({"Small": 520, "Regular": 580, "Large": 640}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps(["Vanilla", "Caramel", "Hazelnut"]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/americano/"
    },
    {
        "name": "Today's Fresh Brew",
        "slug": "todays-fresh-brew",
        "categories": ["brewed"],
        "image": "/products/beverages/todays-fresh-brew.jpg",
        "short_description": "Freshly drip-brewed single-origin or master blend coffee of the day.",
        "description": "Brewed fresh throughout the day from our rotating selection of top 1% Specialty Grade Arabica coffees.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Brewed Coffee",
        "base": "Brewed Coffee",
        "size_options": json.dumps({"Small": 480, "Regular": 540, "Large": 600}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": True,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/todays-fresh-brew/"
    },
    {
        "name": "Coffee-to-Go",
        "slug": "coffee-to-go",
        "categories": ["brewed"],
        "image": "/products/beverages/coffee-to-go.jpg",
        "short_description": "Large insulated beverage carrier filled with fresh drip-brewed coffee.",
        "description": "Serves up to 8 cups of our signature fresh brewed coffee. Includes cups, stirrers, and condiments.",
        "hot_available": True,
        "iced_available": False,
        "beverage_type": "Brewed Coffee",
        "base": "Brewed Coffee Carrier",
        "size_options": json.dumps({"Carrier (96oz)": 3400}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/coffee-to-go/"
    },
    {
        "name": "Matcha Green Tea Ice Blended",
        "slug": "matcha-green-tea-ice-blended",
        "categories": ["tea-latte", "non-coffee"],
        "image": "/products/beverages/matcha-green-tea-ice-blended.jpg",
        "short_description": "Japanese ceremonial matcha blended with French Deluxe Vanilla, milk, and pebble ice.",
        "description": "Antioxidant-rich Japanese matcha green tea blended into a frosty vanilla shake with whipped cream.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Tea Ice Blended",
        "base": "Japanese Matcha & Vanilla",
        "size_options": json.dumps({"Small": 850, "Regular": 950, "Large": 1050}),
        "milk_options": json.dumps(["Whole Milk", "Skim Milk", "Soy Milk", "Almond Milk", "Oat Milk"]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": True,
        "whipped_cream_available": True,
        "customization_enabled": True,
        "source_url": "https://www.coffeebean.pk/menu/matcha-green-tea-ice-blended/"
    },
    {
        "name": "Passion Fruit Granita Tea Ice Blended",
        "slug": "passion-fruit-granita-tea-ice-blended",
        "categories": ["tea-latte", "non-coffee"],
        "image": "/products/beverages/passion-fruit-granita-tea-ice-blended.jpg",
        "short_description": "Tropical passion fruit tea blended with fruit granita concentrate and crushed ice.",
        "description": "Tangy, frosty, and refreshing. A thirst-quenching tea granita made with real passion fruit botanicals.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Tea Granita",
        "base": "Passion Fruit Tea & Ice",
        "size_options": json.dumps({"Small": 790, "Regular": 890, "Large": 990}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/passion-fruit-granita-tea-ice-blended/"
    },
    {
        "name": "Pear Berry Granita Tea Ice Blended",
        "slug": "pear-berry-granita-tea-ice-blended",
        "categories": ["tea-latte", "non-coffee"],
        "image": "/products/beverages/pear-berry-granita-tea-ice-blended.jpg",
        "short_description": "Swedish berries herbal tea blended with crisp pear puree and crushed ice.",
        "description": "A vibrant crimson tea slush combining juicy orchard pear with tangy Swedish berries.",
        "hot_available": False,
        "iced_available": True,
        "beverage_type": "Tea Granita",
        "base": "Berry Herbal Tea & Pear",
        "size_options": json.dumps({"Small": 790, "Regular": 890, "Large": 990}),
        "milk_options": json.dumps([]),
        "flavor_options": json.dumps([]),
        "extra_shot_available": False,
        "whipped_cream_available": False,
        "customization_enabled": False,
        "source_url": "https://www.coffeebean.pk/menu/pear-berry-granita-tea-ice-blended/"
    }
]

# 29 Canonical Foods
FOOD_DATA = [
    {
        "name": "Loaded French Fries With Cuban Chicken",
        "slug": "loaded-french-fries-with-cuban-chicken",
        "category": "small-bites",
        "image": "/products/food/loaded-french-fries-with-cuban-chicken.png",
        "short_description": "Crispy golden french fries loaded with spiced Cuban chicken and melted cheese.",
        "description": "Crispy fries smothered with zesty Cuban pulled chicken, warm cheddar sauce, and jalapeno slices.",
        "portion": "Sharing Platter",
        "price": 1150,
        "source_url": "https://www.coffeebean.pk/menu/loaded-french-fries-with-cuban-chicken/"
    },
    {
        "name": "French Fries",
        "slug": "french-fries",
        "category": "small-bites",
        "image": "/products/food/french-fries.png",
        "short_description": "Crispy salted potato french fries served hot with dipping sauce.",
        "description": "Golden, perfectly seasoned french fries served with house garlic mayo and tomato dip.",
        "portion": "Individual Snack",
        "price": 550,
        "source_url": "https://www.coffeebean.pk/menu/french-fries/"
    },
    {
        "name": "Chicken Nuggets",
        "slug": "chicken-nuggets",
        "category": "small-bites",
        "image": "/products/food/chicken-nuggets.png",
        "short_description": "Crispy breaded tender chicken nuggets served with savory dips.",
        "description": "Bite-sized chicken breast nuggets fried golden brown and served with dipping sauce.",
        "portion": "6 Pcs with Fries",
        "price": 750,
        "source_url": "https://www.coffeebean.pk/menu/chicken-nuggets/"
    },
    {
        "name": "LA Club Sandwich",
        "slug": "la-club-sandwich",
        "category": "sandwich",
        "image": "/products/food/la-club-sandwich.png",
        "short_description": "Triple-decker toasted club sandwich with grilled chicken, egg, and crisp greens.",
        "description": "Classic California style layered club sandwich with seasoned grilled chicken, egg, tomato, cheddar, and crisp lettuce.",
        "portion": "Served with French Fries & Coleslaw",
        "price": 1250,
        "source_url": "https://www.coffeebean.pk/menu/la-club-sandwich/"
    },
    {
        "name": "Grilled Cheese Sandwich",
        "slug": "grilled-cheese-sandwich",
        "category": "sandwich",
        "image": "/products/food/grilled-cheese-sandwich.png",
        "short_description": "Golden butter-toasted sandwich loaded with melted cheddar and mozzarella.",
        "description": "Artisan toasted bread bursting with melted cheese blend, served hot and gooey.",
        "portion": "Served with French Fries",
        "price": 950,
        "source_url": "https://www.coffeebean.pk/menu/grilled-cheese-sandwich/"
    },
    {
        "name": "Mexican BBQ Chicken Steak",
        "slug": "mexican-bbq-chicken-steak",
        "category": "steak",
        "image": "/products/food/mexican-bbq-chicken-steak.png",
        "short_description": "Flame-grilled chicken breast glazed with smoky Mexican BBQ sauce.",
        "description": "Tender grilled chicken fillet seasoned with Mexican spices, drizzled with smoky barbecue sauce, served with sauteed vegetables and fries.",
        "portion": "Entree with Vegetables & Fries",
        "price": 1550,
        "source_url": "https://www.coffeebean.pk/menu/mexican-bbq-chicken-steak-2/"
    },
    {
        "name": "Mushroom Chicken Steak",
        "slug": "mushroom-chicken-steak",
        "category": "steak",
        "image": "/products/food/mushroom-chicken-steak.png",
        "short_description": "Grilled chicken fillet smothered in a rich, creamy wild mushroom sauce.",
        "description": "Juicy chicken breast steak topped with velvety mushroom cream reduction, served with roasted potatoes and greens.",
        "portion": "Entree with Potatoes & Sauteed Veggies",
        "price": 1550,
        "source_url": "https://www.coffeebean.pk/menu/mexican-bbq-chicken-steak/"
    },
    {
        "name": "Texan BBQ Chicken Burger",
        "slug": "texan-bbq-chicken-burger",
        "category": "burger",
        "image": "/products/food/texan-bbq-chicken-burger.png",
        "short_description": "Crispy chicken patty with smoky Texan BBQ glaze, cheddar, and caramelized onions.",
        "description": "Toasted brioche bun filled with crispy seasoned chicken, barbecue sauce, melted cheese, and fresh pickles.",
        "portion": "Served with Crispy Fries",
        "price": 1150,
        "source_url": "https://www.coffeebean.pk/menu/texan-bbq-chicken-burger/"
    },
    {
        "name": "Mushroom & Cheese Omelette",
        "slug": "mushroom-cheese-omelette",
        "category": "breakfast-all-day",
        "image": "/products/food/mushroom-cheese-omelette.png",
        "short_description": "Fluffy folded three-egg omelette stuffed with sauteed mushrooms and cheddar.",
        "description": "Farm-fresh eggs cooked golden with sliced button mushrooms, melted cheese, and fine herbs. Served with toasted bread and butter.",
        "portion": "Served with Toast & Grilled Tomato",
        "price": 850,
        "source_url": "https://www.coffeebean.pk/menu/mushroom-cheese-omelette/"
    },
    {
        "name": "Mexican omelette",
        "slug": "mexican-omelette",
        "category": "breakfast-all-day",
        "image": "/products/food/mexican-omelette.png",
        "short_description": "Spicy omelette folded with bell peppers, jalapenos, onions, and melted cheese.",
        "description": "Zesty Mexican-style omelette filled with colorful peppers, tomatoes, spicy jalapeno slices, and melted cheese blend.",
        "portion": "Served with Toast & Hash Browns",
        "price": 850,
        "source_url": "https://www.coffeebean.pk/menu/mexican-omelette/"
    },
    {
        "name": "Waffles",
        "slug": "waffles",
        "category": "breakfast-all-day",
        "image": "/products/food/waffles.jpg",
        "short_description": "Freshly pressed golden Belgian waffles served with maple syrup and butter.",
        "description": "Crisp on the outside, fluffy on the inside Belgian waffles dusted with powdered sugar and served with pure maple syrup.",
        "portion": "2 Belgian Waffles with Maple Syrup",
        "price": 850,
        "source_url": "https://www.coffeebean.pk/menu/waffles/"
    },
    {
        "name": "Scrambled Eggs",
        "slug": "scrambled-eggs",
        "category": "breakfast-all-day",
        "image": "/products/food/scrambled-eggs.png",
        "short_description": "Silky, buttery scrambled farm eggs served with toasted artisan bread.",
        "description": "Slow-cooked soft scrambled eggs seasoned with butter, salt, and black pepper, served alongside toasted bread.",
        "portion": "Served with Toast & Butter",
        "price": 750,
        "source_url": "https://www.coffeebean.pk/menu/scrambled-eggs/"
    },
    {
        "name": "Egg & cheese Croissant",
        "slug": "egg-cheese-croissant",
        "category": "breakfast-all-day",
        "image": "/products/food/egg-cheese-croissant.jpg",
        "short_description": "Flaky butter croissant stuffed with fluffy scrambled eggs and melted cheddar.",
        "description": "Freshly baked butter croissant filled with soft eggs and warm melted cheese.",
        "portion": "1 Filled Croissant with Potato Wedges",
        "price": 890,
        "source_url": "https://www.coffeebean.pk/menu/egg-cheese-croissant/"
    },
    {
        "name": "French Toast",
        "slug": "french-toast",
        "category": "breakfast-all-day",
        "image": "/products/food/french-toast.jpg",
        "short_description": "Brioche bread soaked in rich vanilla cinnamon custard, griddled golden.",
        "description": "Thick brioche slices soaked in egg and cream, cooked to golden perfection and dusted with cinnamon sugar.",
        "portion": "Served with Maple Syrup & Butter",
        "price": 850,
        "source_url": "https://www.coffeebean.pk/menu/french-toast/"
    },
    {
        "name": "Egg & Cheese Wrap",
        "slug": "egg-cheese-wrap",
        "category": "wrap",
        "image": "/products/food/egg-cheese-wrap.png",
        "short_description": "Tortilla wrap rolled with soft eggs, melted cheddar, and herb mayo.",
        "description": "Warm flour tortilla rolled with fluffy eggs, sharp cheddar cheese, and fresh greens.",
        "portion": "Served with French Fries",
        "price": 890,
        "source_url": "https://www.coffeebean.pk/menu/egg-cheese-wrap/"
    },
    {
        "name": "Spicy Chicken Wrap",
        "slug": "spicy-chicken-wrap",
        "category": "wrap",
        "image": "/products/food/spicy-chicken-wrap.png",
        "short_description": "Grilled spicy chicken strips with jalapenos and spicy mayo in a soft tortilla.",
        "description": "Zesty marinated chicken strips wrapped with lettuce, jalapenos, and spicy chili sauce.",
        "portion": "Served with Crispy Fries",
        "price": 1050,
        "source_url": "https://www.coffeebean.pk/menu/spicy-chicken-wrap/"
    },
    {
        "name": "Cuban Chicken Sandwich",
        "slug": "cuban-chicken-sandwich",
        "category": "sandwich",
        "image": "/products/food/cuban-chicken-sandwich.png",
        "short_description": "Pressed sandwich with citrus mojo marinated chicken, mustard, pickles, and swiss cheese.",
        "description": "Cuban-style toasted sandwich filled with savory shredded chicken, pickles, yellow mustard, and melted cheese.",
        "portion": "Served with French Fries",
        "price": 1150,
        "source_url": "https://www.coffeebean.pk/menu/cuban-chicken-sandwich/"
    },
    {
        "name": "Chicken & Mushroom Croissant Sandwich",
        "slug": "chicken-mushroom-croissant-sandwich",
        "category": "sandwich",
        "image": "/products/food/chicken-mushroom-croissant-sandwich.png",
        "short_description": "Buttery croissant filled with creamy chicken and mushroom ragout.",
        "description": "Flaky French croissant filled with tender shredded chicken in a rich mushroom bechamel sauce.",
        "portion": "Served with Fresh Garden Salad",
        "price": 1050,
        "source_url": "https://www.coffeebean.pk/menu/chicken-mushroom-croissant-sandwich/"
    },
    {
        "name": "Italian Chicken Sandwich",
        "slug": "italian-chicken-sandwich",
        "category": "sandwich",
        "image": "/products/food/italian-chicken-sandwich.png",
        "short_description": "Grilled chicken with pesto mayo, sun-dried tomatoes, and fresh mozzarella on focaccia.",
        "description": "Toasted Italian bread with herb-marinated chicken breast, fragrant basil pesto, and melted mozzarella.",
        "portion": "Served with Crispy Fries",
        "price": 1150,
        "source_url": "https://www.coffeebean.pk/menu/italian-chicken-sandwich/"
    },
    {
        "name": "Chipotle Chicken Sandwich",
        "slug": "chipotle-chicken-sandwich",
        "category": "sandwich",
        "image": "/products/food/chipotle-chicken-sandwich.png",
        "short_description": "Smoky chipotle chicken with melted cheese, lettuce, and tomatoes on ciabatta.",
        "description": "Artisan bread loaded with grilled chicken breast tossed in spicy chipotle adobo sauce and melted cheese.",
        "portion": "Served with French Fries",
        "price": 1150,
        "source_url": "https://www.coffeebean.pk/menu/chipotle-chicken/"
    },
    {
        "name": "Chef’s Tuna Sandwich",
        "slug": "chefs-tuna-sandwich",
        "category": "sandwich",
        "image": "/products/food/chefs-tuna-sandwich.png",
        "short_description": "Gourmet tuna salad with celery, red onions, and capers on toasted multigrain bread.",
        "description": "Flaked tuna tossed with creamy herb mayonnaise, crisp celery, and lettuce in artisan bread.",
        "portion": "Served with Potato Chips",
        "price": 1100,
        "source_url": "https://www.coffeebean.pk/menu/chefs-tuna/"
    },
    {
        "name": "Cranberry Salad",
        "slug": "cranberry-salad",
        "category": "salad",
        "image": "/products/food/cranberry-salad.jpg",
        "short_description": "Mixed greens, dried cranberries, candied nuts, and feta with balsamic dressing.",
        "description": "Fresh garden salad tossed with sweet dried cranberries, toasted walnuts, feta crumbles, and house vinaigrette.",
        "portion": "Entree Salad",
        "price": 950,
        "source_url": "https://www.coffeebean.pk/menu/cranberry-salad/"
    },
    {
        "name": "Caesar Salad",
        "slug": "caesar-salad",
        "category": "salad",
        "image": "/products/food/caesar-salad.jpg",
        "short_description": "Crisp romaine lettuce, garlic croutons, parmesan shavings, and Caesar dressing.",
        "description": "Crisp romaine hearts tossed in creamy garlic Caesar dressing, topped with shaved parmesan and herb croutons.",
        "portion": "Entree Salad (Optional Chicken Add-on)",
        "price": 950,
        "source_url": "https://www.coffeebean.pk/menu/caesar-salad/"
    },
    {
        "name": "Chicken Tomato & Herb Pasta",
        "slug": "chicken-tomato-herb-pasta",
        "category": "pasta",
        "image": "/products/food/chicken-tomato-herb-pasta.png",
        "short_description": "Penne pasta tossed with grilled chicken in slow-simmered tomato basil marinara.",
        "description": "Al dente penne pasta coated in rich Italian marinara sauce with seasoned chicken pieces and freshly grated parmesan.",
        "portion": "Served with Garlic Bread",
        "price": 1350,
        "source_url": "https://www.coffeebean.pk/menu/tomato-herb-pasta/"
    },
    {
        "name": "Chicken Lasagna",
        "slug": "chicken-lasagna",
        "category": "pasta",
        "image": "/products/food/chicken-lasagna.png",
        "short_description": "Baked layered pasta with minced chicken ragu, creamy bechamel, and mozzarella.",
        "description": "Generous layers of Italian pasta sheets, slow-cooked savory chicken meat sauce, rich bechamel, and melted golden mozzarella.",
        "portion": "Baked Portion with Garlic Bread",
        "price": 1450,
        "source_url": "https://www.coffeebean.pk/menu/chicken-lasagna/"
    },
    {
        "name": "Chicken & Mushroom Pasta",
        "slug": "chicken-mushroom-pasta",
        "category": "pasta",
        "image": "/products/food/chicken-mushroom-pasta.png",
        "short_description": "Fettuccine or penne pasta in rich white parmesan cream sauce with chicken and mushrooms.",
        "description": "Tender chicken and sliced button mushrooms simmered in a velvety garlic cream sauce over al dente pasta.",
        "portion": "Served with Garlic Bread",
        "price": 1450,
        "source_url": "https://www.coffeebean.pk/menu/chicken-mushroom-spaghetti/"
    },
    {
        "name": "Chicken Sausage Pizza",
        "slug": "chicken-sausage-pizza",
        "category": "pizza",
        "image": "/products/food/chicken-sausage-pizza.jpg",
        "short_description": "Crispy thin crust pizza topped with spicy chicken sausage, marinara, and mozzarella.",
        "description": "Stone-baked thin crust pizza spread with rich tomato sauce, sliced chicken sausage, bell peppers, and mozzarella.",
        "portion": "Individual 9-inch Pizza",
        "price": 1250,
        "source_url": "https://www.coffeebean.pk/menu/skinny-pizza-sausage/"
    },
    {
        "name": "Chicken Jalapeno Pizza",
        "slug": "chicken-jalapeno-pizza",
        "category": "pizza",
        "image": "/products/food/chicken-jalapeno-pizza.jpg",
        "short_description": "Thin crust pizza topped with spicy grilled chicken, jalapenos, and mozzarella.",
        "description": "Zesty thin crust pizza topped with spiced chicken chunks, fiery pickled jalapenos, and melted mozzarella.",
        "portion": "Individual 9-inch Pizza",
        "price": 1250,
        "source_url": "https://www.coffeebean.pk/menu/chicken-jalapeno-pizza/"
    },
    {
        "name": "Margherita Pizza",
        "slug": "margherita-pizza",
        "category": "pizza",
        "image": "/products/food/margherita-pizza.jpg",
        "short_description": "Classic Neapolitan style pizza with tomato sauce, fresh mozzarella, and aromatic basil.",
        "description": "Simple perfection. Hand-stretched thin crust with Italian tomato sauce, melted mozzarella, and fresh basil leaves.",
        "portion": "Individual 9-inch Pizza",
        "price": 1100,
        "source_url": "https://www.coffeebean.pk/menu/margherita-pizza/"
    }
]

# 33 Official Store Locations
STORES_DATA = [
    # ISLAMABAD
    {
        "name": "F-11 Markaz",
        "slug": "f-11-markaz-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Shop 23, Olympus Mall, F-11 Markaz, Islamabad",
        "phone": "051 8460200",
        "latitude": 33.6844,
        "longitude": 72.9885,
        "schedule": "islamabad_standard"
    },
    {
        "name": "F-6 Markaz",
        "slug": "f-6-markaz-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Plot 16-A, Mountain View Plaza, F-6 Markaz, Islamabad",
        "phone": "051 8467900",
        "latitude": 33.7297,
        "longitude": 73.0768,
        "schedule": "islamabad_standard"
    },
    {
        "name": "I-8 Markaz",
        "slug": "i-8-markaz-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Plot # 17 & 18, I-8 Markaz, Islamabad",
        "phone": "051 8892429",
        "latitude": 33.6685,
        "longitude": 73.0761,
        "schedule": "islamabad_standard"
    },
    {
        "name": "Bahria Town Islamabad",
        "slug": "bahria-town-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Phase 7, Bahria Town Expressway, Islamabad",
        "phone": "051 8355507",
        "latitude": 33.5358,
        "longitude": 73.1205,
        "schedule": "bahria_rawalpindi"
    },
    {
        "name": "Elysium Tower",
        "slug": "elysium-tower-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Opposite Centaurus, Elysium Tower, Islamabad",
        "phone": "051 6167272",
        "latitude": 33.7081,
        "longitude": 73.0519,
        "schedule": "islamabad_standard"
    },
    {
        "name": "Zarpar Orchard D12",
        "slug": "zarpar-orchard-d12-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "D12 Markaz, Islamabad",
        "phone": "051 2750276",
        "latitude": 33.7198,
        "longitude": 72.9554,
        "schedule": "islamabad_standard"
    },
    {
        "name": "PSO Capri F-7",
        "slug": "pso-capri-f-7-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Jinnah Super, F-7, Islamabad",
        "phone": "051 2744984",
        "latitude": 33.7215,
        "longitude": 73.0558,
        "schedule": "islamabad_standard"
    },
    {
        "name": "PSO Islamabad Expressway",
        "slug": "pso-islamabad-expressway",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "PSO Islamabad Expressway, Islamabad",
        "phone": "051 6107528",
        "latitude": 33.6421,
        "longitude": 73.1092,
        "schedule": "islamabad_standard"
    },
    {
        "name": "AJ Towers",
        "slug": "aj-towers-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Gulberg Greens, Islamabad",
        "phone": "051 8824934",
        "latitude": 33.6062,
        "longitude": 73.1345,
        "schedule": "islamabad_standard"
    },
    {
        "name": "Civic Mall",
        "slug": "civic-mall-islamabad",
        "city": "Islamabad",
        "province": "Federal Capital",
        "address": "Bahria Town, Phase 04, Islamabad",
        "phone": None,
        "latitude": 33.5684,
        "longitude": 73.1052,
        "schedule": "bahria_rawalpindi"
    },

    # RAWALPINDI
    {
        "name": "Saddar Rawalpindi",
        "slug": "saddar-rawalpindi",
        "city": "Rawalpindi",
        "province": "Punjab",
        "address": "Ground Floor, Madison Square Mall, Near GPO, Saddar, Rawalpindi",
        "phone": "051 6162606",
        "latitude": 33.5975,
        "longitude": 73.0543,
        "schedule": "bahria_rawalpindi"
    },
    {
        "name": "Bahria Town Rawalpindi",
        "slug": "bahria-town-rawalpindi",
        "city": "Rawalpindi",
        "province": "Punjab",
        "address": "Rizvi Plaza, Talwar Chowk, Bahria Town, Rawalpindi",
        "phone": None,
        "latitude": 33.5412,
        "longitude": 73.1167,
        "schedule": "bahria_rawalpindi"
    },

    # LAHORE
    {
        "name": "Gulberg Fountain",
        "slug": "gulberg-fountain-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Avenue, Main Boulevard, Gulberg, Lahore",
        "phone": "042 38911007",
        "latitude": 31.5204,
        "longitude": 74.3587,
        "schedule": "lahore_standard"
    },
    {
        "name": "Packages Mall",
        "slug": "packages-mall-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Walton Road, Packages Mall, Lahore",
        "phone": "042 38912490",
        "latitude": 31.4744,
        "longitude": 74.3592,
        "schedule": "packages_mall"
    },
    {
        "name": "DHA Phase 5",
        "slug": "dha-phase-5-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Plot 20-A, Commercial Area, Main Boulevard, DHA Phase 5, Lahore",
        "phone": "042 37182933",
        "latitude": 31.4645,
        "longitude": 74.4089,
        "schedule": "lahore_standard"
    },
    {
        "name": "Phase 2 Johar Town",
        "slug": "phase-2-johar-town-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Block N, Phase 2, Johar Town, Lahore",
        "phone": "042 32290489",
        "latitude": 31.4697,
        "longitude": 74.2728,
        "schedule": "lahore_standard"
    },
    {
        "name": "Thokar Niaz Baig",
        "slug": "thokar-niaz-baig-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Attock Fuel Station, Thokar Niaz Baig, Lahore",
        "phone": "042 32800004",
        "latitude": 31.4702,
        "longitude": 74.2384,
        "schedule": "lahore_standard"
    },
    {
        "name": "Downtown Hotel & Residences",
        "slug": "downtown-hotel-residences-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Liberty Roundabout, Downtown Hotel & Residences, Lahore",
        "phone": "042 37897444",
        "latitude": 31.5126,
        "longitude": 74.3438,
        "schedule": "lahore_standard"
    },
    {
        "name": "PSO Girja Chowk",
        "slug": "pso-girja-chowk-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "PSO, Girja Chowk, Cantt, Lahore",
        "phone": "042 37250399",
        "latitude": 31.5497,
        "longitude": 74.3912,
        "schedule": "lahore_standard"
    },
    {
        "name": "Defense Raya",
        "slug": "defense-raya-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "85 Fairways Commercial, DHA Phase VI, Lahore",
        "phone": "042 34551243",
        "latitude": 31.4398,
        "longitude": 74.4532,
        "schedule": "lahore_standard"
    },
    {
        "name": "Bahria Town Lahore",
        "slug": "bahria-town-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Rizvi Plaza, Talwar Chowk, Bahria Town, Lahore",
        "phone": "042 37450703",
        "latitude": 31.3687,
        "longitude": 74.1812,
        "schedule": "lahore_standard"
    },
    {
        "name": "Lake City",
        "slug": "lake-city-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Block M 1, Lake City, Lahore",
        "phone": "042 32321422",
        "latitude": 31.3854,
        "longitude": 74.2498,
        "schedule": "lahore_standard"
    },
    {
        "name": "Z Block DHA Phase III",
        "slug": "z-block-dha-phase-iii-lahore",
        "city": "Lahore",
        "province": "Punjab",
        "address": "Z Block Commercial Area, DHA Phase III, Lahore",
        "phone": "042 34551932",
        "latitude": 31.4795,
        "longitude": 74.3854,
        "schedule": "lahore_standard"
    },

    # KARACHI
    {
        "name": "DHA Phase 6 Karachi",
        "slug": "dha-phase-6-karachi",
        "city": "Karachi",
        "province": "Sindh",
        "address": "12-C, Main Khayaban-e-Bukhari, DHA Phase 6, Karachi",
        "phone": "021 33399587",
        "latitude": 24.7932,
        "longitude": 67.0654,
        "schedule": "karachi_standard"
    },
    {
        "name": "Marine Tower",
        "slug": "marine-tower-karachi",
        "city": "Karachi",
        "province": "Sindh",
        "address": "Plot # 9, Block 4, Clifton, Karachi",
        "phone": "021 33393383",
        "latitude": 24.8189,
        "longitude": 67.0287,
        "schedule": "karachi_standard"
    },
    {
        "name": "Tipu Sultan",
        "slug": "tipu-sultan-karachi",
        "city": "Karachi",
        "province": "Sindh",
        "address": "Remmco Tower, Tipu Sultan Road, Karachi",
        "phone": "021 33406562",
        "latitude": 24.8698,
        "longitude": 67.0854,
        "schedule": "karachi_standard"
    },
    {
        "name": "Byco Sea View",
        "slug": "byco-sea-view-karachi",
        "city": "Karachi",
        "province": "Sindh",
        "address": "DHA V, Karachi",
        "phone": "021 33409134",
        "latitude": 24.7895,
        "longitude": 67.0421,
        "schedule": "karachi_standard"
    },

    # OTHER CITIES
    {
        "name": "Faisalabad",
        "slug": "civil-lines-faisalabad",
        "city": "Faisalabad",
        "province": "Punjab",
        "address": "7th Faisal Lane, Civil Lines, Adjacent Sitara Tower, Faisalabad",
        "phone": "041 5486161",
        "latitude": 31.4187,
        "longitude": 73.0791,
        "schedule": "faisalabad_standard"
    },
    {
        "name": "Mall of Gujranwala",
        "slug": "mall-of-gujranwala",
        "city": "Gujranwala",
        "province": "Punjab",
        "address": "Grand Trunk Road, Mall of Gujranwala",
        "phone": "055 8026182",
        "latitude": 32.1876,
        "longitude": 74.1945,
        "schedule": "gujranwala_standard"
    },
    {
        "name": "Jhelum",
        "slug": "gt-road-jhelum",
        "city": "Jhelum",
        "province": "Punjab",
        "address": "G.T Road, Adjacent Tulip Hotel, Jhelum",
        "phone": None,
        "latitude": 32.9405,
        "longitude": 73.7276,
        "schedule": "lahore_standard"
    },
    {
        "name": "Murree",
        "slug": "lower-topa-murree",
        "city": "Murree",
        "province": "Punjab",
        "address": "Lower Topa, Murree Expressway",
        "phone": None,
        "latitude": 33.8954,
        "longitude": 73.4187,
        "schedule": "islamabad_standard"
    },
    {
        "name": "Bhera Service Area",
        "slug": "bhera-service-area",
        "city": "Bhera",
        "province": "Punjab",
        "address": "Bhera Service Area, North & South, M-2 Motorway",
        "phone": None,
        "latitude": 32.4821,
        "longitude": 72.9154,
        "schedule": "twenty_four_seven"
    },
    {
        "name": "Sialkot Cantonment",
        "slug": "sialkot-cantonment",
        "city": "Sialkot",
        "province": "Punjab",
        "address": "Aziz Bhatti Shaheed Road, Sialkot Cantonment, Sialkot",
        "phone": "052 4292949",
        "latitude": 32.5087,
        "longitude": 74.5387,
        "schedule": "sialkot_standard"
    }
]

def generate_hours(schedule_type):
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    hours_list = []

    if schedule_type in ["islamabad_standard", "lahore_standard", "karachi_standard", "sialkot_standard", "faisalabad_standard"]:
        # Mon-Fri: 8AM-1AM, Sat-Sun: 9AM-1AM
        for day in days:
            if day in ["Saturday", "Sunday"]:
                hours_list.append({"day_of_week": day, "open_time": "09:00", "close_time": "01:00", "is_closed": False, "is_24_hours": False})
            else:
                hours_list.append({"day_of_week": day, "open_time": "08:00", "close_time": "01:00", "is_closed": False, "is_24_hours": False})
    elif schedule_type == "bahria_rawalpindi":
        # Sun-Thu: 8AM-1AM, Fri-Sat: 9AM-1AM
        for day in days:
            if day in ["Friday", "Saturday"]:
                hours_list.append({"day_of_week": day, "open_time": "09:00", "close_time": "01:00", "is_closed": False, "is_24_hours": False})
            else:
                hours_list.append({"day_of_week": day, "open_time": "08:00", "close_time": "01:00", "is_closed": False, "is_24_hours": False})
    elif schedule_type == "packages_mall":
        # Mon-Thu: 10:30AM-11PM, Fri-Sun: 10:30AM-12AM
        for day in days:
            if day in ["Friday", "Saturday", "Sunday"]:
                hours_list.append({"day_of_week": day, "open_time": "10:30", "close_time": "00:00", "is_closed": False, "is_24_hours": False})
            else:
                hours_list.append({"day_of_week": day, "open_time": "10:30", "close_time": "23:00", "is_closed": False, "is_24_hours": False})
    elif schedule_type == "gujranwala_standard":
        # Mon-Sun: 8AM-1AM
        for day in days:
            hours_list.append({"day_of_week": day, "open_time": "08:00", "close_time": "01:00", "is_closed": False, "is_24_hours": False})
    elif schedule_type == "twenty_four_seven":
        for day in days:
            hours_list.append({"day_of_week": day, "open_time": "00:00", "close_time": "23:59", "is_closed": False, "is_24_hours": True})

    return hours_list

def seed_all():
    app = create_app()
    with app.app_context():
        print("=== 1. SEEDING BEVERAGE & FOOD CATEGORIES ===")
        # Seed Beverage Categories
        cat_map = {}
        for name, slug, desc, order in BEVERAGE_CATEGORIES:
            cat = Category.query.filter_by(slug=slug).first()
            if not cat:
                cat = Category(name=name, slug=slug, product_type="beverage", description=desc, sort_order=order, is_active=True)
                db.session.add(cat)
                db.session.flush()
                print(f"[NEW CAT] Beverage: {name}")
            else:
                cat.product_type = "beverage"
                cat.name = name
                cat.description = desc
                cat.sort_order = order
            cat_map[slug] = cat

        # Seed Food Categories
        for name, slug, desc, order in FOOD_CATEGORIES:
            cat = Category.query.filter_by(slug=slug).first()
            if not cat:
                cat = Category(name=name, slug=slug, product_type="food", description=desc, sort_order=order, is_active=True)
                db.session.add(cat)
                db.session.flush()
                print(f"[NEW CAT] Food: {name}")
            else:
                cat.product_type = "food"
                cat.name = name
                cat.description = desc
                cat.sort_order = order
            cat_map[slug] = cat

        db.session.commit()

        print("\n=== 2. SEEDING 45 BEVERAGE PRODUCTS ===")
        for b_data in BEVERAGES_DATA:
            prod = Product.query.filter_by(slug=b_data["slug"]).first()
            if not prod:
                prod = Product(
                    name=b_data["name"],
                    slug=b_data["slug"],
                    product_type="beverage",
                    image=b_data["image"],
                    thumbnail=b_data["image"],
                    short_description=b_data["short_description"],
                    description=b_data["description"],
                    hot_available=b_data["hot_available"],
                    iced_available=b_data["iced_available"],
                    beverage_type=b_data["beverage_type"],
                    base=b_data["base"],
                    size_options=b_data["size_options"],
                    milk_options=b_data["milk_options"],
                    flavor_options=b_data["flavor_options"],
                    extra_shot_available=b_data["extra_shot_available"],
                    whipped_cream_available=b_data["whipped_cream_available"],
                    customization_enabled=b_data["customization_enabled"],
                    source_url=b_data["source_url"],
                    stock_quantity=100,
                    is_active=True,
                    is_available=True
                )
                # Primary category
                primary_cat_slug = b_data["categories"][0]
                if primary_cat_slug in cat_map:
                    prod.category_id = cat_map[primary_cat_slug].id
                
                # Tagged secondary categories
                prod.categories = [cat_map[c] for c in b_data["categories"] if c in cat_map]
                db.session.add(prod)
                print(f"[NEW BEV] {prod.name}")
            else:
                prod.product_type = "beverage"
                prod.image = b_data["image"]
                prod.short_description = b_data["short_description"]
                prod.description = b_data["description"]
                prod.hot_available = b_data["hot_available"]
                prod.iced_available = b_data["iced_available"]
                prod.beverage_type = b_data["beverage_type"]
                prod.base = b_data["base"]
                prod.size_options = b_data["size_options"]
                prod.milk_options = b_data["milk_options"]
                prod.flavor_options = b_data["flavor_options"]
                prod.extra_shot_available = b_data["extra_shot_available"]
                prod.whipped_cream_available = b_data["whipped_cream_available"]
                prod.customization_enabled = b_data["customization_enabled"]
                prod.source_url = b_data["source_url"]
                prod.is_active = True
                prod.is_available = True
                primary_cat_slug = b_data["categories"][0]
                if primary_cat_slug in cat_map:
                    prod.category_id = cat_map[primary_cat_slug].id
                prod.categories = [cat_map[c] for c in b_data["categories"] if c in cat_map]

        db.session.commit()

        print("\n=== 3. SEEDING 29 FOOD PRODUCTS ===")
        for f_data in FOOD_DATA:
            prod = Product.query.filter_by(slug=f_data["slug"]).first()
            cat = cat_map.get(f_data["category"])
            if not prod:
                prod = Product(
                    name=f_data["name"],
                    slug=f_data["slug"],
                    product_type="food",
                    image=f_data["image"],
                    thumbnail=f_data["image"],
                    short_description=f_data["short_description"],
                    description=f_data["description"],
                    portion=f_data["portion"],
                    price=f_data["price"],
                    category_id=cat.id if cat else None,
                    source_url=f_data["source_url"],
                    stock_quantity=50,
                    is_active=True,
                    is_available=True
                )
                if cat:
                    prod.categories = [cat]
                db.session.add(prod)
                print(f"[NEW FOOD] {prod.name}")
            else:
                prod.product_type = "food"
                prod.image = f_data["image"]
                prod.short_description = f_data["short_description"]
                prod.description = f_data["description"]
                prod.portion = f_data["portion"]
                prod.price = f_data["price"]
                prod.category_id = cat.id if cat else None
                prod.source_url = f_data["source_url"]
                prod.is_active = True
                prod.is_available = True
                if cat:
                    prod.categories = [cat]

        db.session.commit()

        print("\n=== 4. SEEDING 33 OFFICIAL STORES & OPENING HOURS ===")
        for s_data in STORES_DATA:
            store = Store.query.filter_by(slug=s_data["slug"]).first()
            if not store:
                store = Store(
                    name=s_data["name"],
                    slug=s_data["slug"],
                    city=s_data["city"],
                    province=s_data["province"],
                    address=s_data["address"],
                    phone=s_data["phone"],
                    latitude=s_data["latitude"],
                    longitude=s_data["longitude"],
                    source_url="https://coffeebean.pk/menu/menu.pdf",
                    is_active=True,
                    status="Active",
                    delivery_available=True,
                    dine_in=True,
                    takeaway=True,
                    wifi=True,
                    parking=True,
                    accessible=True
                )
                db.session.add(store)
                db.session.flush()

                # Add 7-day opening hours schedules
                hours_defs = generate_hours(s_data["schedule"])
                for h in hours_defs:
                    soh = StoreOpeningHours(
                        store_id=store.id,
                        day_of_week=h["day_of_week"],
                        open_time=h["open_time"],
                        close_time=h["close_time"],
                        is_closed=h["is_closed"],
                        is_24_hours=h["is_24_hours"]
                    )
                    db.session.add(soh)
                print(f"[NEW STORE] {store.name} ({store.city})")
            else:
                store.name = s_data["name"]
                store.city = s_data["city"]
                store.province = s_data["province"]
                store.address = s_data["address"]
                store.phone = s_data["phone"]
                store.latitude = s_data["latitude"]
                store.longitude = s_data["longitude"]
                store.is_active = True
                store.status = "Active"

                # Refresh hours
                StoreOpeningHours.query.filter_by(store_id=store.id).delete()
                hours_defs = generate_hours(s_data["schedule"])
                for h in hours_defs:
                    soh = StoreOpeningHours(
                        store_id=store.id,
                        day_of_week=h["day_of_week"],
                        open_time=h["open_time"],
                        close_time=h["close_time"],
                        is_closed=h["is_closed"],
                        is_24_hours=h["is_24_hours"]
                    )
                    db.session.add(soh)

        db.session.commit()
        print("[SUCCESS] Seeding of Beverages, Food, and Stores completed!")

if __name__ == '__main__':
    seed_all()
