import axios from 'axios';
import { supabase } from '../utils/supabase';

// Standard Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

// Request interceptor to attach Admin JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Cache categories for fast synchronous enrichment
let cachedCategories = null;
let categoryCacheTime = 0;

async function getCategoriesMap() {
  const now = Date.now();
  if (cachedCategories && now - categoryCacheTime < 60000) {
    return cachedCategories;
  }
  try {
    const { data } = await supabase.from('categories').select('*');
    const map = {};
    (data || []).forEach((c) => {
      map[c.id] = c;
    });
    cachedCategories = map;
    categoryCacheTime = now;
    return map;
  } catch (err) {
    return cachedCategories || {};
  }
}

// Helper to format Product object from Supabase to match Flask to_dict()
function formatProduct(p, catMap = {}) {
  if (!p) return null;
  const parseJson = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  };

  const img = p.image || p.main_image || '/placeholder-coffee.png';
  const inStock = p.stock_quantity !== undefined ? p.stock_quantity > 0 : true;
  const cat = catMap[p.category_id] || {};
  const catName = p.category_name || cat.name || (p.product_type ? p.product_type.toUpperCase() : 'Coffee');
  const catSlug = p.category_slug || cat.slug || (p.product_type || 'coffee');

  return {
    ...p,
    id: p.id,
    name: p.name,
    slug: p.slug,
    product_type: p.product_type || 'coffee',
    price: Number(p.price || 0),
    sale_price: p.sale_price ? Number(p.sale_price) : null,
    stock_quantity: p.stock_quantity ?? 100,
    is_in_stock: inStock,
    availability: p.availability || (inStock ? 'In Stock' : 'Out of Stock'),
    is_active: p.is_active ?? true,
    is_featured: p.is_featured ?? false,
    image: img,
    image_url: img,
    thumbnail: p.thumbnail || img,
    thumbnail_url: p.thumbnail || img,
    gallery_images: [],
    additional_images: [],
    category: catName,
    category_name: catName,
    category_slug: catSlug,
    category_id: p.category_id || cat.id,
    categories: cat.name ? [cat.name] : [],
    all_categories: cat.name ? [{ id: cat.id, name: cat.name, slug: cat.slug }] : [],
    tags: p.tags ? (typeof p.tags === 'string' ? p.tags.split(',').map((t) => t.trim()) : p.tags) : [],
    size_options: parseJson(p.size_options, {}),
    milk_options: parseJson(p.milk_options, []),
    flavor_options: parseJson(p.flavor_options, []),
    grind_options: parseJson(p.grind_options, []),
    hot_available: p.hot_available ?? true,
    iced_available: p.iced_available ?? false,
    extra_shot_available: p.extra_shot_available ?? false,
    whipped_cream_available: p.whipped_cream_available ?? false,
    customization_enabled: p.customization_enabled ?? false,
  };
}

