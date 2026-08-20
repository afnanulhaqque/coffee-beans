import os
import re
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlparse

# Ensure imports work from any CWD
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.utils.upload import slugify

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
}

def clean_filename(name):
    # e.g. 100% Kona Coffee (8oz) -> 100-kona-coffee-8oz.jpg
    slug = slugify(name)
    return f"{slug}.jpg"

def download_image(img_url, local_filename, uploads_dir):
    try:
        if not img_url:
            return None
        
        # Strip query params
        parsed = urlparse(img_url)
        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        
        # Try full resolution if thumbnail was passed
        full_res_url = re.sub(r'-\d+x\d+\.(jpg|jpeg|png|webp)', r'.\1', clean_url, flags=re.IGNORECASE)
        
        target_path = os.path.join(uploads_dir, local_filename)
        if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
            return f"/uploads/products/{local_filename}"

        # Fetch image with timeout
        r = requests.get(full_res_url, headers=HEADERS, timeout=12)
        if r.status_code != 200:
            # Fallback to original clean_url
            r = requests.get(clean_url, headers=HEADERS, timeout=12)

        if r.status_code == 200 and len(r.content) > 500:
            with open(target_path, 'wb') as f:
                f.write(r.content)
            return f"/uploads/products/{local_filename}"
        else:
            return clean_url
    except Exception as e:
        print(f"  [Image Download Warning] {img_url}: {e}")
        return img_url

def parse_price(price_text, default_price=3400.0):
    if not price_text:
        return default_price
    # Extract numbers from string like "Rs. 3,450" or "$24.99"
    numbers = re.findall(r'[\d,]+(?:\.\d+)?', price_text)
    if numbers:
        clean_num = numbers[0].replace(',', '')
        try:
            val = float(clean_num)
            return val if val > 0 else default_price
        except ValueError:
            pass
    return default_price

