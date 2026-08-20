import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product

TEA_CATEGORIES = [
    {"name": "Limited Edition Teas", "slug": "limited-edition", "sort_order": 1},
    {"name": "Tea Master's Collection", "slug": "tea-masters-collection", "sort_order": 2},
    {"name": "Green", "slug": "green", "sort_order": 3},
    {"name": "Oolong", "slug": "oolong", "sort_order": 4},
    {"name": "Flavoured Tea", "slug": "flavoured-tea", "sort_order": 5},
    {"name": "Herbal & Fruits", "slug": "herbal-fruits", "sort_order": 6},
    {"name": "Black", "slug": "black", "sort_order": 7},
]

TEA_PRODUCTS = [
    {
        "name": "Sook Pu-Erh Cha",
        "slug": "sook-pu-erh-cha",
        "category_slug": "tea-masters-collection",
        "image": "/products/tea/sook-puerh-cha.jpg",
        "source_url": "https://www.coffeebean.pk/product/sook-pu-erh-cha/",
        "tea_type": "Pu-Erh Tea",
        "flavor_profile": "Earthy, robust with deep woody undertones and smooth lingering finish.",
        "description": "An authentic aged vintage Chinese Pu-Erh tea crafted by master artisans.",
        "caffeine": "Medium",
        "origin": "Yunnan, China",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Sencha Green",
        "slug": "sencha-green",
        "category_slug": "tea-masters-collection",
        "image": "/products/tea/sencha-green.jpg",
        "source_url": "https://www.coffeebean.pk/product/sencha-green/",
        "tea_type": "Green Tea",
        "flavor_profile": "Delicate, sweet vegetal aroma with pleasant grassy freshness.",
        "description": "Steamed Japanese green tea cultivated with artisan care for optimal antioxidant richness.",
        "caffeine": "Low to Medium",
        "origin": "Shizuoka, Japan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Tung Ting Oolong",
        "slug": "tung-ting-oolong",
        "category_slug": "oolong",
        "image": "/products/tea/tung-ting-oolong.jpg",
        "source_url": "https://www.coffeebean.pk/product/tung-ting-oolong/",
        "tea_type": "Oolong Tea",
        "flavor_profile": "Nutty, toasted floral notes with honeyed sweetness and rich mouthfeel.",
        "description": "Celebrated high-mountain medium-oxidized Oolong known as 'Frozen Peak'.",
        "caffeine": "Medium",
        "origin": "Nantou, Taiwan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Osmanthus Oolong",
        "slug": "osmanthus-oolong",
        "category_slug": "oolong",
        "image": "/products/tea/osmanthus-oolong.jpg",
        "source_url": "https://www.coffeebean.pk/product/osmanthus-oolong/",
        "tea_type": "Oolong Tea",
        "flavor_profile": "Sweet apricot and peach floral bouquet layered over toasted oolong leaves.",
        "description": "Hand-scented oolong infused naturally with fresh osmanthus blossoms.",
        "caffeine": "Medium",
        "origin": "Taiwan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Dong Ding Oolong Tea",
        "slug": "dong-ding-oolong-tea",
        "category_slug": "oolong",
        "image": "/products/tea/dong-ding-oolong-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/dong-ding-oolong-tea/",
        "tea_type": "Oolong Tea",
        "flavor_profile": "Warm baked aroma, roasted grain with lingering floral sweetness.",
        "description": "Traditional roasted oolong from Taiwan's famed Dong Ding mountain region.",
        "caffeine": "Medium",
        "origin": "Lugu, Taiwan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Organic Green Gunpowder",
        "slug": "organic-green-gunpowder",
        "category_slug": "limited-edition",
        "image": "/products/tea/organic-green-gunpowder.jpg",
        "source_url": "https://www.coffeebean.pk/product/organic-green-gunpowder/",
        "tea_type": "Organic Green Tea",
        "flavor_profile": "Bold, slightly smoky, crisp with invigorating herbal finish.",
        "description": "Certified organic green tea leaves rolled tightly into gleaming pinhead pellets.",
        "caffeine": "Medium",
        "origin": "Zhejiang, China",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Gold Tip Assam",
        "slug": "gold-tip-assam",
        "category_slug": "limited-edition",
        "image": "/products/tea/gold-tip-assam.jpg",
        "source_url": "https://www.coffeebean.pk/product/gold-tip-assam/",
        "tea_type": "Single Estate Black Tea",
        "flavor_profile": "Rich, malty body with hints of dark cocoa and golden raisin.",
        "description": "Exquisite whole-leaf harvest showcasing prized golden tips from the Assam valley.",
        "caffeine": "High",
        "origin": "Assam, India",
        "pack_size": "Tin / Box",
    },
    {
        "name": "20th Anniversary Tea",
        "slug": "20th-anniversary-tea",
        "category_slug": "limited-edition",
        "image": "/products/tea/20th-anniversary-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/20th-anniversary-tea/",
        "tea_type": "Special Reserve Blend",
        "flavor_profile": "Complex celebratory blend with sparkling citrus and rare floral aromatics.",
        "description": "Signature master-blended limited edition celebrating The Coffee Bean & Tea Leaf craftsmanship.",
        "caffeine": "Medium",
        "origin": "Proprietary Estate Blend",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Pouchong Oolong",
        "slug": "pouchong-oolong",
        "category_slug": "limited-edition",
        "image": "/products/tea/pouchong-oolong.jpg",
        "source_url": "https://www.coffeebean.pk/product/pouchong-oolong/",
        "tea_type": "Light Oolong",
        "flavor_profile": "Ethereal white flower fragrance, soft melon sweetness and buttery texture.",
        "description": "Lightly oxidized premium specialty oolong bridging the elegance of green tea with oolong richness.",
        "caffeine": "Low to Medium",
        "origin": "Pinglin, Taiwan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Jungsun Korean",
        "slug": "jungsun-korean",
        "category_slug": "limited-edition",
        "image": "/products/tea/jungsun-korean.jpg",
        "source_url": "https://www.coffeebean.pk/product/jungsun-korean/",
        "tea_type": "Specialty Green Tea",
        "flavor_profile": "Savory, nutty notes with subtle sea breeze freshness.",
        "description": "Rare single-origin Korean green tea pan-fired according to age-old traditions.",
        "caffeine": "Medium",
        "origin": "Jeju Island / Jungsun, South Korea",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Swedish Berries",
        "slug": "swedish-berries",
        "category_slug": "herbal-fruits",
        "image": "/products/tea/swedish-berries.jpg",
        "source_url": "https://www.coffeebean.pk/product/swedish-berries/",
        "tea_type": "Fruit Infusion / Tisane",
        "flavor_profile": "Tart-sweet wild blackberries, hibiscus, raspberries and elderberries.",
        "description": "Naturally caffeine-free lush fruit blend bursting with ruby-red berry goodness.",
        "caffeine": "Caffeine-Free",
        "origin": "Europe",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Lemon Chamomile Tea",
        "slug": "lemon-chamomile-tea",
        "category_slug": "herbal-fruits",
        "image": "/products/tea/lemon-chamomile-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/lemon-chamomile-tea/",
        "tea_type": "Herbal Infusion",
        "flavor_profile": "Calming sweet apple-like chamomile accented with uplifting lemon peel.",
        "description": "Soothing whole chamomile blossoms married with zesty lemongrass and citrus peel.",
        "caffeine": "Caffeine-Free",
        "origin": "Nile River Delta, Egypt",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Green Rooibos",
        "slug": "green-rooibos",
        "category_slug": "herbal-fruits",
        "image": "/products/tea/green-rooibos.jpg",
        "source_url": "https://www.coffeebean.pk/product/green-rooibos/",
        "tea_type": "Herbal Tisane",
        "flavor_profile": "Light, herbal-sweet with mild woody honey notes and zero astringency.",
        "description": "Unfermented green rooibos from South Africa packed with pure minerals and natural wellness.",
        "caffeine": "Caffeine-Free",
        "origin": "Cederberg, South Africa",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Ginseng Peppermint Tea",
        "slug": "ginseng-peppermint-tea",
        "category_slug": "herbal-fruits",
        "image": "/products/tea/ginseng-peppermint-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/ginseng-peppermint-tea/",
        "tea_type": "Herbal Infusion",
        "flavor_profile": "Crisp refreshing peppermint sharpness grounded by earthy adaptogenic ginseng root.",
        "description": "Energizing cooling blend combining Washington peppermint with restorative Siberian ginseng.",
        "caffeine": "Caffeine-Free",
        "origin": "USA & East Asia",
        "pack_size": "Tin / Box",
    },
    {
        "name": "African Sunrise",
        "slug": "african-sunrise",
        "category_slug": "herbal-fruits",
        "image": "/products/tea/african-sunrise.jpg",
        "source_url": "https://www.coffeebean.pk/product/african-sunrise/",
        "tea_type": "Flavored Herbal Blend",
        "flavor_profile": "Sweet aromatic honeybush & rooibos layered with sun-drenched orange and vanilla.",
        "description": "Warm, comforting blend of South African rooibos and sweet citrus blossoms.",
        "caffeine": "Caffeine-Free",
        "origin": "South Africa",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Lung Ching Dragonwell Tea",
        "slug": "lung-ching-dragonwell-tea",
        "category_slug": "green",
        "image": "/products/tea/lung-ching-dragonwell-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/lung-ching-dragonwell-tea/",
        "tea_type": "Pan-Fired Green Tea",
        "flavor_profile": "Toasted chestnut, sweet jade broth, smooth buttery body.",
        "description": "Famous imperial sword-shaped green tea pan-roasted by hand in traditional woks.",
        "caffeine": "Medium",
        "origin": "Hangzhou, China",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Jasmine Dragon Phoenix Pearl Tea",
        "slug": "jasmine-dragon-phoenix-pearl-tea",
        "category_slug": "green",
        "image": "/products/tea/jasmine-dragon-phoenix-pearl-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/jasmine-dragon-phoenix-pearl-tea/",
        "tea_type": "Scented Green Tea Pearls",
        "flavor_profile": "Intensely fragrant night-blooming jasmine with sweet velvety green liquor.",
        "description": "Hand-rolled silver needle tea buds repeatedly infused with fragrant midnight jasmine flowers.",
        "caffeine": "Medium",
        "origin": "Fujian, China",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Houjicha Tea",
        "slug": "houjicha-tea",
        "category_slug": "green",
        "image": "/products/tea/houjicha-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/houjicha-tea/",
        "tea_type": "Roasted Green Tea",
        "flavor_profile": "Toasty, caramel warmth, nutty aroma with soothing low astringency.",
        "description": "Japanese green tea gently roasted in porcelain pots over charcoal fires.",
        "caffeine": "Very Low",
        "origin": "Kyoto, Japan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Genmaicha Green Tea",
        "slug": "genmaicha-green-tea",
        "category_slug": "green",
        "image": "/products/tea/genmaicha-green-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/genmaicha-green-tea/",
        "tea_type": "Blended Green Tea",
        "flavor_profile": "Nutty roasted brown rice combined with fresh grassy bancha green tea.",
        "description": "Classic Japanese folk tea featuring roasted popped rice blended with select green tea leaves.",
        "caffeine": "Low to Medium",
        "origin": "Japan",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Vanilla Ceylon",
        "slug": "vanilla-ceylon",
        "category_slug": "flavoured-tea",
        "image": "/products/tea/vanilla-ceylon.jpg",
        "source_url": "https://www.coffeebean.pk/product/vanilla-ceylon/",
        "tea_type": "Flavored Black Tea",
        "flavor_profile": "Rich creamy Bourbon vanilla paired with bright, brisk Ceylon black tea.",
        "description": "High-grown Sri Lankan black tea delicately scented with pure natural vanilla beans.",
        "caffeine": "High",
        "origin": "Sri Lanka",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Earl Grey Tea",
        "slug": "earl-grey-tea",
        "category_slug": "flavoured-tea",
        "image": "/products/tea/earl-grey-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/earl-grey-tea/",
        "tea_type": "Flavored Black Tea",
        "flavor_profile": "Aromatic bergamot citrus notes with smooth full-bodied black tea foundation.",
        "description": "Premium whole-leaf black tea infused with natural oil of Italian bergamot.",
        "caffeine": "High",
        "origin": "Sri Lanka & Italy",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Noori Tea Garden",
        "slug": "noori-tea-garden",
        "category_slug": "black",
        "image": "/products/tea/noori-tea-garden.jpg",
        "source_url": "https://www.coffeebean.pk/product/noori-tea-garden/",
        "tea_type": "Single Origin Black Tea",
        "flavor_profile": "Robust, spicy-sweet with balanced tannins and bright copper color.",
        "description": "Specialty harvest sourced directly from pristine high-altitude tea gardens.",
        "caffeine": "High",
        "origin": "Single Garden Reserve",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Estate Darjeeling Tea",
        "slug": "estate-darjeeling-tea",
        "category_slug": "black",
        "image": "/products/tea/estate-darjeeling-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/estate-darjeeling-tea/",
        "tea_type": "Himalayan Black Tea",
        "flavor_profile": "Distinctive muscatel grape character with subtle floral top notes.",
        "description": "The 'Champagne of Teas' harvested from mist-shrouded Himalayan foothills.",
        "caffeine": "Medium to High",
        "origin": "Darjeeling, India",
        "pack_size": "Tin / Box",
    },
    {
        "name": "English Breakfast Tea",
        "slug": "english-breakfast-tea",
        "category_slug": "black",
        "image": "/products/tea/english-breakfast-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/english-breakfast-tea/",
        "tea_type": "Traditional Black Tea Blend",
        "flavor_profile": "Deep, robust, malty with brisk finish; pairs perfectly with milk.",
        "description": "Our timeless breakfast classic blending full-bodied Assam and brisk Ceylon teas.",
        "caffeine": "High",
        "origin": "India & Sri Lanka",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Chai Tea",
        "slug": "chai-tea",
        "category_slug": "black",
        "image": "/products/tea/chai-tea.jpg",
        "source_url": "https://www.coffeebean.pk/product/chai-tea/",
        "tea_type": "Spiced Black Tea",
        "flavor_profile": "Warming cinnamon, aromatic cardamom, spicy ginger, clove and black pepper.",
        "description": "Authentic spiced black tea blend crafted with traditional aromatic spices.",
        "caffeine": "High",
        "origin": "India",
        "pack_size": "Tin / Box",
    },
    {
        "name": "Black Dragon Pearl",
        "slug": "black-dragon-pearl",
        "category_slug": "black",
        "image": "/products/tea/black-dragon-pearl.jpg",
        "source_url": "https://www.coffeebean.pk/product/black-dragon-pearl/",
        "tea_type": "Artisan Black Tea Pearls",
        "flavor_profile": "Smooth dark chocolate notes, molasses sweetness with zero bitterness.",
        "description": "Rare, hand-rolled pearls of tender Yunnan black tea buds and leaves.",
        "caffeine": "High",
        "origin": "Yunnan, China",
        "pack_size": "Tin / Box",
    },
]

