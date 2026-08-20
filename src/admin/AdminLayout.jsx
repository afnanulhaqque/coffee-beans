import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  DownloadCloud,
  Layers, 
  ShoppingBag, 
  Users, 
  Boxes, 
  MapPin, 
  Image as ImageIcon, 
  Utensils, 
  Settings as SettingsIcon, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export default function AdminLayout() {
  const { isAdmin, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If loading, show clean loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#351B38] flex items-center justify-center p-4 text-[#F5F0E8] font-body">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#E8DED2]">
          Verifying administrator session...
        </div>
      </div>
    );
  }

  // If user is not admin, redirect or show admin login
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#351B38] flex items-center justify-center p-4 text-[#F5F0E8] font-body">
        <div className="bg-[#2A1B17] rounded-md border border-[#4B274F] p-8 max-w-md w-full text-center shadow-2xl space-y-4">
          <div className="w-14 h-14 bg-red-950/60 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-800">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-[#E8DED2]/80 font-normal">
            You must be signed in with authorized administrator credentials to access the store management system.
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <Link
              to="/admin/login"
              className="px-6 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
            >
              Admin Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      group: 'Catalog',
      items: [
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Product Import', path: '/admin/import', icon: DownloadCloud },
        { label: 'Categories', path: '/admin/categories', icon: Layers },
        { label: 'Inventory Control', path: '/admin/inventory', icon: Boxes },
      ],
    },
    {
      group: 'Sales & Fulfillments',
      items: [
        { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { label: 'Customers', path: '/admin/customers', icon: Users },
      ],
    },
    {
      group: 'Store Content',
      items: [
        { label: 'Cafe Menu', path: '/admin/cafe-menu', icon: Utensils },
        { label: 'Banners & Promos', path: '/admin/banners', icon: ImageIcon },
        { label: 'Store Locations', path: '/admin/stores', icon: MapPin },
      ],
    },
    {
      group: 'System',
      items: [
        { label: 'Settings', path: '/admin/settings', icon: SettingsIcon },
      ],
    },
  ];

  const isNavActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col lg:flex-row text-[#2A1B17] font-body">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#351B38] text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="The Coffee Bean" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
          <span className="font-display font-bold text-sm">Coffee Bean Management</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-md bg-white/10 text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation: Deep Purple #351B38 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#351B38] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="The Coffee Bean"
                className="w-10 h-10 object-contain bg-white rounded-full p-0.5 shadow-sm shrink-0"
              />
              <div>
                <span className="font-display font-bold text-sm text-white block leading-tight">
                  The Coffee Bean
                </span>
                <span className="text-[9px] text-[#E8DED2] font-bold tracking-widest uppercase">
                  Admin Workspace
                </span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grouped Nav Items */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navGroups.map((grp, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#E8DED2]/80 px-3 block mb-1">
                  {grp.group}
                </span>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all ${
                        active
                          ? 'bg-[#4B274F] text-white font-bold shadow-xs'
                          : 'text-[#E8DED2]/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#E8DED2]'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#2A1B17]/60">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#E8DED2] hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#E8DED2]" /> View Storefront
            </span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-300 hover:text-red-200 rounded-md hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full overflow-y-auto bg-[#F5F0E8]">
        <Outlet />
      </main>

    </div>
  );
}
