# The Coffee Bean & Tea Leaf Pakistan — Full-Stack E-Commerce Platform

A production-ready, full-stack coffee e-commerce web platform for **The Coffee Bean & Tea Leaf Pakistan** (Owned and Operated by Ab Brands Pvt Ltd), inspired by [coffeebean.pk](https://www.coffeebean.pk/), built with **Python Flask (Backend)** and **React + Vite + Tailwind CSS (Frontend)**.

---

## 📁 Project Structure

```
coffee-bean-pakistan/
│
├── frontend/
│   ├── src/
│   │   ├── admin/             # Admin management pages & login
│   │   ├── assets/            # Official brand logos & banners
│   │   ├── components/        # Navbar, Footer, Drawers, Modals, Filters
│   │   ├── context/           # CartContext, AuthContext (Admin only)
│   │   ├── pages/             # Home, Coffee, Tea, CafeMenu, Stores, Checkout
│   │   ├── services/          # Axios API client with VITE_API_URL
│   │   ├── App.jsx            # Routing & layout configurations
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json            # SPA routing rewrite rule
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── models/            # SQLAlchemy database models (Order, Product, Store, etc.)
│   │   ├── routes/            # REST API endpoints (orders, products, admin, stores)
│   │   └── utils/
│   ├── coffee_store.db
│   ├── requirements.txt       # Production dependencies
│   ├── index.py               # WSGI entrypoint for Vercel/Production
│   ├── run.py                 # Local development server
│   ├── seed.py                # Initial catalog & store data
│   └── test_api.py            # Automated API test suite
│
├── .gitignore
└── README.md
```

---

## 🌟 Key Features

### 🛒 100% Guest Customer Experience (No Customer Login)
- **Zero Login / Registration**: Customers browse, add items to cart, and place orders directly as guests.
- **Doorstep Delivery & Store Pickup**: Choose between nationwide courier delivery or free in-store collection at any flagship branch.
- **Live Order Review**: Review line items, quantities, pricing, address/pickup store, and payment methods before placement.
- **Instant Order Reference**: Generates unique reference numbers matching `CBP-2026-XXXXXX`.
- **Dynamic Catalog & Cafe Menu**: Real single-origin whole beans, whole-leaf teas, fresh bakery items, and handcrafted espresso beverages with nutritional calorie info.

### 🔐 Dedicated Admin Portal (`/admin/login`)
- **Protected Administrator Login**: JWT-secured admin authentication with role enforcement (`/admin/login`).
- **Orders Management**: Track guest delivery & pickup orders, update fulfillment statuses (*Pending, Confirmed, Preparing, Ready, Out for Delivery, Completed, Cancelled*), and auto-reconcile stock.
- **Products & Inventory Control**: Manage product catalog, image uploads, roast levels, prices, and one-click stock adjustments.
- **Store & Menu Management**: Add and update cafe branches, timings, banner promotions, and in-store menu offerings.

---

## 🚀 Local Development Setup

### 1. Backend Setup (Flask API)

```bash
# Navigate to backend
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run initial seed data
python seed.py

# Start Flask backend server (Port 5000)
python run.py
```

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server (Port 5173)
npm run dev
```

The application is available at:
- **Storefront**: `http://localhost:5173/`
- **Admin Portal**: `http://localhost:5173/admin/login`
- **Backend API**: `http://localhost:5000/api/health`

---

## 🌐 Vercel Deployment Guide

### Deploy Frontend (React SPA)
1. In Vercel, import the repository and set the **Root Directory** to `frontend`.
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://your-backend-api.vercel.app/api`)

The `frontend/vercel.json` file ensures that all React Router routes work seamlessly without 404 errors:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deploy Backend (Python Flask Serverless)
1. Create a separate Vercel project for the `backend/` folder or deploy to a container platform (Render / Railway / AWS / Fly.io).
2. Set environment variables:
   - `SECRET_KEY`: `your-secure-random-secret`
   - `JWT_SECRET_KEY`: `your-secure-jwt-secret`
   - `DATABASE_URL`: Your PostgreSQL / SQLite connection string.

---

## 🔑 Admin Credentials (Seed Data)

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@coffeebean.com` | `admin123` | `/admin/login` |

---

## 🧪 Test Suite Execution

Run automated unit and integration tests:

```bash
cd backend
python test_api.py
```
*(All 7 tests verifying health check, catalog search, guest delivery orders, guest pickup orders, dashboard metrics, and admin status updates pass with 100% OK).*