// Fallback direct Supabase Query Router
async function fetchFromSupabase(url, config = {}) {
  const cleanUrl = url.split('?')[0].replace(/^\/api/, '').replace(/^\//, '');
  const params = config.params || {};

  // Parse query params if in URL
  const queryParams = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
  for (const [k, v] of queryParams.entries()) {
    if (!params[k]) params[k] = v;
  }

  // 1. /products, /beverages, /food
  if (cleanUrl === 'products' || cleanUrl === 'beverages' || cleanUrl === 'food') {
    const catMap = await getCategoriesMap();
    let query = supabase.from('products').select('*', { count: 'exact' });

    if (cleanUrl === 'beverages') {
      query = query.eq('product_type', 'beverage');
    } else if (cleanUrl === 'food') {
      query = query.eq('product_type', 'food');
    } else if (params.type) {
      query = query.eq('product_type', params.type);
    }

    if (!params.all) {
      query = query.eq('is_active', true);
    }

    if (params.featured === 'true' || params.featured === true) {
      query = query.eq('is_featured', true);
    }

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%,short_description.ilike.%${params.search}%`);
    }

    // Sorting
    if (params.sort === 'price_low_high') {
      query = query.order('price', { ascending: true });
    } else if (params.sort === 'price_high_low') {
      query = query.order('price', { ascending: false });
    } else if (params.sort === 'name_a_z') {
      query = query.order('name', { ascending: true });
    } else {
      query = query.order('id', { ascending: true });
    }

    // Pagination
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(params.limit || '50', 10)));
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    let formatted = (data || []).map((p) => formatProduct(p, catMap));

    if (params.category && params.category !== 'all') {
      const catFilter = params.category.toLowerCase();
      formatted = formatted.filter((p) => {
        const cName = (p.category_name || '').toLowerCase();
        const cSlug = (p.category_slug || '').toLowerCase();
        return cName.includes(catFilter) || cSlug.includes(catFilter);
      });
    }

    return {
      data: {
        products: formatted,
        total: count || formatted.length,
        page,
        pages: Math.ceil((count || formatted.length) / limit) || 1,
        limit,
      },
    };
  }

  // 2. /products/:slug or /products/:id
  if (cleanUrl.startsWith('products/')) {
    const catMap = await getCategoriesMap();
    const identifier = cleanUrl.replace('products/', '').trim();
    let query = supabase.from('products').select('*');
    if (/^\d+$/.test(identifier)) {
      query = query.eq('id', parseInt(identifier, 10));
    } else {
      query = query.eq('slug', identifier);
    }

    const { data, error } = await query.single();
    if (error || !data) throw error || new Error('Product not found');

    return {
      data: {
        product: formatProduct(data, catMap),
      },
    };
  }

  // 3. /categories, /beverage-categories, /food-categories
  if (cleanUrl === 'categories' || cleanUrl === 'beverage-categories' || cleanUrl === 'food-categories') {
    let query = supabase.from('categories').select('*').order('sort_order', { ascending: true });

    if (cleanUrl === 'beverage-categories') {
      query = query.eq('product_type', 'beverage');
    } else if (cleanUrl === 'food-categories') {
      query = query.eq('product_type', 'food');
    } else if (params.type) {
      query = query.eq('product_type', params.type);
    }

    if (!params.all) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      data: {
        categories: data || [],
      },
    };
  }

  // 4. /stores
  if (cleanUrl === 'stores') {
    let query = supabase.from('stores').select('*').eq('is_active', true).order('id', { ascending: true });
    if (params.city && params.city !== 'all') {
      query = query.eq('city', params.city);
    }
    const { data: storesList, error: sErr } = await query;
    if (sErr) throw sErr;

    // Fetch opening hours
    const { data: hoursList } = await supabase.from('store_opening_hours').select('*');
    const hoursMap = {};
    (hoursList || []).forEach((h) => {
      if (!hoursMap[h.store_id]) hoursMap[h.store_id] = [];
      hoursMap[h.store_id].push(h);
    });

    const enrichedStores = (storesList || []).map((s) => ({
      ...s,
      opening_hours: hoursMap[s.id] || [],
      hours: hoursMap[s.id] || [],
      city: s.city || 'Islamabad',
    }));

    const distinctCities = [...new Set(enrichedStores.map((s) => s.city).filter(Boolean))];

    return {
      data: {
        stores: enrichedStores,
        cities: distinctCities,
        total: enrichedStores.length,
      },
    };
  }

  // 5. /cafe-menu
  if (cleanUrl === 'cafe-menu') {
    const { data, error } = await supabase.from('cafe_menu_items').select('*').eq('is_available', true);
    if (error) throw error;

    return {
      data: {
        items: data || [],
        menu_items: data || [],
      },
    };
  }

  // 6. /banners
  if (cleanUrl === 'banners') {
    const { data, error } = await supabase.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (error) throw error;

    return {
      data: {
        banners: data || [],
      },
    };
  }

  // 7. /settings
  if (cleanUrl === 'settings') {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    const settingsMap = {};
    (data || []).forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return {
      data: {
        settings: settingsMap,
      },
    };
  }

  // 8. /orders/:id
  if (cleanUrl.startsWith('orders/')) {
    const orderId = cleanUrl.replace('orders/', '').trim();
    let query = supabase.from('orders').select('*');
    if (/^\d+$/.test(orderId)) {
      query = query.eq('id', parseInt(orderId, 10));
    } else {
      query = query.eq('order_number', orderId);
    }

    const { data: orderData, error: oErr } = await query.single();
    if (oErr) throw oErr;

    const { data: itemsData } = await supabase.from('order_items').select('*').eq('order_id', orderData.id);

    return {
      data: {
        order: {
          ...orderData,
          items: itemsData || [],
        },
      },
    };
  }

  throw new Error(`Unhandled Supabase direct fallback for: ${cleanUrl}`);
}

// Smart Hybrid API Export
const api = {
  get: async (url, config = {}) => {
    try {
      const res = await axiosInstance.get(url, config);
      if (res.data && (res.data.products?.length || res.data.categories?.length || res.data.stores?.length || res.data.banners?.length || res.data.product || res.data.settings)) {
        return res;
      }
      if (res.data && res.data.products && res.data.products.length === 0) {
        return await fetchFromSupabase(url, config);
      }
      return res;
    } catch (err) {
      return await fetchFromSupabase(url, config);
    }
  },

  post: async (url, data, config = {}) => {
    try {
      return await axiosInstance.post(url, data, config);
    } catch (err) {
      const cleanUrl = url.replace(/^\/api/, '').replace(/^\//, '');

      if (cleanUrl === 'orders') {
        const orderNumber = `CBP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const orderRecord = {
          order_number: orderNumber,
          customer_name: data.customer_name || 'Guest Customer',
          customer_email: data.customer_email || '',
          customer_phone: data.customer_phone || '',
          order_type: data.order_type || 'delivery',
          delivery_address: data.delivery_address || '',
          city: data.city || 'Islamabad',
          area: data.area || '',
          store_name: data.store_name || '',
          subtotal: data.subtotal || 0,
          delivery_fee: data.delivery_fee || 0,
          discount_amount: data.discount_amount || 0,
          total_amount: data.total_amount || 0,
          payment_method: data.payment_method || 'Cash on Delivery',
          order_status: 'Pending',
          payment_status: 'Pending',
        };

        const { data: insertedOrder, error: orderErr } = await supabase.from('orders').insert([orderRecord]).select().single();
        if (orderErr) throw orderErr;

        if (data.items && data.items.length > 0) {
          const itemsToInsert = data.items.map((it) => ({
            order_id: insertedOrder.id,
            product_id: it.product_id || null,
            product_name: it.product_name || it.name || 'Product',
            product_sku: it.sku || '',
            quantity: it.quantity || 1,
            unit_price: it.price || it.unit_price || 0,
            total_price: (it.price || it.unit_price || 0) * (it.quantity || 1),
            selected_options: it.selected_options || {},
          }));
          await supabase.from('order_items').insert(itemsToInsert);
        }

        return {
          status: 201,
          data: {
            message: 'Order created successfully',
            order: insertedOrder,
          },
        };
      }

      throw err;
    }
  },

  put: (url, data, config) => axiosInstance.put(url, data, config),
  delete: (url, config) => axiosInstance.delete(url, config),
};

export default api;
