from app.extensions import db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.store import Store
from app.models.banner import Banner
from app.models.cafe_menu import CafeMenuCategory, CafeMenuItem
from app.models.setting import Setting
from app.routes.settings import DEFAULT_SETTINGS

def seed_data(session=None):
    if session is None:
        session = db.session

    # 1. Users
    if not User.query.filter_by(email="admin@coffeebean.com").first():
        admin = User(
            name="Store Administrator",
            email="admin@coffeebean.com",
            phone="+92 300 0000000",
            role="admin",
            is_active=True
        )
        admin.set_password("admin123")
        session.add(admin)

    if not User.query.filter_by(email="customer@coffeebean.com").first():
        customer = User(
            name="Hamza Tariq",
            email="customer@coffeebean.com",
            phone="+92 321 9876543",
            role="customer",
            is_active=True
        )
        customer.set_password("customer123")
        session.add(customer)

    # 2. Settings
    for k, v in DEFAULT_SETTINGS.items():
        if not Setting.query.filter_by(key=k).first():
            session.add(Setting(key=k, value=v, group="general"))

    # 3. Categories
    cat_coffee = Category.query.filter_by(slug="coffee").first()
    if not cat_coffee:
        cat_coffee = Category(name="Coffee", slug="coffee", description="Handcrafted whole bean coffees sourced from the world's top 1% Arabica farms.", sort_order=1)
        cat_tea = Category(name="Tea", slug="tea", description="Hand-plucked whole leaf artisan teas, herbal infusions, and signature chai blends.", sort_order=2)
        cat_merch = Category(name="Merchandise & Gear", slug="merchandise", description="French presses, tumblers, ceramic mugs, and artisan brewing accessories.", sort_order=3)
        cat_desserts = Category(name="Desserts & Bakery", slug="desserts-bakery", description="Decadent cakes and fresh bakery items.", sort_order=4)
        session.add_all([cat_coffee, cat_tea, cat_merch, cat_desserts])
        session.flush()

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
        session.add_all(coffee_subs)

        tea_subs = [
            Category(name="Black Tea", slug="black-tea", description="Robust, full-bodied black leaves from Ceylon, Assam, and Darjeeling estates.", parent_id=cat_tea.id, sort_order=1),
            Category(name="Green Tea", slug="green-tea", description="Delicately steamed Japanese Sencha, Dragonwell, and antioxidant-rich Jasmine greens.", parent_id=cat_tea.id, sort_order=2),
            Category(name="Herbal Infusions", slug="herbal-infusions", description="Naturally caffeine-free calming chamomile, peppermint, and moroccan mint.", parent_id=cat_tea.id, sort_order=3),
            Category(name="Specialty & Chai", slug="specialty-chai", description="Exotic spiced chai and signature single-estate reserve tea selections.", parent_id=cat_tea.id, sort_order=4)
        ]
        session.add_all(tea_subs)
        session.flush()
    else:
        coffee_subs = Category.query.filter(Category.parent_id == cat_coffee.id).order_by(Category.sort_order).all()
        cat_tea = Category.query.filter_by(slug="tea").first()
        tea_subs = Category.query.filter(Category.parent_id == cat_tea.id).order_by(Category.sort_order).all() if cat_tea else []
        cat_merch = Category.query.filter_by(slug="merchandise").first()
        cat_desserts = Category.query.filter_by(slug="desserts-bakery").first()

    # 4. Products
    if Product.query.count() == 0 and len(coffee_subs) >= 6 and len(tea_subs) >= 4:
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
                description="Refreshing California spearmint delicately blended with whole peppermint leaves. Naturally caffeine-free and soothing.",
                short_description="Refreshing peppermint and spearmint herbal infusion.",
                price=2950.0,
                sku="CB-TEA-003",
                stock_quantity=35,
                image="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
                category_id=tea_subs[2].id,
                roast_level="Tea",
                origin="United States",
                tags="Herbal Tea, Peppermint, Caffeine Free, Calming",
                is_active=True,
                is_featured=False,
                is_best_seller=False
            ),
            Product(
                name="Chai Whole Leaf Spiced Blend (Tin)",
                slug="chai-whole-leaf-spiced-blend-tin",
                description="Full-bodied black tea infused with fragrant cardamom, cloves, cinnamon bark, and ginger. Brew traditional or enjoy with warm milk.",
                short_description="Spiced black tea with cardamom, cinnamon, clove and ginger.",
                price=3150.0,
                sku="CB-TEA-004",
                stock_quantity=30,
                image="https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80",
                category_id=tea_subs[3].id,
                roast_level="Tea",
                origin="Assam, India",
                tags="Chai, Spiced Tea, Black Tea, Warm",
                is_active=True,
                is_featured=False,
                is_best_seller=True
            ),
            Product(
                name="French Press Coffee Maker 8-Cup (1L)",
                slug="french-press-coffee-maker-8-cup",
                description="Borosilicate heat-resistant glass carafe with high-grade stainless steel plunger and micro-mesh filter for rich, sediment-free brewing.",
                short_description="Heat-resistant borosilicate glass with stainless steel filter.",
                price=4800.0,
                sku="CB-GEAR-001",
                stock_quantity=15,
                image="https://images.unsplash.com/photo-1574914629385-46448b767aec?auto=format&fit=crop&w=800&q=80",
                category_id=cat_merch.id if cat_merch else coffee_subs[0].id,
                roast_level="Gear",
                origin="Artisan Brewing Hardware",
                tags="French Press, Brewing, Merch, Gear, Glass",
                is_active=True,
                is_featured=True,
                is_best_seller=False
            ),
            Product(
                name="Signature Ceramic Heritage Mug (14oz)",
                slug="signature-ceramic-heritage-mug-14oz",
                description="Heavyweight matte ceramic mug with debossed The Coffee Bean & Tea Leaf heritage logo and ergonomic comfortable handle.",
                short_description="Heavyweight matte ceramic with debossed heritage logo.",
                price=1950.0,
                sku="CB-GEAR-002",
                stock_quantity=40,
                image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                category_id=cat_merch.id if cat_merch else coffee_subs[0].id,
                roast_level="Gear",
                origin="Drinkware",
                tags="Mug, Ceramic, Merch, Collectible",
                is_active=True,
                is_featured=False,
                is_best_seller=True
            ),
            Product(
                name="Double Chocolate Fudge Cake (Full Cake)",
                slug="double-chocolate-fudge-cake-full",
                description="Layers of decadent, moist chocolate fudge sponge draped in Belgian dark ganache. Perfect for celebrations and family gatherings.",
                short_description="Decadent moist chocolate fudge sponge draped in Belgian ganache.",
                price=4200.0,
                sku="CB-CAKE-001",
                stock_quantity=10,
                image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
                category_id=cat_desserts.id if cat_desserts else coffee_subs[0].id,
                roast_level="Bakery",
                origin="Fresh Cafe Bakery",
                tags="Bakery, Chocolate Cake, Dessert, Fresh",
                is_active=True,
                is_featured=True,
                is_best_seller=True
            )
        ]
        session.add_all(products)

    # 5. Stores
    if Store.query.count() == 0:
        stores = [
            Store(name="Beverly Centre, F-6", city="Islamabad", address="Shop 4-5, Ground Floor, Beverly Centre, Blue Area, F-6", phone="+92 51 2814101", email="beverly@coffeebean.pk", opening_hours="07:30 AM - 01:00 AM", latitude=33.7225, longitude=73.0673, features="Dine-in, Takeaway, Delivery, WiFi", is_active=True),
            Store(name="F-11 Markaz", city="Islamabad", address="Plot 12-C, Ground & Mezzanine Floor, F-11 Markaz", phone="+92 51 2102044", email="f11@coffeebean.pk", opening_hours="08:00 AM - 01:00 AM", latitude=33.6844, longitude=72.9886, features="Dine-in, Takeaway, Delivery, WiFi", is_active=True),
            Store(name="Gulberg III (Main Boulevard)", city="Lahore", address="Plot 14-A, Main Boulevard Gulberg III (Near Xinhua Mall)", phone="+92 42 35778891", email="gulberg@coffeebean.pk", opening_hours="07:30 AM - 02:00 AM", latitude=31.5126, longitude=74.3484, features="Dine-in, Takeaway, Delivery, WiFi", is_active=True),
            Store(name="DHA Phase 5 (Penta Square)", city="Lahore", address="Ground Floor, Penta Square Mall, CCA DHA Phase 5", phone="+92 42 37189912", email="dha5@coffeebean.pk", opening_hours="08:00 AM - 02:00 AM", latitude=31.4682, longitude=74.3983, features="Dine-in, Takeaway, Delivery, WiFi", is_active=True),
            Store(name="Bukhari Commercial (DHA Phase 6)", city="Karachi", address="Plot 32-C, Main Bukhari Commercial, DHA Phase 6", phone="+92 21 35248810", email="bukhari@coffeebean.pk", opening_hours="08:00 AM - 02:00 AM", latitude=24.7938, longitude=67.0673, features="Dine-in, Takeaway, Delivery, WiFi", is_active=True),
            Store(name="Tipu Sultan Road", city="Karachi", address="Plot 18, Block B, SMCHS (Tipu Sultan Food Street)", phone="+92 21 34552219", email="tipusultan@coffeebean.pk", opening_hours="08:00 AM - 02:00 AM", latitude=24.8716, longitude=67.0784, features="Dine-in, Takeaway, Delivery, WiFi", is_active=True)
        ]
        session.add_all(stores)

    # 6. Cafe Menu
    if CafeMenuCategory.query.count() == 0:
        menu_espresso = CafeMenuCategory(name="Espresso & Classic Coffee", slug="espresso-classic", description="Handcrafted artisan espresso, lattes, and cappuccinos", sort_order=1)
        menu_ice = CafeMenuCategory(name="The Original Ice Blended®", slug="ice-blended", description="Iconic frosted coffee and tea blended creations", sort_order=2)
        menu_burger = CafeMenuCategory(name="Gourmet Burgers & Steaks", slug="burgers-steaks", description="Chef-crafted juicy burgers, grilled chicken and steaks", sort_order=3)
        menu_sandwich = CafeMenuCategory(name="Artisan Sandwiches", slug="sandwiches", description="Freshly toasted multi-deck sandwiches and sourdough paninis", sort_order=4)
        menu_dessert = CafeMenuCategory(name="Decadent Cakes & Bakery", slug="cakes-bakery", description="Freshly baked artisan cakes, cheesecakes and pastries", sort_order=5)
        session.add_all([menu_espresso, menu_ice, menu_burger, menu_sandwich, menu_dessert])
        session.flush()

        cafe_items = [
            CafeMenuItem(category_id=menu_espresso.id, name="Artisan Caffè Americano", description="Rich espresso shots topped with hot water create a light layer of crema and deep aromatic roast notes.", price=695.0, image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", calories="15 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_espresso.id, name="Café Latte", description="Rich espresso balanced with velvety steamed milk and a thin layer of microfoam.", price=895.0, image="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80", calories="190 kcal", is_popular=True, sort_order=2),
            CafeMenuItem(category_id=menu_espresso.id, name="Cappuccino", description="Bold espresso crowned with dense, luxurious foam and dusted with cocoa.", price=895.0, image="https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80", calories="160 kcal", is_popular=True, sort_order=3),
            CafeMenuItem(category_id=menu_ice.id, name="The Original Mocha Ice Blended®", description="Special Dutch chocolate, coffee extract, skim milk, and crushed ice with whipped cream.", price=1150.0, image="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80", calories="420 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_ice.id, name="Caramel Ice Blended®", description="Sweet buttery caramel blended with milk, coffee and ice, topped with whipped cream.", price=1150.0, image="https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80", calories="410 kcal", is_popular=False, sort_order=2),
            CafeMenuItem(category_id=menu_burger.id, name="Texan BBQ Chicken Burger", description="Crispy seasoned chicken breast tossed in smoky Texan BBQ sauce with cheddar cheese & fries.", price=1350.0, image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", calories="690 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_sandwich.id, name="LA Club Sandwich", description="Triple decker toasted sandwich with roasted chicken, fried egg, cheese, lettuce & tomato.", price=1250.0, image="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80", calories="580 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_dessert.id, name="Belgian Dark Chocolate Fudge Cake", description="Layers of rich dark chocolate sponge smothered with warm Belgian fudge ganache.", price=780.0, image="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80", calories="480 kcal", is_popular=True, sort_order=1),
            CafeMenuItem(category_id=menu_dessert.id, name="New York Baked Cheesecake", description="Silky smooth baked cream cheese on a crunchy graham cracker crust.", price=850.0, image="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", calories="520 kcal", is_popular=True, sort_order=2)
        ]
        session.add_all(cafe_items)

    # 7. Banners
    if Banner.query.count() == 0:
        banners = [
            Banner(title="Masterfully Roasted Coffee Beans", subtitle="The Top 1% Arabica from the World's Best High-Altitude Estates", description="Explore our hand-roasted collection: from bright floral Costa Rican origins to deeply rich Sumatra dark roasts. Freshly packed & shipped across Pakistan.", image="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=85", button_text="Shop Coffee Collection", button_url="/shop/coffee", badge_text="Direct Trade Arabica", banner_type="hero", sort_order=1, is_active=True),
            Banner(title="The World's Original Ice Blended®", subtitle="Invented by The Coffee Bean & Tea Leaf in 1987", description="Creamy espresso, rich Dutch chocolate, and vanilla blended with crushed ice and crowned with whipped cream. Visit your nearest cafe today.", image="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85", button_text="Explore Cafe Menu", button_url="/cafe-menu", badge_text="Iconic Beverly Hills Recipe", banner_type="hero", sort_order=2, is_active=True),
            Banner(title="Hand-Plucked Whole Leaf Teas", subtitle="Single-Estate Reserve Black, Green & Herbal Infusions", description="Crafted with pure top two leaves and a bud for exceptional depth, delicate sweetness, and vibrant health benefits.", image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=85", button_text="Shop Tea Blends", button_url="/shop/tea", badge_text="100% Whole Leaf", banner_type="hero", sort_order=3, is_active=True),
            Banner(title="Free Express Shipping", subtitle="Nationwide delivery on all orders over Rs. 3,500", description="Roasted fresh, securely packed, and delivered to your doorstep.", image="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80", button_text="Start Shopping", button_url="/shop", badge_text="Free Shipping", banner_type="promotional", sort_order=1, is_active=True),
            Banner(title="Freshly Brewed in Our Cafes", subtitle="Find your nearest Coffee Bean store in Islamabad, Lahore, Karachi & more", description="Unwind in welcoming ambience with artisan espresso, gourmet meals, and fast WiFi.", image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", button_text="Locate a Store", button_url="/stores", badge_text="Store Locator", banner_type="promotional", sort_order=2, is_active=True)
        ]
        session.add_all(banners)

    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