CAKE_PRODUCTS = [
    {
        "name": "Lotus cheesecake",
        "slug": "lotus-cheesecake",
        "image": "/products/cakes/lotus-cheesecake.jpg",
        "source_url": "https://www.coffeebean.pk/product/lotus-cheesecake/",
        "cake_type": "Cheesecake",
        "flavor": "Biscoff Lotus Caramelized Cookie",
        "description": "Rich and creamy artisanal cheesecake infused with spiced Lotus Biscoff spread and layered on a crunchy caramelized biscuit crust.",
        "serving_size": "Whole Cake / 8-10 Slices",
    },
    {
        "name": "Belgian Chocolate Cake",
        "slug": "belgian-chocolate-cake",
        "image": "/products/cakes/belgian-chocolate-cake.jpg",
        "source_url": "https://www.coffeebean.pk/product/belgian-chocolate-cake/",
        "cake_type": "Layered Chocolate Cake",
        "flavor": "Dark Belgian Chocolate Ganache",
        "description": "Decadent multi-layered moist sponge enveloped in rich velvety Belgian dark chocolate frosting.",
        "serving_size": "Whole Cake / 8-10 Slices",
    },
    {
        "name": "LA Cheesecake",
        "slug": "la-cheesecake",
        "image": "/products/cakes/la-cheesecake.jpg",
        "source_url": "https://www.coffeebean.pk/product/la-cheesecake/",
        "cake_type": "Baked Cheesecake",
        "flavor": "Classic California Cream Cheese & Vanilla",
        "description": "Classic California style baked cheesecake with a silky smooth cream cheese center and buttery golden graham crust.",
        "serving_size": "Whole Cake / 8-10 Slices",
    },
    {
        "name": "Red Velvet Cake",
        "slug": "red-velvet-cake",
        "image": "/products/cakes/red-velvet-cake.jpg",
        "source_url": "https://www.coffeebean.pk/product/red-velvet-cake/",
        "cake_type": "Red Velvet Sponge",
        "flavor": "Cocoa Vanilla with Cream Cheese Frosting",
        "description": "Traditional Southern style crimson cocoa sponge layered with rich whipped cream cheese frosting.",
        "serving_size": "Whole Cake / 8-10 Slices",
    },
    {
        "name": "Homestyle Carrot Cake",
        "slug": "homestyle-carrot-cake",
        "image": "/products/cakes/homestyle-carrot-cake.jpg",
        "source_url": "https://www.coffeebean.pk/product/homestyle-carrot-cake/",
        "cake_type": "Spiced Sponge Cake",
        "flavor": "Carrot, Cinnamon, Walnut & Cream Cheese",
        "description": "Moist spiced carrot cake packed with freshly grated carrots, warm cinnamon, toasted walnuts, and topped with smooth cream cheese glaze.",
        "serving_size": "Whole Cake / 8-10 Slices",
    },
    {
        "name": "Oreo Tiramisu",
        "slug": "oreo-tiramisu",
        "image": "/products/cakes/oreo-tiramisu.jpg",
        "source_url": "https://www.coffeebean.pk/product/oreo-tiramisu/",
        "cake_type": "Tiramisu Cake",
        "flavor": "Espresso-Soaked Oreo & Mascarpone",
        "description": "Modern twist on Italian tiramisu blending espresso-infused Oreo biscuits with delicate mascarpone mousse and cocoa dust.",
        "serving_size": "Whole Cake / 8-10 Slices",
    },
]

