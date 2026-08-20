import os
import sys

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product
from app.models.setting import Setting

COFFEE_CATEGORIES = [
    {"name": "Coffee", "slug": "coffee", "parent_slug": None, "sort_order": 1},
    {"name": "Light & Distinctive", "slug": "light-distinctive", "parent_slug": "coffee", "sort_order": 2},
    {"name": "Rich & Smooth", "slug": "rich-smooth", "parent_slug": "coffee", "sort_order": 3},
    {"name": "Reserved", "slug": "reserved", "parent_slug": "coffee", "sort_order": 4},
    {"name": "Light & Subtle", "slug": "light-subtle", "parent_slug": "coffee", "sort_order": 5},
    {"name": "Decaffeinated", "slug": "decaffeinated", "parent_slug": "coffee", "sort_order": 6},
    {"name": "Flavoured Coffee", "slug": "flavoured-coffee", "parent_slug": "coffee", "sort_order": 7},
    {"name": "Dark & Distinctive", "slug": "dark-distinctive", "parent_slug": "coffee", "sort_order": 8},
    {"name": "Medium & Smooth", "slug": "medium-smooth", "parent_slug": "coffee", "sort_order": 9},
]

COFFEE_PRODUCTS = [
    {
        "name": "Colombia Antioquia",
        "slug": "colombia-antioquia",
        "pack_size": "8oz",
        "category_slug": "rich-smooth",
        "price": None, # Price not available on source catalog; preserving accuracy
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/colombia-antioquia-8oz/",
        "image": "/products/coffee/colombia-antioquia.jpg",
        "thumbnail": "/products/coffee/colombia-antioquia.jpg",
        "roast_level": "Medium Roast",
        "origin": "Antioquia, Colombia",
        "flavor_profile": "Plum aroma with hints of mandarin & milk chocolate. A smooth walnut finish.",
        "description": "Plum aroma with hints of mandarin & milk chocolate. A smooth walnut finish. Sourced from the high-altitude mountainous Antioquia department in northwestern Colombia.",
        "short_description": "Plum aroma with hints of mandarin & milk chocolate. A smooth walnut finish.",
        "availability": "In Stock",
        "stock_quantity": 25,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "100% Kona Coffee",
        "slug": "kona-coffee",
        "pack_size": "8oz",
        "category_slug": "reserved",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/100-kona-coffee-8oz/",
        "image": "/products/coffee/kona-coffee.jpg",
        "thumbnail": "/products/coffee/kona-coffee.jpg",
        "roast_level": "Medium Roast",
        "origin": "Kona District, Hawaii",
        "flavor_profile": "Sweet floral aroma, jasmine nuances, subtle nutty overtones and a buttery finish.",
        "description": "100% pure authentic Kona coffee harvested from volcanic soils on the slopes of Hualalai and Mauna Loa. Renowned worldwide for its silky body and delicate aromatic sweetness.",
        "short_description": "Sweet floral aroma, jasmine nuances, subtle nutty overtones and a buttery finish.",
        "availability": "In Stock",
        "stock_quantity": 15,
        "is_featured": True,
        "is_best_seller": False,
    },
    {
        "name": "Papua New Guinea Sigri Coffee",
        "slug": "papua-new-guinea-sigri",
        "pack_size": "8oz",
        "category_slug": "medium-smooth",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/papua-new-guinea-sigri-coffee-8oz/",
        "image": "/products/coffee/papua-new-guinea-sigri.jpg",
        "thumbnail": "/products/coffee/papua-new-guinea-sigri.jpg",
        "roast_level": "Medium Roast",
        "origin": "Sigri Estate, Wahgi Valley, Papua New Guinea",
        "flavor_profile": "Delicate mango and herbal notes with vibrant honey sweetness and clean finish.",
        "description": "Cultivated on the renowned Sigri Estate in the Wahgi Valley at 5,200 ft elevation. Jamaican Blue Mountain typica cultivars thrive in rich volcanic soil and tropical mountain climate.",
        "short_description": "Delicate mango and herbal notes with vibrant honey sweetness and clean finish.",
        "availability": "In Stock",
        "stock_quantity": 20,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Mocha Java Coffee",
        "slug": "mocha-java",
        "pack_size": "8oz",
        "category_slug": "medium-smooth",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/mocha-java-coffee-8oz/",
        "image": "/products/coffee/mocha-java.jpg",
        "thumbnail": "/products/coffee/mocha-java.jpg",
        "roast_level": "Medium Roast",
        "origin": "Arabian Yemen & Indonesian Java Blend",
        "flavor_profile": "Wild Arabian spice notes balanced by rich Indonesian dark chocolate body.",
        "description": "The world's most historic coffee blend. Combines exotic, winey Arabian Yemen Mocha beans with the heavy, syrupy depth of Indonesian Java Arabica.",
        "short_description": "Wild Arabian spice notes balanced by rich Indonesian dark chocolate body.",
        "availability": "In Stock",
        "stock_quantity": 25,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "Kenya AA Coffee",
        "slug": "kenya-aa",
        "pack_size": "8oz",
        "category_slug": "medium-smooth",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/kenya-aa-coffee-8oz/",
        "image": "/products/coffee/kenya-aa.jpg",
        "thumbnail": "/products/coffee/kenya-aa.jpg",
        "roast_level": "Medium Roast",
        "origin": "High-altitude slopes of Mt. Kenya",
        "flavor_profile": "Blackcurrant and citrus acidity with a savory, wine-like complex body.",
        "description": "Kenya AA represents the largest bean screen size and highest specialty grade in Kenyan coffee classification. Grown in nutrient-dense red volcanic soil above 5,500 ft.",
        "short_description": "Blackcurrant and citrus acidity with a savory, wine-like complex body.",
        "availability": "In Stock",
        "stock_quantity": 30,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "Costa Rica La Cascada Tarrazu Coffee",
        "slug": "costa-rica-la-cascada-tarrazu",
        "pack_size": "8oz",
        "category_slug": "medium-smooth",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/costa-rica-la-cascada-tarrazu-coffee-8oz/",
        "image": "/products/coffee/costa-rica-la-cascada-tarrazu.jpg",
        "thumbnail": "/products/coffee/costa-rica-la-cascada-tarrazu.jpg",
        "roast_level": "Medium Roast",
        "origin": "Tarrazu Valley, Costa Rica",
        "flavor_profile": "Crisp green apple, milk chocolate undertones, and toasted almond finish.",
        "description": "Harvested from the legendary La Cascada estate in Costa Rica's Tarrazu mountain basin. Renowned for strict hard bean (SHB) density and immaculate flavor clarity.",
        "short_description": "Crisp green apple, milk chocolate undertones, and toasted almond finish.",
        "availability": "In Stock",
        "stock_quantity": 22,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Colombia Narino Coffee",
        "slug": "colombia-narino",
        "pack_size": "8oz",
        "category_slug": "medium-smooth",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/colombia-narino-coffee-8oz/",
        "image": "/products/coffee/colombia-narino.jpg",
        "thumbnail": "/products/coffee/colombia-narino.jpg",
        "roast_level": "Medium Roast",
        "origin": "Nariño Department, Colombia",
        "flavor_profile": "Sugary caramel aroma, citrus brightness, and smooth toasted walnut body.",
        "description": "Grown in the dramatic steep canyons of Nariño near the equator at extreme elevations up to 6,500 ft, where warm canyon breezes shelter coffee trees during cold Andean nights.",
        "short_description": "Sugary caramel aroma, citrus brightness, and smooth toasted walnut body.",
        "availability": "In Stock",
        "stock_quantity": 25,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "House Blend Coffee",
        "slug": "house-blend",
        "pack_size": "8oz",
        "category_slug": "light-subtle",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/house-blend-coffee-8oz/",
        "image": "/products/coffee/house-blend.jpg",
        "thumbnail": "/products/coffee/house-blend.jpg",
        "roast_level": "Light Roast",
        "origin": "Specialty Latin American Blend",
        "flavor_profile": "Fragrant floral bouquet, light caramel sweetness, and crisp soothing finish.",
        "description": "The Coffee Bean & Tea Leaf's signature foundational blend created in 1963. Roasted gently to preserve the natural sweetness and delicate aromatics of Latin American coffees.",
        "short_description": "Fragrant floral bouquet, light caramel sweetness, and crisp soothing finish.",
        "availability": "In Stock",
        "stock_quantity": 40,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "Brazil Cerrado Coffee",
        "slug": "brazil-cerrado",
        "pack_size": "8oz",
        "category_slug": "light-subtle",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/brazil-cerrado-coffee-8oz/",
        "image": "/products/coffee/brazil-cerrado.jpg",
        "thumbnail": "/products/coffee/brazil-cerrado.jpg",
        "roast_level": "Light Roast",
        "origin": "Cerrado Mineiro, Minas Gerais, Brazil",
        "flavor_profile": "Toasted hazelnut, sweet golden honey, and mild low-acid chocolate finish.",
        "description": "Naturally sun-dried pulped Arabica from the plateau savannahs of Cerrado Mineiro, delivering low acidity, creamy mouthfeel, and deep nuttiness.",
        "short_description": "Toasted hazelnut, sweet golden honey, and mild low-acid chocolate finish.",
        "availability": "In Stock",
        "stock_quantity": 25,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Ethiopia Yirgacheffe Coffee",
        "slug": "ethiopia-yirgacheffe",
        "pack_size": "8oz",
        "category_slug": "light-distinctive",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/ethiopia-yirgacheffe-coffee-8oz/",
        "image": "/products/coffee/ethiopia-yirgacheffe.jpg",
        "thumbnail": "/products/coffee/ethiopia-yirgacheffe.jpg",
        "roast_level": "Light Roast",
        "origin": "Yirgacheffe, Sidamo, Southern Ethiopia",
        "flavor_profile": "Intense jasmine aroma, bergamot citrus, and honey tea-like finish.",
        "description": "Celebrated worldwide as the birthplace of Arabica coffee. Heirloom varietals wet-processed in clean mountain water yielding tea-like delicacy and intoxicating floral aromatics.",
        "short_description": "Intense jasmine aroma, bergamot citrus, and honey tea-like finish.",
        "availability": "In Stock",
        "stock_quantity": 28,
        "is_featured": True,
        "is_best_seller": True,
    },
    {
        "name": "Hazelnut Coffee",
        "slug": "hazelnut",
        "pack_size": "12oz",
        "category_slug": "flavoured-coffee",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/hazelnut-coffee-12oz/",
        "image": "/products/coffee/hazelnut.jpg",
        "thumbnail": "/products/coffee/hazelnut.jpg",
        "roast_level": "Flavoured Roast",
        "origin": "Central & South American Specialty Beans",
        "flavor_profile": "Warm toasted Oregon hazelnuts and sweet creamy buttery finish.",
        "description": "Freshly roasted specialty 100% Arabica beans infused with natural rich toasted hazelnut oils. Delicious both hot and poured over ice with a splash of cream.",
        "short_description": "Warm toasted Oregon hazelnuts and sweet creamy buttery finish.",
        "availability": "In Stock",
        "stock_quantity": 30,
        "is_featured": False,
        "is_best_seller": True,
    },
    {
        "name": "French Vanilla Coffee",
        "slug": "french-vanilla",
        "pack_size": "12oz",
        "category_slug": "flavoured-coffee",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/french-vanilla-coffee-12oz/",
        "image": "/products/coffee/french-vanilla.jpg",
        "thumbnail": "/products/coffee/french-vanilla.jpg",
        "roast_level": "Flavoured Roast",
        "origin": "Central & South American Specialty Beans",
        "flavor_profile": "Sweet Madagascar bourbon vanilla aroma with smooth creamy custard notes.",
        "description": "A customer favorite since the early 1970s. Premium whole bean Arabica blended with natural aromatic vanilla essence to create a silky, dessert-like coffee experience.",
        "short_description": "Sweet Madagascar bourbon vanilla aroma with smooth creamy custard notes.",
        "availability": "In Stock",
        "stock_quantity": 35,
        "is_featured": False,
        "is_best_seller": True,
    },
    {
        "name": "Decaf House Blend Coffee",
        "slug": "decaf-house-blend",
        "pack_size": "8oz",
        "category_slug": "decaffeinated",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/decaf-house-blend-coffee-8oz/",
        "image": "/products/coffee/decaf-house-blend.jpg",
        "thumbnail": "/products/coffee/decaf-house-blend.jpg",
        "roast_level": "Decaffeinated Light",
        "origin": "Latin America (Natural Decaf Process)",
        "flavor_profile": "Caramelized sugar, subtle apple sweetness, and clean smooth body without caffeine.",
        "description": "Naturally decaffeinated to gently remove 99.9% of caffeine while keeping intact the complete flavor spectrum, delicate floral notes, and body of our classic House Blend.",
        "short_description": "Caramelized sugar, subtle apple sweetness, and clean smooth body without caffeine.",
        "availability": "In Stock",
        "stock_quantity": 20,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Decaf Espresso Roast Coffee",
        "slug": "decaf-espresso-roast",
        "pack_size": "8oz",
        "category_slug": "decaffeinated",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/decaf-espresso-roast-coffee-8oz/",
        "image": "/products/coffee/decaf-espresso-roast.jpg",
        "thumbnail": "/products/coffee/decaf-espresso-roast.jpg",
        "roast_level": "Decaffeinated Dark",
        "origin": "Specialty Espresso Blend (Decaf)",
        "flavor_profile": "Dark bittersweet cocoa, smoky spice, and thick golden crema without caffeine.",
        "description": "Specially crafted for espresso lovers who want rich crema, intense body, and bold bittersweet chocolate extraction without caffeine.",
        "short_description": "Dark bittersweet cocoa, smoky spice, and thick golden crema without caffeine.",
        "availability": "In Stock",
        "stock_quantity": 20,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Viennese Coffee",
        "slug": "viennese",
        "pack_size": "8oz",
        "category_slug": "dark-distinctive",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/viennese-coffee-8oz/",
        "image": "/products/coffee/viennese.jpg",
        "thumbnail": "/products/coffee/viennese.jpg",
        "roast_level": "Dark Roast",
        "origin": "European Roast Blend",
        "flavor_profile": "Dark baker's chocolate, spicy clove nuances, and velvety rich body.",
        "description": "Inspired by the classic grand cafes of Vienna. Roasted to the edge of darkness to yield an aromatic, full-bodied cup with deep spicy undertones.",
        "short_description": "Dark baker's chocolate, spicy clove nuances, and velvety rich body.",
        "availability": "In Stock",
        "stock_quantity": 25,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Sumatra Mandheling Dark Coffee",
        "slug": "sumatra-mandheling-dark",
        "pack_size": "8oz",
        "category_slug": "dark-distinctive",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/sumatra-mandheling-dark-coffee-8oz/",
        "image": "/products/coffee/sumatra-mandheling-dark.jpg",
        "thumbnail": "/products/coffee/sumatra-mandheling-dark.jpg",
        "roast_level": "Dark Roast",
        "origin": "Mount Leuser, Sumatra, Indonesia",
        "flavor_profile": "Earthy cedar aroma, dark cacao, syrupy heavy body, and low acidity.",
        "description": "Grown by smallholder farmers near Mount Leuser. Prepared using the traditional Giling Basah (wet-hulling) technique for an unmistakably heavy, complex, and earthy cup.",
        "short_description": "Earthy cedar aroma, dark cacao, syrupy heavy body, and low acidity.",
        "availability": "In Stock",
        "stock_quantity": 25,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Sulawesi Toraja",
        "slug": "sulawesi-toraja",
        "pack_size": None, # Source title does not specify pack size; strictly preserving source data
        "category_slug": "dark-distinctive",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/sulawesi-toraja/",
        "image": "/products/coffee/sulawesi-toraja.jpg",
        "thumbnail": "/products/coffee/sulawesi-toraja.jpg",
        "roast_level": "Dark Roast",
        "origin": "Toraja Highlands, Sulawesi, Indonesia",
        "flavor_profile": "Ripe dark plum, cinnamon spice, syrupy molasses, and lingering cocoa.",
        "description": "Rare shade-grown coffee cultivated in the mist-shrouded Toraja highlands of Sulawesi. Renowned for its smooth, heavy body and sweet herbal finish.",
        "short_description": "Ripe dark plum, cinnamon spice, syrupy molasses, and lingering cocoa.",
        "availability": "In Stock",
        "stock_quantity": 18,
        "is_featured": False,
        "is_best_seller": False,
    },
    {
        "name": "Espresso Roast Coffee",
        "slug": "espresso-roast",
        "pack_size": "8oz",
        "category_slug": "dark-distinctive",
        "price": None,
        "currency": "PKR",
        "source_url": "https://www.coffeebean.pk/product/espresso-roast-coffee/",
        "image": "/products/coffee/espresso-roast.jpg",
        "thumbnail": "/products/coffee/espresso-roast.jpg",
        "roast_level": "Dark Roast",
        "origin": "Handcrafted Espresso Blend",
        "flavor_profile": "Bittersweet chocolate, caramelized sugar, and thick syrupy crema.",
        "description": "The master blend at the heart of every handcrafted espresso beverage served at The Coffee Bean & Tea Leaf worldwide. Roasted dark to produce rich, velvety crema.",
        "short_description": "Bittersweet chocolate, caramelized sugar, and thick syrupy crema.",
        "availability": "In Stock",
        "stock_quantity": 50,
        "is_featured": True,
        "is_best_seller": True,
    },
]

