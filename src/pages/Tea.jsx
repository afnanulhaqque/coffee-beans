import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Tea() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchTeaProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products?category=tea&limit=50');
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to load tea collection', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeaProducts();
  }, []);

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category_slug || '').toLowerCase();
        if (activeFilter === 'black') return name.includes('black') || name.includes('breakfast') || name.includes('earl grey') || name.includes('assam') || name.includes('darjeeling') || cat.includes('black');
        if (activeFilter === 'green') return name.includes('green') || name.includes('sencha') || name.includes('jasmine') || name.includes('dragon') || cat.includes('green');
        if (activeFilter === 'herbal') return name.includes('herbal') || name.includes('mint') || name.includes('chamomile') || name.includes('berries') || name.includes('rooibos') || cat.includes('herbal');
        if (activeFilter === 'oolong') return name.includes('oolong') || name.includes('p-erh') || name.includes('ting') || name.includes('dong');
        if (activeFilter === 'chai') return name.includes('chai');
        return true;
      });

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-12 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          HAND-PLUCKED WHOLE LEAF
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#24150F] tracking-tight">
          Artisan Whole Leaf Tea
        </h1>
        <p className="text-xs sm:text-sm text-[#756A62] font-normal leading-relaxed">
          Crafted exclusively from the top two leaves and a bud. Explore single-estate black teas, delicate green teas, fragrant oolongs, and calming caffeine-free herbal infusions.
        </p>
      </div>

      {/* Tea Filter Switcher */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 border-b border-[#EDE4D8]">
        {[
          { label: 'All Whole Leaf Teas', value: 'all' },
          { label: 'Black Teas', value: 'black' },
          { label: 'Green Teas', value: 'green' },
          { label: 'Herbal Infusions', value: 'herbal' },
          { label: 'Oolong & Reserve', value: 'oolong' },
          { label: 'Chai Spiced', value: 'chai' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm shrink-0 transition-colors ${
              activeFilter === tab.value
                ? 'bg-[#24150F] text-[#F6F1E9]'
                : 'bg-white border border-[#EDE4D8] text-[#5A3825] hover:bg-[#EDE4D8]'
            }`}
          >
            {tab.label}
          </button>
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
          <h3 className="font-display text-2xl text-[#24150F]">No teas found</h3>
          <p className="text-xs text-[#756A62] font-normal">Explore all artisan tea blends.</p>
          <button onClick={() => setActiveFilter('all')} className="inline-block px-5 py-2.5 bg-[#24150F] text-white text-xs font-semibold uppercase tracking-widest rounded-sm">
            View All Teas
          </button>
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
