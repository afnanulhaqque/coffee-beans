import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Coffee as CoffeeIcon, ChevronRight } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Coffee() {
  const { subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchCoffeeData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?category=coffee&limit=50'),
        ]);

        const allCats = catRes.data.categories || [];
        const coffeeMain = allCats.find((c) => c.slug === 'coffee');
        if (coffeeMain && coffeeMain.children) {
          setSubcategories(coffeeMain.children);
        }

        setProducts(prodRes.data.products || []);
      } catch (err) {
        console.error('Failed to load coffee collection', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoffeeData();
  }, []);

  const activeSub = subcategory || 'all';

  const filteredProducts = activeSub === 'all'
    ? products
    : products.filter((p) => {
        const catSlug = p.category_slug || '';
        const name = (p.name || '').toLowerCase();
        const roast = (p.roast_level || '').toLowerCase();
        
        if (activeSub === 'light-distinctive') return roast.includes('light') || name.includes('light') || catSlug.includes('light');
        if (activeSub === 'rich-smooth') return roast.includes('medium') || name.includes('colombia') || catSlug.includes('rich');
        if (activeSub === 'medium-smooth') return roast.includes('medium') || name.includes('house blend') || catSlug.includes('medium');
        if (activeSub === 'dark-distinctive') return roast.includes('dark') || name.includes('espresso') || name.includes('vienna') || name.includes('sumatra') || catSlug.includes('dark');
        if (activeSub === 'decaffeinated') return roast.includes('decaf') || name.includes('decaf') || catSlug.includes('decaf');
        if (activeSub === 'flavoured-coffee') return roast.includes('flavour') || name.includes('vanilla') || name.includes('hazelnut') || catSlug.includes('flavour');
        if (activeSub === 'reserved') return name.includes('kona') || catSlug.includes('reserved');
        
        return catSlug === activeSub;
      });

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-12 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          100% WHOLE BEAN ARABICA
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#24150F] tracking-tight">
          The Coffee Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#756A62] font-normal leading-relaxed">
          Sourced from high-elevation estates around the world. Roasted with precision in small batches to celebrate distinctive single-origin profiles and balanced signature blends.
        </p>
      </div>

      {/* Subcategory Roast Profile Switcher */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 border-b border-[#EDE4D8]">
        <Link
          to="/shop/coffee"
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm shrink-0 transition-colors ${
            activeSub === 'all'
              ? 'bg-[#24150F] text-[#F6F1E9]'
              : 'bg-white border border-[#EDE4D8] text-[#5A3825] hover:bg-[#EDE4D8]'
          }`}
        >
          All Roasts
        </Link>
        {[
          { label: 'Light & Distinctive', slug: 'light-distinctive' },
          { label: 'Rich & Smooth', slug: 'rich-smooth' },
          { label: 'Medium & Smooth', slug: 'medium-smooth' },
          { label: 'Dark & Distinctive', slug: 'dark-distinctive' },
          { label: 'Decaffeinated', slug: 'decaffeinated' },
          { label: 'Flavoured Coffee', slug: 'flavoured-coffee' },
          { label: 'Reserved', slug: 'reserved' },
        ].map((sub) => (
          <Link
            key={sub.slug}
            to={`/shop/coffee/${sub.slug}`}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm shrink-0 transition-colors ${
              activeSub === sub.slug
                ? 'bg-[#24150F] text-[#F6F1E9]'
                : 'bg-white border border-[#EDE4D8] text-[#5A3825] hover:bg-[#EDE4D8]'
            }`}
          >
            {sub.label}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-[#EDE4D8]/50 h-96 animate-pulse rounded-sm" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white border border-[#EDE4D8] rounded-sm max-w-md mx-auto">
          <h3 className="font-display text-2xl text-[#24150F]">No roasts found</h3>
          <p className="text-xs text-[#756A62] font-normal">Explore all our whole bean offerings.</p>
          <Link to="/shop/coffee" className="inline-block px-5 py-2.5 bg-[#24150F] text-white text-xs font-semibold uppercase tracking-widest rounded-sm">
            View All Roasts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
}