def seed_database():
    app = create_app()
    with app.app_context():
        # Ensure tables exist
        db.create_all()
        
        # 1. Seed / update categories
        cat_map = {}
        # First create parent categories
        for cat_data in COFFEE_CATEGORIES:
            if not cat_data["parent_slug"]:
                cat = Category.query.filter_by(slug=cat_data["slug"]).first()
                if not cat:
                    cat = Category(name=cat_data["name"], slug=cat_data["slug"], sort_order=cat_data["sort_order"])
                    db.session.add(cat)
                    db.session.flush()
                cat_map[cat.slug] = cat

        # Next create subcategories
        for cat_data in COFFEE_CATEGORIES:
            if cat_data["parent_slug"]:
                parent = cat_map.get(cat_data["parent_slug"]) or Category.query.filter_by(slug=cat_data["parent_slug"]).first()
                cat = Category.query.filter_by(slug=cat_data["slug"]).first()
                if not cat:
                    cat = Category(
                        name=cat_data["name"],
                        slug=cat_data["slug"],
                        parent_id=parent.id if parent else None,
                        sort_order=cat_data["sort_order"]
                    )
                    db.session.add(cat)
                    db.session.flush()
                else:
                    cat.name = cat_data["name"]
                    if parent:
                        cat.parent_id = parent.id
                    cat.sort_order = cat_data["sort_order"]
                cat_map[cat.slug] = cat

        db.session.commit()
        print(f"Synchronized {len(COFFEE_CATEGORIES)} categories.")

        # 2. Seed / update 18 coffee products
        count = 0
        for pdata in COFFEE_PRODUCTS:
            category = cat_map.get(pdata["category_slug"])
            cat_id = category.id if category else None

            product = Product.query.filter_by(slug=pdata["slug"]).first()
            if not product:
                product = Product(
                    name=pdata["name"],
                    slug=pdata["slug"],
                    pack_size=pdata["pack_size"],
                    category_id=cat_id,
                    price=pdata["price"],
                    currency=pdata["currency"],
                    source_url=pdata["source_url"],
                    image=pdata["image"],
                    thumbnail=pdata["thumbnail"],
                    roast_level=pdata["roast_level"],
                    origin=pdata["origin"],
                    flavor_profile=pdata["flavor_profile"],
                    description=pdata["description"],
                    short_description=pdata["short_description"],
                    availability=pdata["availability"],
                    stock_quantity=pdata["stock_quantity"],
                    is_featured=pdata["is_featured"],
                    is_best_seller=pdata["is_best_seller"],
                    is_active=True,
                )
                db.session.add(product)
            else:
                # Update product details
                product.name = pdata["name"]
                product.pack_size = pdata["pack_size"]
                product.category_id = cat_id
                if not product.manually_modified:
                    product.price = pdata["price"]
                product.currency = pdata["currency"]
                product.source_url = pdata["source_url"]
                product.image = pdata["image"]
                product.thumbnail = pdata["thumbnail"]
                product.roast_level = pdata["roast_level"]
                product.origin = pdata["origin"]
                product.flavor_profile = pdata["flavor_profile"]
                product.description = pdata["description"]
                product.short_description = pdata["short_description"]
                product.availability = pdata["availability"]
                product.is_featured = pdata["is_featured"]
                product.is_best_seller = pdata["is_best_seller"]
                product.is_active = True

            count += 1

        db.session.commit()
        print(f"Successfully seeded {count} official coffee products into the database.")

if __name__ == "__main__":
    seed_database()
