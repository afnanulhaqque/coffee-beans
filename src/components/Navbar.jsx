import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  X, 
  ChevronDown, 
  Plus, 
  Minus,
  Menu
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/logo.png';
import api from '../services/api';

// Single source of truth navigation configuration
const navItems = [
  {
    label: "Home",
    path: "/"
  },
  {
    label: "Coffee",
    path: "/coffee"
  },
  {
    label: "Tea",
    path: "/tea"
  },
  {
    label: "Cakes To Go",
    path: "/cake-to-go"
  },
  {
    label: "Cafe Menu",
    path: "/cafe-menu",
    children: [
      {
        label: "Beverage",
        path: "/beverage"
      },
      {
        label: "Food",
        path: "/food"
      }
    ]
  },
  {
    label: "Our Stores",
    path: "/store-locator"
  },
  {
    label: "About Us",
    path: "/about-us",
    children: [
      {
        label: "Our Coffee",
        path: "/coffee-sourcing"
      },
      {
        label: "Our Tea",
        path: "/tea-sourcing"
      },
      {
        label: "Our Heritage",
        path: "/our-heritage"
      },
      {
        label: "Contact",
        path: "/contact-us"
      }
    ]
  }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile accordion state
  const [openMobileAccordions, setOpenMobileAccordions] = useState({});

  // Desktop active dropdown state
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);

  // Global search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const hamburgerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const searchInputRef = useRef(null);
  const navContainerRef = useRef(null);

  const { totalItems, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const pathname = location.pathname;

  // Scroll listener for sticky solid background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Route change cleanup
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDesktopDropdown(null);
  }, [location.pathname, location.hash]);

  // Keyboard navigation: Escape key closes drawers and dropdowns
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isSearchOpen) {
        setIsSearchOpen(false);
      } else if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        if (hamburgerRef.current) hamburgerRef.current.focus();
      } else {
        setActiveDesktopDropdown(null);
      }
    }
  }, [isMobileMenuOpen, isSearchOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get('/products', {
          params: { search: searchQuery.trim(), limit: 5 }
        });
        const items = res.data?.products || (Array.isArray(res.data) ? res.data : []);
        setSearchResults(items);
      } catch (err) {
        console.error('Navbar search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Helper to determine if a navigation item is active
  const isItemActive = (item) => {
    if (item.path === '/') {
      return pathname === '/';
    }

    if (item.path === '/coffee') {
      return pathname === '/coffee' || pathname.startsWith('/coffee/') || pathname.startsWith('/shop/coffee');
    }

    if (item.path === '/tea') {
      return pathname === '/tea' || pathname.startsWith('/tea/') || pathname.startsWith('/shop/tea');
    }

    if (item.path === '/cake-to-go') {
      return pathname === '/cake-to-go' || pathname.startsWith('/cake-to-go/') || pathname === '/cakes' || pathname.startsWith('/cakes/');
    }

    if (item.path === '/cafe-menu') {
      return (
        pathname === '/cafe-menu' || 
        pathname.startsWith('/cafe-menu/') || 
        pathname === '/beverage' || 
        pathname.startsWith('/beverage/') || 
        pathname === '/food' || 
        pathname.startsWith('/food/')
      );
    }

    if (item.path === '/store-locator') {
      return pathname === '/store-locator' || pathname.startsWith('/store-locator/') || pathname.startsWith('/stores');
    }

    if (item.path === '/about-us') {
      return (
        pathname === '/about-us' || 
        pathname === '/about' || 
        pathname.startsWith('/about/') || 
        pathname === '/coffee-sourcing' || 
        pathname === '/our-coffee' || 
        pathname === '/tea-sourcing' || 
        pathname === '/our-heritage' || 
        pathname === '/contact-us' || 
        pathname === '/contact'
      );
    }

    if (item.children) {
      return item.children.some(child => pathname === child.path || pathname.startsWith(child.path + '/'));
    }

    return pathname === item.path || pathname.startsWith(item.path + '/');
  };

  const toggleMobileAccordion = (label) => {
    setOpenMobileAccordions(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isNavSolid = isScrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-body ${
          isNavSolid
            ? 'bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#E8DED2] shadow-xs text-[#2A1B17]'
            : 'bg-linear-to-b from-[#351B38]/90 via-[#351B38]/45 to-transparent text-white'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* ================= LEFT: BRAND LOGO ================= */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group"
              title="The Coffee Bean & Tea Leaf Pakistan"
            >
              <img
                src={logoImg}
                alt="The Coffee Bean & Tea Leaf"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className={`font-display text-sm sm:text-lg tracking-tight leading-none ${
                  isNavSolid ? 'text-[#351B38]' : 'text-white'
                }`}>
                  THE COFFEE BEAN
                </span>
                <span className={`text-[8px] sm:text-[9px] tracking-[0.22em] uppercase font-semibold mt-0.5 ${
                  isNavSolid ? 'text-[#4B274F]' : 'text-[#E8DED2]'
                }`}>
                  &amp; Tea Leaf • Est. 1963
                </span>
              </div>
            </Link>
          </div>

          {/* ================= CENTER: DESKTOP NAVIGATION (≥ 1024px) ================= */}
          <nav 
            ref={navContainerRef}
            className="hidden lg:flex items-center justify-center flex-1 gap-5 xl:gap-7 2xl:gap-8 text-xs uppercase tracking-wider font-semibold"
          >
            {navItems.map((item) => {
              const active = isItemActive(item);
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isOpen = activeDesktopDropdown === item.label;

              if (hasChildren) {
                return (
                  <div
                    key={item.label}
                    className="relative py-2 group"
                    onMouseEnter={() => setActiveDesktopDropdown(item.label)}
                    onMouseLeave={() => setActiveDesktopDropdown(null)}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setActiveDesktopDropdown(null)}
                      className={`flex items-center gap-1.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                        isNavSolid
                          ? active
                            ? 'text-[#4B274F] font-bold after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-[#4B274F]'
                            : 'text-[#2A1B17] hover:text-[#4B274F]'
                          : active
                            ? 'text-white font-bold after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-white'
                            : 'text-[#F5F0E8] hover:text-white'
                      }`}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#4B274F]' : ''}`} />
                    </Link>

                    {/* Desktop Dropdown Popover */}
                    <div
                      className={`absolute top-full left-0 pt-2 w-52 transition-all duration-200 ${
                        isOpen
                          ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                          : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                      }`}
                    >
                      <div className="bg-white border border-[#E8DED2] rounded-md shadow-xl py-2 text-[#2A1B17]">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={() => setActiveDesktopDropdown(null)}
                            className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#2A1B17] hover:bg-[#E8DED2]/60 hover:text-[#4B274F] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`py-2 relative whitespace-nowrap transition-colors ${
                    isNavSolid
                      ? active
                        ? 'text-[#4B274F] font-bold after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-[#4B274F]'
                        : 'text-[#2A1B17] hover:text-[#4B274F]'
                      : active
                        ? 'text-white font-bold after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-white'
                        : 'text-[#F5F0E8] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ================= RIGHT: SEARCH & CART (DESKTOP) ================= */}
          <div className="hidden lg:flex items-center space-x-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-1.5 min-h-10 px-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                isNavSolid ? 'text-[#2A1B17] hover:text-[#4B274F]' : 'text-[#F5F0E8] hover:text-white'
              }`}
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className={`flex items-center gap-2 min-h-10 px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all rounded-md shadow-xs cursor-pointer ${
                isNavSolid
                  ? 'bg-[#4B274F] hover:bg-[#351B38] text-white'
                  : 'bg-[#4B274F] hover:bg-[#351B38] text-white border border-white/20'
              }`}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Cart ({totalItems})</span>
            </button>
          </div>

          {/* ================= RIGHT: TABLET & MOBILE (< 1024px) ================= */}
          <div className="flex lg:hidden items-center space-x-2 shrink-0">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`min-w-10 min-h-10 flex items-center justify-center rounded-md transition-colors ${
                isNavSolid ? 'text-[#2A1B17] hover:bg-[#E8DED2]/60' : 'text-white hover:bg-white/15'
              }`}
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              className={`min-w-10 min-h-10 flex items-center justify-center relative rounded-md transition-colors ${
                isNavSolid ? 'text-[#2A1B17] hover:bg-[#E8DED2]/60' : 'text-white hover:bg-white/15'
              }`}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#4B274F] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              ref={hamburgerRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`min-w-10 min-h-10 flex items-center justify-center rounded-md transition-colors ${
                isNavSolid ? 'text-[#2A1B17] hover:bg-[#E8DED2]/60' : 'text-white hover:bg-white/15'
              }`}
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ================= MOBILE DRAWER (< 1024px) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end font-body">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2A1B17]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className="relative w-[85vw] max-w-sm h-full bg-[#F5F0E8] text-[#2A1B17] shadow-2xl flex flex-col z-50 overflow-y-auto border-l border-[#E8DED2] animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E8DED2] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="CBTL Logo" className="w-8 h-8 object-contain" />
                <span className="font-display font-bold text-sm text-[#351B38]">CBTL Pakistan</span>
              </div>
              <button
                ref={closeBtnRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-md text-[#2A1B17] hover:bg-[#F5F0E8] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-1 flex-1">
              {navItems.map((item) => {
                const active = isItemActive(item);
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isAccordionOpen = openMobileAccordions[item.label];

                if (hasChildren) {
                  return (
                    <div key={item.label} className="border-b border-[#E8DED2]/60 pb-1 mb-1">
                      <div className="flex items-center justify-between">
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex-1 py-2.5 px-3 text-xs uppercase tracking-wider font-bold rounded-md transition-colors ${
                            active ? 'text-[#4B274F] bg-[#E8DED2]/60' : 'text-[#2A1B17] hover:text-[#4B274F]'
                          }`}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileAccordion(item.label)}
                          className="p-2 text-[#4B274F] hover:bg-[#E8DED2]/60 rounded-md cursor-pointer"
                          aria-label={`Toggle ${item.label} submenu`}
                        >
                          {isAccordionOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>

                      {isAccordionOpen && (
                        <div className="pl-6 pr-2 py-1.5 space-y-1 bg-white/70 border-l-2 border-[#4B274F] ml-3 mb-2 rounded-r-md animate-in fade-in duration-200">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 px-2 text-xs font-semibold uppercase tracking-wider text-[#2A1B17] hover:text-[#4B274F]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2.5 px-3 text-xs uppercase tracking-wider font-bold rounded-md transition-colors ${
                      active ? 'text-[#4B274F] bg-[#E8DED2]/60' : 'text-[#2A1B17] hover:text-[#4B274F]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer: Cart Action */}
            <div className="p-4 border-t border-[#E8DED2] bg-white space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({totalItems})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= GLOBAL SEARCH MODAL ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="bg-[#F5F0E8] border border-[#E8DED2] rounded-lg max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DED2] pb-3">
              <h3 className="font-display font-bold text-base text-[#351B38]">Search CBTL Catalog</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-[#6B4A3A] hover:text-[#2A1B17] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee beans, artisan teas, cakes, beverages, food..."
                className="w-full bg-white border border-[#E8DED2] rounded-md pl-9 pr-4 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
              />
              <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3 top-3" />
            </form>

            {/* Results Preview */}
            {isSearching ? (
              <p className="text-xs text-[#6B4A3A] text-center py-4">Searching catalog...</p>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-[#E8DED2] max-h-64 overflow-y-auto bg-white rounded-md border border-[#E8DED2]">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to={item.product_type === 'beverage' ? `/beverage/${item.slug}` : item.product_type === 'food' ? `/food/${item.slug}` : item.product_type === 'tea' ? `/tea/${item.slug}` : item.product_type === 'cake' ? `/cake-to-go/${item.slug}` : `/coffee/${item.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-[#F5F0E8] transition-colors"
                  >
                    <img
                      src={item.image || '/placeholder-coffee.jpg'}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded-md border border-[#E8DED2] p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[#4B274F] block">
                        {item.category || item.product_type}
                      </span>
                      <h4 className="font-bold text-xs text-[#351B38] truncate">{item.name}</h4>
                    </div>
                    {item.price && (
                      <span className="text-xs font-bold text-[#4B274F]">
                        Rs. {Number(item.price).toLocaleString()}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <p className="text-xs text-[#6B4A3A] text-center py-4">No matching products found.</p>
            ) : null}

          </div>
        </div>
      )}
    </>
  );
}
