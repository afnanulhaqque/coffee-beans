from datetime import datetime, timedelta
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.order import Order, OrderItem
from app.models.store import Store
from app.models.banner import Banner
from app.models.cafe_menu import CafeMenuCategory, CafeMenuItem
from app.models.setting import Setting
from app.routes.settings import DEFAULT_SETTINGS

app = create_app()

def seed_database():
    with app.app_context():
        print("Recreating database tables...")
        db.drop_all()
        db.create_all()

        print("1. Seeding Users...")
        admin = User(
            name="Store Administrator",
            email="admin@coffeebean.com",
            phone="+92 300 0000000",
            role="admin",
            is_active=True
        )
        admin.set_password("admin123")
        db.session.add(admin)

        customer = User(
            name="Hamza Tariq",
            email="customer@coffeebean.com",
            phone="+92 321 9876543",
            role="customer",
            is_active=True
        )
        customer.set_password("customer123")
        db.session.add(customer)

        print("2. Seeding Settings...")
        for k, v in DEFAULT_SETTINGS.items():
            db.session.add(Setting(key=k, value=v, group="general"))

        print("3. Seeding Categories...")
        # Top-level Categories
        cat_coffee = Category(name="Coffee", slug="coffee", description="Handcrafted whole bean coffees sourced from the world's top 1% Arabica farms.", sort_order=1)
        cat_tea = Category(name="Tea", slug="tea", description="Hand-plucked whole leaf artisan teas, herbal infusions, and signature chai blends.", sort_order=2)
        cat_merch = Category(name="Merchandise & Gear", slug="merchandise", description="French presses, tumblers, ceramic mugs, and artisan brewing accessories.", sort_order=3)
        cat_desserts = Category(name="Desserts & Bakery", slug="desserts-bakery", description="Decadent cakes and fresh bakery items.", sort_order=4)
        db.session.add_all([cat_coffee, cat_tea, cat_merch, cat_desserts])
        db.session.flush()

        # Coffee Subcategories matching coffeebean.pk structure
        coffee_subs = [
            Category(name="Light & Distinctive", slug="light-distinctive", description="Subtle, crisp, and citrusy roast profiles showcasing delicate origin notes.", parent_id=cat_coffee.id, sort_order=1),
            Category(name="Rich & Smooth", slug="rich-smooth", description="Balanced body with harmonious chocolate, nut, and velvety berry undertones.", parent_id=cat_coffee.id, sort_order=2),
            Category(name="Medium & Smooth", slug="medium-smooth", description="Classic well-rounded roasts delivering clean finish and caramel aromatics.", parent_id=cat_coffee.id, sort_order=3),
            Category(name="Dark & Distinctive", slug="dark-distinctive", description="Bold, smoky, and intense body with lingering bittersweet cocoa tones.", parent_id=cat_coffee.id, sort_order=4),
            Category(name="Decaffeinated", slug="decaffeinated", description="100% naturally water-processed decaf keeping full richness without caffeine.", parent_id=cat_coffee.id, sort_order=5),
            Category(name="Flavoured Coffee", slug="flavoured-coffee", description="Infused with premium vanilla beans, hazelnut cream, and gourmet caramel.", parent_id=cat_coffee.id, sort_order=6),
            Category(name="Reserved", slug="reserved", description="Rare single-origin micro-lots from award-winning farms.", parent_id=cat_coffee.id, sort_order=7),
            Category(name="Light & Subtle", slug="light-subtle", description="Delicate floral aromatics with a bright finish.", parent_id=cat_coffee.id, sort_order=8)
        ]
        db.session.add_all(coffee_subs)

        # Tea Subcategories
        tea_subs = [
            Category(name="Black Tea", slug="black-tea", description="Robust, full-bodied black leaves from Ceylon, Assam, and Darjeeling estates.", parent_id=cat_tea.id, sort_order=1),
            Category(name="Green Tea", slug="green-tea", description="Delicately steamed Japanese Sencha, Dragonwell, and antioxidant-rich Jasmine greens.", parent_id=cat_tea.id, sort_order=2),
            Category(name="Herbal Infusions", slug="herbal-infusions", description="Naturally caffeine-free calming chamomile, peppermint, and moroccan mint.", parent_id=cat_tea.id, sort_order=3),
            Category(name="Specialty & Chai", slug="specialty-chai", description="Exotic spiced chai and signature single-estate reserve tea selections.", parent_id=cat_tea.id, sort_order=4)
        ]
        db.session.add_all(tea_subs)
        db.session.flush()

        print("3b. Seeding Products...")
        products = [
            Product(
                name="Costa Rica La Minita Whole Bean Coffee (8oz)",
                slug="costa-rica-la-minita-whole-bean-coffee-8oz",
                description="Our Costa Rica La Minita coffee is one of the most famous specialty coffees in the world. Exceptionally balanced with sweet citrus aroma, crisp body, and notes of milk chocolate and sweet orange blossom.",
                short_description="Sweet citrus aroma, crisp body, and notes of milk chocolate.",
                price=3650.0,
                sku="CB-CR-001",
                stock_quantity=45,
                image="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[0].id,
                roast_level="Light",
                origin="Tarrazu, Costa Rica",
                tags="Costa Rica, Light Roast, Single Origin, Whole Bean",
                is_active=True,
                is_featured=True,
                is_best_seller=True
            ),
            Product(
                name="Colombia Narino Supremo (8oz)",
                slug="colombia-narino-supremo-8oz",
                description="Grown high in the Colombian Andes, this coffee exhibits an intensely fragrant aroma, vibrant walnut notes, balanced acidity, and a smooth, lingering cocoa finish.",
                short_description="Intensely fragrant with vibrant walnut and smooth cocoa finish.",
                price=3450.0,
                sku="CB-COL-002",
                stock_quantity=50,
                image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[1].id,
                roast_level="Medium",
                origin="Narino, Colombia",
                tags="Colombia, Rich, Smooth, Arabica",
                is_active=True,
                is_featured=True,
                is_best_seller=True
            ),
            Product(
                name="House Blend Whole Bean Coffee (8oz)",
                slug="house-blend-whole-bean-coffee-8oz",
                description="Our signature handcrafted blend combining Central and South American coffees. Roasted to medium perfection with a clean, brisk aroma, balanced body, and subtle fruity undertones.",
                short_description="Clean, brisk aroma with balanced body and subtle fruity notes.",
                price=3200.0,
                sku="CB-HB-003",
                stock_quantity=60,
                image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[2].id,
                roast_level="Medium",
                origin="Latin America Blend",
                tags="House Blend, Medium Roast, Signature, Everyday Brew",
                is_active=True,
                is_featured=True,
                is_best_seller=True
            ),
            Product(
                name="Vienna Roast Dark Espresso (8oz)",
                slug="vienna-roast-dark-espresso-8oz",
                description="Deep, smoky, and intense. Our Vienna Roast brings out complex bittersweet chocolate aromatics, heavy crema, and a bold lingering aftertaste ideal for espresso and lattes.",
                short_description="Deep, smoky and intense with bittersweet chocolate notes.",
                price=3450.0,
                sku="CB-VR-004",
                stock_quantity=35,
                image="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[3].id,
                roast_level="Dark",
                origin="Guatemala & Sumatra Blend",
                tags="Vienna Roast, Dark Roast, Espresso, Bold",
                is_active=True,
                is_featured=True,
                is_best_seller=False
            ),
            Product(
                name="Sumatra Mandheling Dark Roast (8oz)",
                slug="sumatra-mandheling-dark-roast-8oz",
                description="Exotic, heavy-bodied single origin from the lush volcanic highlands of Sumatra. Low acidity with deep earthy, herbal aromatics and dark chocolate undertones.",
                short_description="Heavy-bodied single origin with earthy aromatics and dark chocolate.",
                price=3850.0,
                sku="CB-SUM-005",
                stock_quantity=30,
                image="https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[3].id,
                roast_level="Dark",
                origin="Sumatra, Indonesia",
                tags="Sumatra, Single Origin, Dark Roast, Heavy Body",
                is_active=True,
                is_featured=False,
                is_best_seller=True
            ),
            Product(
                name="French Vanilla Flavoured Coffee (8oz)",
                slug="french-vanilla-flavoured-coffee-8oz",
                description="Light-medium roasted Arabica beans delicately infused with rich, creamy Madagascar vanilla flavor for an aromatic and comforting cup.",
                short_description="Rich creamy Madagascar vanilla infused with light-medium roast.",
                price=3550.0,
                sku="CB-VAN-006",
                stock_quantity=40,
                image="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[5].id,
                roast_level="Flavoured",
                origin="Central America",
                tags="Vanilla, Flavoured, Sweet, Aromatic",
                is_active=True,
                is_featured=False,
                is_best_seller=True
            ),
            Product(
                name="Hazelnut Creme Flavoured Coffee (8oz)",
                slug="hazelnut-creme-flavoured-coffee-8oz",
                description="Toasted hazelnut aromatics and buttery undertones layered over smooth whole bean Arabica coffee.",
                short_description="Toasted hazelnut and buttery aroma layered over smooth Arabica.",
                price=3550.0,
                sku="CB-HAZ-007",
                stock_quantity=28,
                image="https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[5].id,
                roast_level="Flavoured",
                origin="Central America",
                tags="Hazelnut, Flavoured, Gourmet, Nutty",
                is_active=True,
                is_featured=False,
                is_best_seller=False
            ),
            Product(
                name="Decaf Espresso Roast (8oz)",
                slug="decaf-espresso-roast-8oz",
                description="100% naturally water-processed decaf keeping all the rich, caramelized complexity and crema of our signature espresso without the caffeine.",
                short_description="Naturally decaffeinated with rich caramelized complexity and crema.",
                price=3650.0,
                sku="CB-DEC-008",
                stock_quantity=22,
                image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                category_id=coffee_subs[4].id,
                roast_level="Decaf",
                origin="Latin America",
                tags="Decaf, Water Processed, Espresso, Smooth",
                is_active=True,
                is_featured=False,
                is_best_seller=False
            ),
            Product(
                name="English Breakfast Whole Leaf Tea (Tin)",
                slug="english-breakfast-whole-leaf-tea-tin",
                description="A hearty, robust blend of premium whole black tea leaves from Sri Lanka and Assam. Crisp, brisk, and full of body, perfect with milk or lemon.",
                short_description="Hearty, robust blend of Ceylon & Assam whole black tea leaves.",
                price=2850.0,
                sku="CB-TEA-001",
                stock_quantity=40,
                image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
                category_id=tea_subs[0].id,
                roast_level="Tea",
                origin="Ceylon & Assam",
                tags="Black Tea, Whole Leaf, Breakfast, Tin",
                is_active=True,
                is_featured=True,
                is_best_seller=True
            ),
            Product(
                name="Jasmine Dragon Phoenix Pearl Green Tea (Tin)",
                slug="jasmine-dragon-phoenix-pearl-green-tea-tin",
                description="Artisan hand-rolled green tea pearls scented repeatedly with midnight-blossoming fresh jasmine flowers. Delicate, floral, and deeply sweet.",
                short_description="Hand-rolled green tea pearls scented with fresh jasmine flowers.",
                price=3450.0,
                sku="CB-TEA-002",
                stock_quantity=25,
                image="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
                category_id=tea_subs[1].id,
                roast_level="Tea",
                origin="Fujian, China",
                tags="Green Tea, Jasmine Pearls, Reserve, Floral",
                is_active=True,
                is_featured=True,
                is_best_seller=False
            ),
            Product(
                name="Moroccan Mint Herbal Infusion (Tin)",
                slug="moroccan-mint-herbal-infusion-tin",
                description="Naturally caffeine-free blend of aromatic Oregon peppermint leaves and spearmint. Exceptionally refreshing, crisp, and calming digestive tea.",
                short_description="Caffeine-free blend of Oregon peppermint and spearmint leaves.",
                price=2850.0,
                sku="CB-TEA-003",
                stock_quantity=30,
                image="https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
                category_id=tea_subs[2].id,
                roast_level="Tea",
                origin="Pacific Northwest",
                tags="Herbal Tea, Peppermint, Caffeine-free, Refreshing",
                is_active=True,
                is_featured=False,
                is_best_seller=True
            ),
            Product(
                name="Artisan French Press Coffee Maker (8-Cup)",
                slug="artisan-french-press-coffee-maker-8-cup",
                description="Heat-resistant borosilicate glass with stainless steel copper-finish frame and four-level filtration system for rich, grit-free immersion coffee brewing.",
                short_description="Borosilicate glass with stainless frame & 4-level filtration system.",
                price=5800.0,
                sku="CB-MERCH-001",
                stock_quantity=15,
                image="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
                category_id=cat_merch.id,
                roast_level="Gear",
                origin="Imported",
                tags="French Press, Brewing, Gear, Copper",
                is_active=True,
                is_featured=True,
                is_best_seller=False
            ),
            Product(
                name="Double-Wall Stainless Steel Travel Tumbler 16oz",
                slug="double-wall-stainless-steel-travel-tumbler-16oz",
                description="Vacuum-insulated stainless steel tumbler keeps drinks hot for 8 hours or iced for 18 hours. Leakproof flip-lid with matte soft-touch finish.",
                short_description="Vacuum-insulated 16oz tumbler keeps drinks hot 8h / iced 18h.",
                price=4200.0,
                sku="CB-MERCH-002",
                stock_quantity=20,
                image="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
                category_id=cat_merch.id,
                roast_level="Gear",
                origin="Imported",
                tags="Tumbler, Drinkware, Stainless Steel, Travel",
                is_active=True,
                is_featured=False,
                is_best_seller=True
            )
        ]
        db.session.add_all(products)
        db.session.flush()

        print("4. Seeding Store Locations (Islamabad, Rawalpindi, Lahore, Gujranwala, Sialkot, Karachi, Faisalabad)...")
        stores = [
            Store(name="F-6 Super Market Flagship", address="Shop 5, Beverly Centre, Blue Area, F-6", city="Islamabad", phone="+92 51 2824510", opening_hours="08:00 AM - 01:00 AM", latitude=33.7215, longitude=73.0645, image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", features="WiFi, Outdoor Deck, Roastery Bar, Drive-thru", is_active=True),
            Store(name="Elysium Mall F-11", address="Ground Floor, Elysium Mall, Sector F-11", city="Islamabad", phone="+92 51 2110992", opening_hours="08:00 AM - Midnight", latitude=33.6844, longitude=72.9882, features="Co-working Pods, Fast WiFi, Bakery Counter", is_active=True),
            Store(name="I-8 Markaz Cafe", address="Executive Complex, Main I-8 Markaz", city="Islamabad", phone="+92 51 4861200", opening_hours="08:00 AM - Midnight", latitude=33.6685, longitude=73.0762, features="WiFi, Terrace Seating", is_active=True),
            Store(name="Bahria Town Civic Centre", address="Plot 12, Civic Centre, Phase 4, Bahria Town", city="Rawalpindi", phone="+92 51 5732100", opening_hours="08:00 AM - 01:00 AM", latitude=33.5651, longitude=73.1098, image="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80", features="Drive-thru Pickup, High-speed WiFi, Outdoor Seating", is_active=True),
            Store(name="Gulberg III Artisan Lounge", address="Mall 1, Main Boulevard, Gulberg III", city="Lahore", phone="+92 42 35790014", opening_hours="08:00 AM - 01:30 AM", latitude=31.5126, longitude=74.3486, image="https://images.unsplash.com/photo-1445116572660-238429888843?auto=format&fit=crop&w=800&q=80", features="Terrace Lounge, Nitro Tap, Free WiFi", is_active=True),
            Store(name="DHA Phase V Raya Store", address="Fairways Commercial, Defence Raya Golf Resort, Phase 5", city="Lahore", phone="+92 42 37189920", opening_hours="07:00 AM - Midnight", latitude=31.4682, longitude=74.4328, image="https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80", features="Golf Course View, WiFi, Meeting Table", is_active=True),
            Store(name="Packages Mall Cafe", address="First Floor, Packages Mall, Walton Road", city="Lahore", phone="+92 42 38302190", opening_hours="10:00 AM - Midnight", latitude=31.4746, longitude=74.3582, features="Mall Seating, Fast Service, Ice Blended Bar", is_active=True),
            Store(name="Johar Town Emporium Store", address="Commercial Zone, Phase 2, Johar Town", city="Lahore", phone="+92 42 35310022", opening_hours="08:00 AM - Midnight", latitude=31.4697, longitude=74.2728, features="Drive-thru, WiFi, Indoor Dining", is_active=True),
            Store(name="Gujranwala Cantt Mall", address="Main Cantt Commercial Area, GT Road", city="Gujranwala", phone="+92 55 3824001", opening_hours="09:00 AM - Midnight", latitude=32.1877, longitude=74.1945, features="Family Seating, WiFi, Espresso Counter", is_active=True),
            Store(name="Sialkot Cantt Paris Road", address="Paris Road, Near Mall of Sialkot, Cantt", city="Sialkot", phone="+92 52 4268910", opening_hours="09:00 AM - Midnight", latitude=32.4945, longitude=74.5229, features="WiFi, Outdoor Patio, Breakfast Lounge", is_active=True),
            Store(name="Zamzama Flagship Store", address="Plot 4-C, 10th Commercial Lane, Zamzama DHA Phase 5", city="Karachi", phone="+92 21 35870091", opening_hours="07:30 AM - 01:30 AM", latitude=24.8214, longitude=67.0322, image="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80", features="WiFi, Outdoor Patio, Roastery Bar, Drive-thru", is_active=True),
            Store(name="Marine Tower Clifton", address="Ground Floor, Marine Tower, Block 2, Clifton", city="Karachi", phone="+92 21 35821100", opening_hours="08:00 AM - Midnight", latitude=24.8138, longitude=67.0274, features="Sea Breeze Seating, High-speed WiFi", is_active=True),
            Store(name="Tipu Sultan Roastery", address="Plot 15, Main Tipu Sultan Road, PECHS Block 7", city="Karachi", phone="+92 21 34558820", opening_hours="08:00 AM - 01:00 AM", latitude=24.8690, longitude=67.0820, features="Drive-thru, Full Dining Menu, WiFi", is_active=True),
            Store(name="Jinnah International Airport", address="Departure Concourse, Jinnah Terminal", city="Karachi", phone="+92 21 34570090", opening_hours="24 Hours Open (Daily)", latitude=24.9065, longitude=67.1608, features="24/7 Service, Grab & Go, Express Brew", is_active=True),
            Store(name="Faisalabad D-Ground Cafe", address="Plot 8, Commercial D-Ground, Peoples Colony No. 1", city="Faisalabad", phone="+92 41 8546611", opening_hours="08:30 AM - 01:00 AM", latitude=31.4187, longitude=73.1020, features="WiFi, Outdoor Terrace, Breakfast All Day", is_active=True)
        ]
        db.session.add_all(stores)

        print("5. Seeding Cafe Menu (Beverages & Food Sections)...")
        menu_brewed = CafeMenuCategory(name="Brewed Coffee", slug="brewed", description="Freshly ground & brewed signature origins", sort_order=1)
        menu_espresso = CafeMenuCategory(name="Espresso Classics", slug="espresso", description="Pure handcrafted espresso and textured milk creations", sort_order=2)
        menu_ice = CafeMenuCategory(name="Original Ice Blended®", slug="ice-blended", description="The legendary frosty sweet Beverly Hills drinks", sort_order=3)
        menu_tea_latte = CafeMenuCategory(name="Tea Lattes & Hot Teas", slug="tea-latte", description="Steamed whole leaf tea lattes and premium infusions", sort_order=4)
        menu_non_coffee = CafeMenuCategory(name="Non Coffee Favorites", slug="non-coffee", description="Decadent chocolate and fruit botanical blends", sort_order=5)

        menu_burger = CafeMenuCategory(name="Burgers & Steaks", slug="burger-steak", description="Artisan gourmet burgers and tender steaks", sort_order=6)
        menu_sandwich = CafeMenuCategory(name="Sandwiches & Wraps", slug="sandwich-wrap", description="Toasted paninis, club sandwiches and savory wraps", sort_order=7)
        menu_pasta_pizza = CafeMenuCategory(name="Pasta & Pizzas", slug="pasta-pizza", description="Handcrafted pasta and stone-baked thin crust pizza", sort_order=8)
        menu_breakfast = CafeMenuCategory(name="Breakfast All Day", slug="breakfast", description="Fluffy omelettes, pancakes, waffles, and morning bowls", sort_order=9)
        menu_dessert = CafeMenuCategory(name="Desserts & Pastries", slug="desserts", description="Belgian chocolate fudge cakes and baked cheesecakes", sort_order=10)

        db.session.add_all([menu_brewed, menu_espresso, menu_ice, menu_tea_latte, menu_non_coffee, menu_burger, menu_sandwich, menu_pasta_pizza, menu_breakfast, menu_dessert])
        db.session.flush()

        cafe_items = [
            # Espresso
            CafeMenuItem(category_id=menu_espresso.id, name="Americano", description="Rich espresso shots lengthened with pure hot water.", price=720.0, image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", calories="15 kcal", is_popular=False, sort_order=1),
            CafeMenuItem(category_id=menu_espresso.id, name="Café Latte", description="Rich espresso balanced with velvety steamed milk and a thin layer of microfoam.", price=895.0, image="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80", calories="190 kcal", is_popular=True, sort_order=2),
            CafeMenuItem(category_id=menu_espresso.id, name="Cappuccino", description="Bold espresso crowned with dense, luxurious foam and dusted with cocoa.", price=895.0, image="https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80", calories="160 kcal", is_popular=True, sort_order=3),
            CafeMenuItem(category_id=menu_espresso.id, name="Caramel Latte", description="Velvety steamed milk with rich espresso and buttery caramel syrup drizzle.", price=950.0, image="https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80", calories="260 kcal", is_popular=True, sort_order=4),
            CafeMenuItem(category_id=menu_espresso.id, name="Vanilla Latte", description="Madagascar vanilla extract infused with freshly extracted espresso and milk.", price=950.0, image="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80", calories="250 kcal", is_popular=False, sort_order=5),
            CafeMenuItem(category_id=menu_espresso.id, name="Mocha Latte", description="Special Dutch chocolate combined with dark roast espresso and textured milk.", price=995.0, image="https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", calories="310 kcal", is_popular=True, sort_order=6),

            # Ice Blended
            CafeMenuItem(category_id=menu_ice.id, name="The Original Mocha Ice Blended®", description="Special Dutch chocolate, coffee extract, skim milk, and crushed ice with whipped cream.", price=1150.0, image="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80", calories="420 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_ice.id, name="Vanilla Hazelnut Ice Blended®", description="Creamy French vanilla and roasted hazelnut syrup frosty blended to perfection.", price=1190.0, image="https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", calories="440 kcal", is_popular=True, sort_order=2),
            CafeMenuItem(category_id=menu_ice.id, name="Caramel Ice Blended®", description="Sweet buttery caramel blended with milk, coffee and ice, topped with whipped cream.", price=1150.0, image="https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80", calories="410 kcal", is_popular=False, sort_order=3),

            # Food
            CafeMenuItem(category_id=menu_burger.id, name="Texan BBQ Chicken Burger", description="Crispy seasoned chicken breast tossed in smoky Texan BBQ sauce with cheddar cheese & fries.", price=1350.0, image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", calories="690 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_burger.id, name="Mushroom Chicken Steak", description="Grilled chicken fillets topped with creamy wild mushroom sauce, mashed potatoes & veggies.", price=1650.0, image="https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=600&q=80", calories="720 kcal", is_popular=True, sort_order=2),
            CafeMenuItem(category_id=menu_sandwich.id, name="LA Club Sandwich", description="Triple decker toasted sandwich with roasted chicken, fried egg, cheese, lettuce & tomato.", price=1250.0, image="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80", calories="580 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_sandwich.id, name="Grilled Cheese Sandwich", description="Melted aged cheddar and mozzarella on golden butter-toasted sourdough.", price=950.0, image="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80", calories="490 kcal", is_popular=False, sort_order=2),
            CafeMenuItem(category_id=menu_breakfast.id, name="Mushroom & Cheese Omelette", description="Three egg omelette loaded with sautéed mushrooms, herbs, and cheddar, served with toast.", price=950.0, image="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80", calories="420 kcal", is_popular=True, sort_order=1),

            # Desserts
            CafeMenuItem(category_id=menu_dessert.id, name="Belgian Dark Chocolate Fudge Cake", description="Layers of rich dark chocolate sponge smothered with warm Belgian fudge ganache.", price=780.0, image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80", calories="480 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_dessert.id, name="New York Baked Cheesecake", description="Silky smooth baked cream cheese on a crunchy graham cracker crust.", price=850.0, image="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", calories="520 kcal", is_popular=True, sort_order=2)
        ]
        db.session.add_all(cafe_items)

        print("6. Seeding Banners...")
        banners = [
            Banner(title="Masterfully Roasted Coffee Beans", subtitle="The Top 1% Arabica from the World's Best High-Altitude Estates", description="Explore our hand-roasted collection: from bright floral Costa Rican origins to deeply rich Sumatra dark roasts. Freshly packed & shipped across Pakistan.", image="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=85", button_text="Shop Coffee Collection", button_url="/shop/coffee", badge_text="Direct Trade Arabica", banner_type="hero", sort_order=1, is_active=True),
            Banner(title="The World's Original Ice Blended®", subtitle="Invented by The Coffee Bean & Tea Leaf in 1987", description="Creamy espresso, rich Dutch chocolate, and vanilla blended with crushed ice and crowned with whipped cream. Visit your nearest cafe today.", image="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85", button_text="Explore Cafe Menu", button_url="/cafe-menu", badge_text="Iconic Beverly Hills Recipe", banner_type="hero", sort_order=2, is_active=True),
            Banner(title="Hand-Plucked Whole Leaf Teas", subtitle="Single-Estate Reserve Black, Green & Herbal Infusions", description="Crafted with pure top two leaves and a bud for exceptional depth, delicate sweetness, and vibrant health benefits.", image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=85", button_text="Shop Tea Blends", button_url="/shop/tea", badge_text="100% Whole Leaf", banner_type="hero", sort_order=3, is_active=True),
            Banner(title="Free Express Shipping", subtitle="Nationwide delivery on all orders over Rs. 3,500", description="Roasted fresh, securely packed, and delivered to your doorstep.", image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80", button_text="Start Shopping", button_url="/shop", badge_text="Free Shipping", banner_type="promotional", sort_order=1, is_active=True),
            Banner(title="Freshly Brewed in Our Cafes", subtitle="Find your nearest Coffee Bean store in Islamabad, Lahore, Karachi & more", description="Unwind in welcoming ambience with artisan espresso, gourmet meals, and fast WiFi.", image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", button_text="Locate a Store", button_url="/stores", badge_text="Store Locator", banner_type="promotional", sort_order=2, is_active=True)
        ]
        db.session.add_all(banners)
        db.session.commit()
        print("Base database seeded successfully!")

if __name__ == '__main__':
    seed_database()
