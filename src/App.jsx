import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Coffee from './pages/Coffee';
import Tea from './pages/Tea';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Stores from './pages/Stores';
import CafeMenu from './pages/CafeMenu';
import About from './pages/About';
import Contact from './pages/Contact';
import TeaSourcing from './pages/TeaSourcing';
import OurCoffee from './pages/OurCoffee';
import OurHeritage from './pages/OurHeritage';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import Import from './admin/Import';
import Categories from './admin/Categories';
import Orders from './admin/Orders';
import AdminOrderDetails from './admin/AdminOrderDetails';
import Customers from './admin/Customers';
import Inventory from './admin/Inventory';
import AdminStores from './admin/Stores';
import Banners from './admin/Banners';
import AdminCafeMenu from './admin/CafeMenu';
import Settings from './admin/Settings';

import CartDrawer from './components/CartDrawer';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Customer Storefront Layout Wrapper
function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F1E9] text-[#1C1714]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}

// 404 Fallback
function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="font-serif-luxury text-4xl font-bold text-[#3E2723] mb-3">404</h1>
      <p className="text-sm text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <a href="/" className="px-6 py-3 bg-[#3E2723] text-white text-xs font-bold rounded-xl inline-block">
        Return to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Customer Storefront Routes (100% Guest Shopping & Checkout) */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="coffee" element={<Coffee />} />
              <Route path="shop/coffee" element={<Coffee />} />
              <Route path="shop/coffee/:subcategory" element={<Coffee />} />
              <Route path="tea" element={<Tea />} />
              <Route path="shop/tea" element={<Tea />} />
              <Route path="product/:slug" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:orderId" element={<OrderSuccess />} />
              <Route path="stores" element={<Stores />} />
              <Route path="store-locator" element={<Stores />} />
              <Route path="locations" element={<Stores />} />
              <Route path="cake-to-go" element={<CafeMenu />} />
              <Route path="cafe-menu" element={<CafeMenu />} />
              <Route path="cake-menu" element={<CafeMenu />} />
              <Route path="cakes" element={<CafeMenu />} />
              <Route path="bakery" element={<CafeMenu />} />
              <Route path="our-coffee" element={<OurCoffee />} />
              <Route path="coffee-sourcing" element={<OurCoffee />} />
              <Route path="our-heritage" element={<OurHeritage />} />
              <Route path="about" element={<About />} />
              <Route path="about-us" element={<About />} />
              <Route path="sourcing" element={<OurCoffee />} />
              <Route path="tea-sourcing" element={<TeaSourcing />} />
              <Route path="tea/sourcing" element={<TeaSourcing />} />
              <Route path="contact" element={<Contact />} />
              <Route path="contact-us" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Authentication Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Management Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="import" element={<Import />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="banners" element={<Banners />} />
              <Route path="cafe-menu" element={<AdminCafeMenu />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
