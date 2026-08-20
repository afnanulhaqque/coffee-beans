import os
import re
import json
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

# Define products list extracted from https://www.coffeebean.pk/coffee
PRODUCTS_DATA = [
    {
        "name": "Colombia Antioquia (8oz)",
        "slug": "colombia-antioquia",
        "pack_size": "8oz",
        "category_name": "Rich & Smooth",
        "category_slug": "rich-smooth",
        "source_url": "https://www.coffeebean.pk/product/colombia-antioquia-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Colombia-Antioquia-8oz-550x550.jpg",
        "local_image": "/products/coffee/colombia-antioquia.jpg",
        "roast_level": "Medium Roast",
        "origin": "Antioquia, Colombia",
    },
    {
        "name": "100% Kona Coffee (8oz)",
        "slug": "kona-coffee",
        "pack_size": "8oz",
        "category_name": "Reserved",
        "category_slug": "reserved",
        "source_url": "https://www.coffeebean.pk/product/100-kona-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/100-Kona-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/kona-coffee.jpg",
        "roast_level": "Medium Roast",
        "origin": "Kona Coast, Hawaii",
    },
    {
        "name": "Papua New Guinea Sigri Coffee (8oz)",
        "slug": "papua-new-guinea-sigri",
        "pack_size": "8oz",
        "category_name": "Medium & Smooth",
        "category_slug": "medium-smooth",
        "source_url": "https://www.coffeebean.pk/product/papua-new-guinea-sigri-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Papua-New-Guinea-Sigri-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/papua-new-guinea-sigri.jpg",
        "roast_level": "Medium Roast",
        "origin": "Sigri Estate, Papua New Guinea",
    },
    {
        "name": "Mocha Java Coffee (8oz)",
        "slug": "mocha-java",
        "pack_size": "8oz",
        "category_name": "Medium & Smooth",
        "category_slug": "medium-smooth",
        "source_url": "https://www.coffeebean.pk/product/mocha-java-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Mocha-Java-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/mocha-java.jpg",
        "roast_level": "Medium Roast",
        "origin": "Java & Arabian Yemen Blend",
    },
    {
        "name": "Kenya AA Coffee (8oz)",
        "slug": "kenya-aa",
        "pack_size": "8oz",
        "category_name": "Medium & Smooth",
        "category_slug": "medium-smooth",
        "source_url": "https://www.coffeebean.pk/product/kenya-aa-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Kenya-AA-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/kenya-aa.jpg",
        "roast_level": "Medium Roast",
        "origin": "High-altitude slopes of Mt. Kenya",
    },
    {
        "name": "Costa Rica La Cascada Tarrazu Coffee (8oz)",
        "slug": "costa-rica-la-cascada-tarrazu",
        "pack_size": "8oz",
        "category_name": "Medium & Smooth",
        "category_slug": "medium-smooth",
        "source_url": "https://www.coffeebean.pk/product/costa-rica-la-cascada-tarrazu-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Costa-Rica-La-Cascada-Tarrazu-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/costa-rica-la-cascada-tarrazu.jpg",
        "roast_level": "Medium Roast",
        "origin": "Tarrazu Valley, Costa Rica",
    },
    {
        "name": "Colombia Narino Coffee (8oz)",
        "slug": "colombia-narino",
        "pack_size": "8oz",
        "category_name": "Medium & Smooth",
        "category_slug": "medium-smooth",
        "source_url": "https://www.coffeebean.pk/product/colombia-narino-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Colombia-Narino-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/colombia-narino.jpg",
        "roast_level": "Medium Roast",
        "origin": "Nariño Highlands, Colombia",
    },
    {
        "name": "House Blend Coffee (8oz)",
        "slug": "house-blend",
        "pack_size": "8oz",
        "category_name": "Light & Subtle",
        "category_slug": "light-subtle",
        "source_url": "https://www.coffeebean.pk/product/house-blend-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/House-Blend-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/house-blend.jpg",
        "roast_level": "Light Roast",
        "origin": "Signature Latin American Blend",
    },
    {
        "name": "Brazil Cerrado Coffee (8oz)",
        "slug": "brazil-cerrado",
        "pack_size": "8oz",
        "category_name": "Light & Subtle",
        "category_slug": "light-subtle",
        "source_url": "https://www.coffeebean.pk/product/brazil-cerrado-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Brazil-Cerrado-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/brazil-cerrado.jpg",
        "roast_level": "Light Roast",
        "origin": "Cerrado Mineiro, Brazil",
    },
    {
        "name": "Ethiopia Yirgacheffe Coffee (8oz)",
        "slug": "ethiopia-yirgacheffe",
        "pack_size": "8oz",
        "category_name": "Light & Distinctive",
        "category_slug": "light-distinctive",
        "source_url": "https://www.coffeebean.pk/product/ethiopia-yirgacheffe-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Ethiopia-Yirgacheffe-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/ethiopia-yirgacheffe.jpg",
        "roast_level": "Light Roast",
        "origin": "Yirgacheffe Region, Sidamo, Ethiopia",
    },
    {
        "name": "Hazelnut Coffee (12oz)",
        "slug": "hazelnut",
        "pack_size": "12oz",
        "category_name": "Flavoured Coffee",
        "category_slug": "flavoured-coffee",
        "source_url": "https://www.coffeebean.pk/product/hazelnut-coffee-12oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Hazelnut-Coffee-12oz-550x550.jpg",
        "local_image": "/products/coffee/hazelnut.jpg",
        "roast_level": "Flavoured Roast",
        "origin": "Central & South America",
    },
    {
        "name": "French Vanilla Coffee (12oz)",
        "slug": "french-vanilla",
        "pack_size": "12oz",
        "category_name": "Flavoured Coffee",
        "category_slug": "flavoured-coffee",
        "source_url": "https://www.coffeebean.pk/product/french-vanilla-coffee-12oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/French-Vanilla-Coffee-12oz-550x550.jpg",
        "local_image": "/products/coffee/french-vanilla.jpg",
        "roast_level": "Flavoured Roast",
        "origin": "Central & South America",
    },
    {
        "name": "Decaf House Blend Coffee (8oz)",
        "slug": "decaf-house-blend",
        "pack_size": "8oz",
        "category_name": "Decaffeinated",
        "category_slug": "decaffeinated",
        "source_url": "https://www.coffeebean.pk/product/decaf-house-blend-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Decaf-House-Blend-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/decaf-house-blend.jpg",
        "roast_level": "Decaffeinated Light",
        "origin": "Latin America (Naturally Decaffeinated)",
    },
    {
        "name": "Decaf Espresso Roast Coffee (8oz)",
        "slug": "decaf-espresso-roast",
        "pack_size": "8oz",
        "category_name": "Decaffeinated",
        "category_slug": "decaffeinated",
        "source_url": "https://www.coffeebean.pk/product/decaf-espresso-roast-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Decaf-Espresso-Roast-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/decaf-espresso-roast.jpg",
        "roast_level": "Decaffeinated Dark",
        "origin": "Dark Roast Espresso Blend (Decaf)",
    },
    {
        "name": "Viennese Coffee (8oz)",
        "slug": "viennese",
        "pack_size": "8oz",
        "category_name": "Dark & Distinctive",
        "category_slug": "dark-distinctive",
        "source_url": "https://www.coffeebean.pk/product/viennese-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Viennese-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/viennese.jpg",
        "roast_level": "Dark Roast",
        "origin": "European Viennese Blend",
    },
    {
        "name": "Sumatra Mandheling Dark Coffee (8oz)",
        "slug": "sumatra-mandheling-dark",
        "pack_size": "8oz",
        "category_name": "Dark & Distinctive",
        "category_slug": "dark-distinctive",
        "source_url": "https://www.coffeebean.pk/product/sumatra-mandheling-dark-coffee-8oz/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Sumatra-Mandheling-Dark-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/sumatra-mandheling-dark.jpg",
        "roast_level": "Dark Roast",
        "origin": "Mount Leuser, Sumatra, Indonesia",
    },
    {
        "name": "Sulawesi Toraja",
        "slug": "sulawesi-toraja",
        "pack_size": None, # Source title does not specify pack size; strictly preserving source data
        "category_name": "Dark & Distinctive",
        "category_slug": "dark-distinctive",
        "source_url": "https://www.coffeebean.pk/product/sulawesi-toraja/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Sulawesi-Toraja-550x550.jpg",
        "local_image": "/products/coffee/sulawesi-toraja.jpg",
        "roast_level": "Dark Roast",
        "origin": "Toraja Highlands, Sulawesi, Indonesia",
    },
    {
        "name": "Espresso Roast Coffee (8oz)",
        "slug": "espresso-roast",
        "pack_size": "8oz",
        "category_name": "Dark & Distinctive",
        "category_slug": "dark-distinctive",
        "source_url": "https://www.coffeebean.pk/product/espresso-roast-coffee/",
        "image_url": "https://www.coffeebean.pk/wp-content/uploads/2017/10/Espresso-Roast-Coffee-8oz-550x550.jpg",
        "local_image": "/products/coffee/espresso-roast.jpg",
        "roast_level": "Dark Roast",
        "origin": "Specialty Espresso Blend",
    },
]