def run_import(force_update=False):
    app = create_app()
    stats = {
        'products_discovered': 0,
        'products_imported': 0,
        'products_updated': 0,
        'duplicates_skipped': 0,
        'images_downloaded': 0,
        'errors': 0,
        'log': [],
        'started_at': datetime.utcnow().isoformat(),
    }

    with app.app_context():
        uploads_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'products')
        os.makedirs(uploads_dir, exist_ok=True)

        stats['log'].append(f"Starting product import from https://www.coffeebean.pk/shop/ at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}")
        print("Starting product import from https://www.coffeebean.pk/shop/...")

        # 1. Discover all product URLs across pagination
        product_urls = []
        page = 1
        max_pages = 20 # Safety cap

        while page <= max_pages:
            shop_url = f"https://www.coffeebean.pk/shop/page/{page}/" if page > 1 else "https://www.coffeebean.pk/shop/"
            try:
                res = requests.get(shop_url, headers=HEADERS, timeout=15)
                if res.status_code != 200:
                    stats['log'].append(f"Reached end of shop pagination at page {page} (Status: {res.status_code})")
                    break

                soup = BeautifulSoup(res.text, 'html.parser')
                product_items = soup.select('li.product, .product')
                if not product_items:
                    break

                found_page_urls = []
                for item in product_items:
                    link = item.select_one('a')
                    if link and link.get('href') and '/product/' in link.get('href'):
                        href = link.get('href').split('?')[0].rstrip('/') + '/'
                        if href not in product_urls:
                            product_urls.append(href)
                            found_page_urls.append(href)

                stats['log'].append(f"Page {page}: Discovered {len(found_page_urls)} products")
                print(f"Page {page}: Discovered {len(found_page_urls)} products (Total: {len(product_urls)})")
                
                # Check for next page button
                next_page = soup.select_one('a.next, .next.page-numbers')
                if not next_page and len(found_page_urls) == 0:
                    break

                page += 1
                time.sleep(0.3)
            except Exception as e:
                stats['errors'] += 1
                stats['log'].append(f"Error fetching page {page}: {str(e)}")
                break

        stats['products_discovered'] = len(product_urls)
        stats['log'].append(f"Total Unique Product URLs Discovered: {len(product_urls)}")
        print(f"Total Unique Product URLs Discovered: {len(product_urls)}")

        # 2. Category Cache mapping
        cat_cache = {c.slug: c for c in Category.query.all()}

        def get_or_create_category(name, parent_slug=None):
            slug = slugify(name)
            if slug in cat_cache:
                return cat_cache[slug]

            parent_id = None
            if parent_slug and parent_slug in cat_cache:
                parent_id = cat_cache[parent_slug].id

            cat = Category.query.filter_by(slug=slug).first()
            if not cat:
                cat = Category(
                    name=name,
                    slug=slug,
                    parent_id=parent_id,
                    sort_order=Category.query.count() + 1,
                    is_active=True
                )
                db.session.add(cat)
                db.session.commit()
            
            cat_cache[slug] = cat
            return cat

        # Ensure main categories exist
        cat_coffee = get_or_create_category("Coffee")
        cat_tea = get_or_create_category("Tea")
        cat_merch = get_or_create_category("Merchandise & Gear")
        cat_dessert = get_or_create_category("Desserts & Bakery")

        # 3. Process each product URL
        for idx, p_url in enumerate(product_urls, 1):
            try:
                print(f"[{idx}/{len(product_urls)}] Parsing {p_url}...")
                p_res = requests.get(p_url, headers=HEADERS, timeout=15)
                if p_res.status_code != 200:
                    stats['errors'] += 1
                    stats['log'].append(f"Failed to load {p_url} (HTTP {p_res.status_code})")
                    continue

                p_soup = BeautifulSoup(p_res.text, 'html.parser')

                # Title
                title_elem = p_soup.select_one('.edgtf-single-product-title, .product_title, h1.product_title, h1, h2.product-title')
                name = title_elem.get_text(strip=True) if title_elem else ''
                if not name:
                    # Derive title from slug in URL
                    slug_part = p_url.rstrip('/').split('/')[-1]
                    name = slug_part.replace('-', ' ').title()

                slug = slugify(name)

                # Categories from Breadcrumb or Meta
                raw_cats = [a.get_text(strip=True) for a in p_soup.select('.posted_in a, .breadcrumb a')]
                clean_cats = [c for c in raw_cats if c.lower() not in ['home', 'shop', 'uncategorized']]

                # Determine Category & Subcategory
                category_id = None
                roast_level = 'Medium'
                is_tea = any('tea' in c.lower() for c in clean_cats) or 'tea' in name.lower()
                is_coffee = any('coffee' in c.lower() for c in clean_cats) or 'coffee' in name.lower() or 'roast' in name.lower() or 'blend' in name.lower()

                if is_tea:
                    if 'green' in name.lower():
                        c_obj = get_or_create_category("Green Tea", "tea")
                    elif 'herbal' in name.lower() or 'mint' in name.lower() or 'chamomile' in name.lower():
                        c_obj = get_or_create_category("Herbal Infusions", "tea")
                    elif 'chai' in name.lower():
                        c_obj = get_or_create_category("Specialty & Chai", "tea")
                    else:
                        c_obj = get_or_create_category("Black Tea", "tea")
                    category_id = c_obj.id
                    roast_level = "Tea"
                elif is_coffee:
                    # Check for coffee subcategories
                    sub_match = None
                    for c_name in clean_cats:
                        if c_name.lower() not in ['coffee', 'all']:
                            sub_match = c_name
                            break

                    if 'light' in name.lower() or (sub_match and 'light' in sub_match.lower()):
                        c_obj = get_or_create_category(sub_match or "Light & Distinctive", "coffee")
                        roast_level = "Light"
                    elif 'dark' in name.lower() or 'espresso' in name.lower() or (sub_match and 'dark' in sub_match.lower()):
                        c_obj = get_or_create_category(sub_match or "Dark & Distinctive", "coffee")
                        roast_level = "Dark"
                    elif 'decaf' in name.lower() or (sub_match and 'decaf' in sub_match.lower()):
                        c_obj = get_or_create_category(sub_match or "Decaffeinated", "coffee")
                        roast_level = "Decaf"
                    elif 'vanilla' in name.lower() or 'hazelnut' in name.lower() or 'flavoured' in name.lower():
                        c_obj = get_or_create_category("Flavoured Coffee", "coffee")
                        roast_level = "Flavoured"
                    elif 'rich' in name.lower() or (sub_match and 'rich' in sub_match.lower()):
                        c_obj = get_or_create_category("Rich & Smooth", "coffee")
                        roast_level = "Medium"
                    else:
                        c_obj = get_or_create_category(sub_match or "Medium & Smooth", "coffee")
                        roast_level = "Medium"
                    category_id = c_obj.id
                elif 'cake' in name.lower() or 'pastry' in name.lower() or 'cookie' in name.lower():
                    c_obj = get_or_create_category("Desserts & Bakery")
                    category_id = c_obj.id
                    roast_level = "Bakery"
                else:
                    c_obj = get_or_create_category("Coffee")
                    category_id = c_obj.id

                # Description
                desc_elem = p_soup.select_one('.woocommerce-product-details__short-description, .product-short-description, #tab-description, .edgtf-single-product-summary')
                description = ""
                if desc_elem:
                    # Clean out noise
                    description = desc_elem.get_text('\n', strip=True)
                    description = re.sub(r'Categories:.*', '', description, flags=re.IGNORECASE).strip()

                if not description:
                    description = f"Authentic handcrafted {name} from The Coffee Bean & Tea Co., carefully selected and freshly roasted."

                short_desc = description.split('\n')[0][:250]

                # Price calculation
                price_elem = p_soup.select_one('.price, .woocommerce-Price-amount')
                default_p = 2600.0 if is_tea else (850.0 if 'cake' in name.lower() else 3400.0)
                price = parse_price(price_elem.get_text(strip=True) if price_elem else '', default_p)

                # SKU
                sku_elem = p_soup.select_one('.sku')
                sku = sku_elem.get_text(strip=True) if sku_elem else f"CB-{slug[:10].upper()}-{idx:03d}"

                # Image URLs
                img_elements = p_soup.select('.woocommerce-product-gallery__image img, .product-images img, .images img, .edgtf-single-product-image img')
                raw_images = []
                for img in img_elements:
                    src = img.get('src') or img.get('data-src') or img.get('data-large_image')
                    if src and src not in raw_images:
                        raw_images.append(src)

                # Fallback if no detail images found, search shop page img
                if not raw_images:
                    raw_images = [f"https://www.coffeebean.pk/wp-content/uploads/2017/10/{clean_filename(name)}"]

                # Download primary image
                primary_img_url = raw_images[0]
                local_file_name = clean_filename(name)
                saved_image_path = download_image(primary_img_url, local_file_name, uploads_dir)
                if saved_image_path and saved_image_path.startswith('/uploads/'):
                    stats['images_downloaded'] += 1

                # Check if Product already exists by source_url or slug
                existing = Product.query.filter((Product.source_url == p_url) | (Product.slug == slug)).first()

                if existing:
                    if existing.manually_modified and not force_update:
                        stats['duplicates_skipped'] += 1
                        stats['log'].append(f"Skipped manually modified product: {name}")
                        continue

                    # Update product
                    existing.name = name
                    existing.slug = slug
                    existing.source_url = p_url
                    existing.description = description
                    existing.short_description = short_desc
                    existing.price = price
                    existing.sku = sku
                    existing.category_id = category_id
                    existing.roast_level = roast_level
                    existing.image = saved_image_path or existing.image
                    existing.last_imported_at = datetime.utcnow()
                    db.session.flush()

                    stats['products_updated'] += 1
                    stats['log'].append(f"Updated product: {name}")
                    product_id = existing.id
                else:
                    # Create new product
                    new_product = Product(
                        name=name,
                        slug=slug,
                        source_url=p_url,
                        description=description,
                        short_description=short_desc,
                        price=price,
                        sku=sku,
                        stock_quantity=25,
                        image=saved_image_path,
                        category_id=category_id,
                        roast_level=roast_level,
                        origin="Single Origin Specialty" if is_coffee else "Single Estate Tea",
                        tags=f"{name}, Specialty, Direct Trade",
                        is_active=True,
                        is_featured=(idx <= 6),
                        is_best_seller=(idx in [1, 3, 5, 8, 12]),
                        last_imported_at=datetime.utcnow()
                    )
                    db.session.add(new_product)
                    db.session.flush()
                    stats['products_imported'] += 1
                    stats['log'].append(f"Imported new product: {name}")
                    product_id = new_product.id

                # Save Gallery Images
                if len(raw_images) > 1:
                    ProductImage.query.filter_by(product_id=product_id).delete()
                    for g_idx, g_img in enumerate(raw_images[1:], 1):
                        g_filename = f"{slug}-gallery-{g_idx}.jpg"
                        g_saved = download_image(g_img, g_filename, uploads_dir)
                        if g_saved:
                            pi = ProductImage(product_id=product_id, image_url=g_saved, sort_order=g_idx)
                            db.session.add(pi)

                db.session.commit()
                time.sleep(0.15)
            except Exception as e:
                stats['errors'] += 1
                stats['log'].append(f"Error importing {p_url}: {str(e)}")
                print(f"Error processing {p_url}: {e}")
                db.session.rollback()

        stats['finished_at'] = datetime.utcnow().isoformat()
        stats['log'].append(f"Import completed successfully. Imported: {stats['products_imported']}, Updated: {stats['products_updated']}, Skipped: {stats['duplicates_skipped']}, Images: {stats['images_downloaded']}, Errors: {stats['errors']}")
        print(f"\nImport Finished: {stats['products_imported']} imported, {stats['products_updated']} updated, {stats['images_downloaded']} images downloaded.")

    return stats

if __name__ == '__main__':
    force = '--force' in sys.argv
    run_import(force_update=force)