def seed_catalogs():
    app = create_app()
    with app.app_context():
        print("=== 1. Seeding Tea Categories ===")
        # Parent Tea Category
        parent_tea = Category.query.filter_by(slug="tea").first()
        if not parent_tea:
            parent_tea = Category(name="Tea", slug="tea", product_type="tea", sort_order=2)
            db.session.add(parent_tea)
            db.session.flush()
        else:
            parent_tea.product_type = "tea"

        cat_map = {}
        for c_data in TEA_CATEGORIES:
            cat = Category.query.filter_by(slug=c_data["slug"]).first()
            if not cat:
                cat = Category(
                    name=c_data["name"],
                    slug=c_data["slug"],
                    product_type="tea",
                    parent_id=parent_tea.id,
                    sort_order=c_data["sort_order"],
                )
                db.session.add(cat)
                db.session.flush()
            else:
                cat.product_type = "tea"
                cat.parent_id = parent_tea.id
            cat_map[c_data["slug"]] = cat.id

        print("=== 2. Seeding 26 Tea Products ===")
        for p in TEA_PRODUCTS:
            prod = Product.query.filter_by(slug=p["slug"]).first()
            if not prod:
                prod = Product(
                    name=p["name"],
                    slug=p["slug"],
                    product_type="tea",
                    category_id=cat_map.get(p["category_slug"]),
                    image=p["image"],
                    thumbnail=p["image"],
                    source_url=p["source_url"],
                    tea_type=p.get("tea_type"),
                    flavor_profile=p.get("flavor_profile"),
                    description=p.get("description"),
                    short_description=p.get("flavor_profile"),
                    caffeine=p.get("caffeine"),
                    origin=p.get("origin"),
                    pack_size=p.get("pack_size"),
                    currency="PKR",
                    price=None,  # Not provided by source
                    stock_quantity=25,
                    availability="In Stock",
                    is_active=True,
                    is_featured=False,
                )
                db.session.add(prod)
                print(f"[SEEDED TEA] {p['name']} ({p['category_slug']})")
            else:
                prod.product_type = "tea"
                prod.category_id = cat_map.get(p["category_slug"])
                prod.image = p["image"]
                prod.thumbnail = p["image"]
                prod.tea_type = p.get("tea_type")
                prod.flavor_profile = p.get("flavor_profile")
                prod.description = p.get("description")
                prod.caffeine = p.get("caffeine")
                prod.origin = p.get("origin")
                prod.pack_size = p.get("pack_size")
                print(f"[UPDATED TEA] {p['name']}")

        print("=== 3. Seeding Cake To Go Category & Subcategory ===")
        # Parent Cake To Go Category
        parent_cake = Category.query.filter_by(slug="cake-to-go").first()
        if not parent_cake:
            parent_cake = Category(name="Cake To Go", slug="cake-to-go", product_type="cake", sort_order=3)
            db.session.add(parent_cake)
            db.session.flush()
        else:
            parent_cake.product_type = "cake"

        sub_cake = Category.query.filter_by(slug="signature-classics").first()
        if not sub_cake:
            sub_cake = Category(
                name="Signature classics",
                slug="signature-classics",
                product_type="cake",
                parent_id=parent_cake.id,
                sort_order=1,
            )
            db.session.add(sub_cake)
            db.session.flush()
        else:
            sub_cake.product_type = "cake"
            sub_cake.parent_id = parent_cake.id

        print("=== 4. Seeding 6 Cake To Go Products ===")
        for cp in CAKE_PRODUCTS:
            prod = Product.query.filter_by(slug=cp["slug"]).first()
            if not prod:
                prod = Product(
                    name=cp["name"],
                    slug=cp["slug"],
                    product_type="cake",
                    category_id=parent_cake.id,
                    subcategory_id=sub_cake.id,
                    image=cp["image"],
                    thumbnail=cp["image"],
                    source_url=cp["source_url"],
                    cake_type=cp.get("cake_type"),
                    flavor=cp.get("flavor"),
                    description=cp.get("description"),
                    short_description=cp.get("description"),
                    serving_size=cp.get("serving_size"),
                    currency="PKR",
                    price=None,  # Source does not display fixed checkout price
                    stock_quantity=15,
                    availability="In Stock",
                    is_active=True,
                    is_featured=True,
                )
                db.session.add(prod)
                print(f"[SEEDED CAKE] {cp['name']}")
            else:
                prod.product_type = "cake"
                prod.category_id = parent_cake.id
                prod.subcategory_id = sub_cake.id
                prod.image = cp["image"]
                prod.thumbnail = cp["image"]
                prod.cake_type = cp.get("cake_type")
                prod.flavor = cp.get("flavor")
                prod.description = cp.get("description")
                prod.serving_size = cp.get("serving_size")
                print(f"[UPDATED CAKE] {cp['name']}")

        db.session.commit()
        print("\nAll Tea and Cake catalogs successfully seeded in database!")

if __name__ == "__main__":
    seed_catalogs()