def fetch_product_details(url):
    """Fetch individual product page to extract actual description and data from source."""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
            soup = BeautifulSoup(html, "html.parser")
            
            # Short description
            desc_el = soup.find("div", class_="woocommerce-product-details__short-description")
            short_desc = desc_el.get_text(strip=True) if desc_el else None
            
            # Full description
            tab_desc = soup.find("div", id="tab-description")
            full_desc = tab_desc.get_text(strip=True) if tab_desc else short_desc
            
            # Price (if available)
            price_el = soup.find("p", class_="price")
            price_text = price_el.get_text(strip=True) if price_el else ""
            
            price = None
            if price_text:
                nums = re.findall(r'[\d,.]+', price_text)
                if nums:
                    try:
                        price = float(nums[-1].replace(',', ''))
                    except ValueError:
                        price = None
                        
            return {
                "short_description": short_desc,
                "description": full_desc,
                "price": price,
            }
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return {
            "short_description": None,
            "description": None,
            "price": None,
        }

def download_images(output_dir):
    """Download images to local public directory."""
    os.makedirs(output_dir, exist_ok=True)
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    for p in PRODUCTS_DATA:
        filename = os.path.basename(p["local_image"])
        filepath = os.path.join(output_dir, filename)
        if not os.path.exists(filepath):
            print(f"Downloading {p['image_url']} -> {filepath}")
            try:
                req = urllib.request.Request(p["image_url"], headers=headers)
                with urllib.request.urlopen(req, timeout=20) as resp:
                    with open(filepath, "wb") as f:
                        f.write(resp.read())
            except Exception as e:
                print(f"Failed to download {p['image_url']}: {e}")
        else:
            print(f"Image already exists: {filepath}")

if __name__ == "__main__":
    public_coffee_dir = os.path.join(os.path.dirname(__file__), "..", "public", "products", "coffee")
    download_images(public_coffee_dir)
    
    print("\nFetching product details from official source pages...")
    for p in PRODUCTS_DATA:
        print(f"Scraping {p['name']} from {p['source_url']}...")
        details = fetch_product_details(p["source_url"])
        p["description"] = details["description"]
        p["short_description"] = details["short_description"]
        p["flavor_profile"] = details["short_description"]
        if details["price"] is not None:
            p["price"] = details["price"]
        else:
            p["price"] = None

    # Save to json file for reference / seeding
    out_json = os.path.join(os.path.dirname(__file__), "scraped_coffee_catalog.json")
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(PRODUCTS_DATA, f, indent=2, ensure_ascii=False)
    print(f"\nSaved scraped catalog data to {out_json}")
