import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Coffee, MapPin, Sparkles, ArrowRight, Utensils, GlassWater } from 'lucide-react';
import api from '../services/api';

export default function CafeMenu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('All');
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await api.get('/cafe-menu');
        const cats = res.data.categories || [];
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load cafe menu', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Hash listener for #beverages and #food
  useEffect(() => {
    if (location.hash === '#beverages') {
      setSelectedSection('Beverages');
      const el = document.getElementById('beverages');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#food') {
      setSelectedSection('Food');
      const el = document.getElementById('food');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedSection('All');
    }
  }, [location.hash]);

  const beverageCategories = categories.filter((c) => 
    ['brewed', 'espresso', 'ice-blended', 'tea-latte', 'non-coffee'].includes(c.slug) ||
    c.name.toLowerCase().includes('coffee') ||
    c.name.toLowerCase().includes('tea') ||
    c.name.toLowerCase().includes('ice blended') ||
    c.name.toLowerCase().includes('espresso')
  );

  const foodCategories = categories.filter((c) => 
    !['brewed', 'espresso', 'ice-blended', 'tea-latte', 'non-coffee'].includes(c.slug) &&
    !c.name.toLowerCase().includes('coffee') &&
    !c.name.toLowerCase().includes('tea') &&
    !c.name.toLowerCase().includes('ice blended') &&
    !c.name.toLowerCase().includes('espresso')
  );

  const filterSections = ['All', 'Beverages', 'Food', ...categories.map((c) => c.name)];

  const displayedCategories = selectedSection === 'All'
    ? categories
    : selectedSection === 'Beverages'
      ? beverageCategories
      : selectedSection === 'Food'
        ? foodCategories
        : categories.filter((c) => c.name === selectedSection);

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-12 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          IN-STORE DINING &amp; BEVERAGES
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#24150F] tracking-tight">
          The Cafe Menu
        </h1>
        <p className="text-xs sm:text-sm text-[#756A62] font-normal leading-relaxed">
          Crafted fresh by our baristas and culinary team. Handcrafted espresso beverages, our world-famous Original Ice Blended® drinks, whole leaf tea lattes, and gourmet kitchen favorites.
        </p>
      </div>

      {/* Main Section Filter Tabs (All / Beverages / Food) */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 border-b border-[#EDE4D8]">
        {['All', 'Beverages', 'Food'].map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm shrink-0 transition-colors ${
              selectedSection === sec
                ? 'bg-[#24150F] text-[#F6F1E9]'
                : 'bg-white border border-[#EDE4D8] text-[#5A3825] hover:bg-[#EDE4D8]'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Categories Sections */}
      {loading ? (
        <div className="p-20 text-center text-xs font-semibold text-[#756A62]">Loading cafe menu...</div>
      ) : (
        <div className="space-y-16">
          <div id="beverages" />
          <div id="food" />

          {displayedCategories.map((cat) => (
            <div key={cat.id} className="space-y-8">
              
              <div className="border-b border-[#EDE4D8] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-medium text-[#B8895B] block">
                    CATEGORY
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
                    {cat.name}
                  </h2>
                </div>
                {cat.description && (
                  <p className="hidden sm:block text-xs text-[#756A62] max-w-xs text-right font-normal">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(cat.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-white border border-[#EDE4D8] rounded-sm flex flex-col justify-between space-y-4 hover:border-[#B8895B] transition-colors shadow-xs group"
                  >
                    {item.image && (
                      <div className="aspect-16/10 bg-[#24150F] rounded-xs overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-base text-[#24150F]">
                            {item.name}
                          </h3>
                          {item.is_popular && (
                            <span className="px-2 py-0.5 bg-[#EDE4D8] text-[#5A3825] text-[9px] uppercase tracking-wider font-semibold rounded-xs shrink-0">
                              Popular
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-[#756A62] leading-relaxed mt-1 font-normal">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#EDE4D8] text-xs">
                        <span className="font-bold text-sm text-[#24150F]">
                          Rs. {item.price?.toLocaleString()}
                        </span>
                        {item.calories && (
                          <span className="text-[11px] font-mono text-[#756A62]">
                            {item.calories}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Dine In Atmosphere Callout */}
      <div className="p-8 sm:p-12 bg-[#EDE4D8]/80 border border-[#EDE4D8] text-[#1C1714] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display text-2xl text-[#24150F]">
            Freshly Prepared For You In-Store
          </h3>
          <p className="text-xs sm:text-sm text-[#5A3825] max-w-xl font-normal leading-relaxed">
            All beverages and meals are handcrafted upon order using freshly roasted beans, whole leaf teas, and fresh ingredients.
          </p>
        </div>
        <Link
          to="/store-locator/"
          className="px-6 py-3.5 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shrink-0 shadow-xs flex items-center gap-2"
        >
          Find Nearest Store <ArrowRight className="w-4 h-4 text-[#B8895B]" />
        </Link>
      </div>

    </div>
  );
}
