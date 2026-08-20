import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Wifi, Navigation, Coffee, ExternalLink, Search } from 'lucide-react';
import api from '../services/api';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await api.get('/stores');
        const list = res.data.stores || [];
        setStores(list);
        if (list.length > 0) {
          setSelectedStore(list[0]);
        }
      } catch (err) {
        console.error('Failed to load stores', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const cities = ['All', 'Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Faisalabad', 'Gujranwala', 'Sialkot'];

  const filteredStores = selectedCity === 'All'
    ? stores
    : stores.filter((s) => s.city?.toLowerCase() === selectedCity.toLowerCase());

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-12 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          NATIONWIDE COFFEE LOUNGES
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#24150F] tracking-tight">
          Find Your Coffee Place
        </h1>
        <p className="text-xs sm:text-sm text-[#756A62] font-normal leading-relaxed">
          From bustling flagship roasteries in Karachi and Lahore to quiet neighborhood lounges in Islamabad and Rawalpindi. Find opening hours, directions, and cafe amenities.
        </p>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 border-b border-[#EDE4D8]">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedCity(city);
              const firstMatch = city === 'All' ? stores[0] : stores.find(s => s.city?.toLowerCase() === city.toLowerCase());
              if (firstMatch) setSelectedStore(firstMatch);
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm shrink-0 transition-colors ${
              selectedCity === city
                ? 'bg-[#24150F] text-[#F6F1E9]'
                : 'bg-white border border-[#EDE4D8] text-[#5A3825] hover:bg-[#EDE4D8]'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Main Split Layout: Store Directory (Left) & Active Store Spotlight (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Store Cards List (Span 6) */}
        <div className="lg:col-span-6 space-y-4 max-h-187.5 overflow-y-auto pr-2">
          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-[#756A62]">Loading store locations...</div>
          ) : filteredStores.length === 0 ? (
            <div className="p-12 bg-white border border-[#EDE4D8] rounded-sm text-center text-xs text-[#756A62] font-normal">
              No stores listed for {selectedCity} yet.
            </div>
          ) : (
            filteredStores.map((s) => {
              const isSelected = selectedStore?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStore(s)}
                  className={`p-6 bg-white border rounded-sm transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-[#24150F] ring-1 ring-[#24150F] shadow-xs'
                      : 'border-[#EDE4D8] hover:border-[#B8895B]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-medium text-[#B8895B] block">
                        {s.city}
                      </span>
                      <h3 className="font-semibold text-lg text-[#24150F]">
                        {s.name}
                      </h3>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 bg-[#24150F] text-[#F6F1E9] text-[9px] uppercase tracking-wider font-semibold rounded-sm">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#5A3825] leading-relaxed font-normal">{s.address}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EDE4D8] text-[11px] text-[#756A62]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B8895B]" />
                      <span className="truncate">{s.opening_hours || '8:00 AM - Midnight'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B8895B]" />
                      <span>{s.phone || '+92 21 111 232 675'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Store Feature Spotlight & Map (Span 6) */}
        {selectedStore && (
          <div className="lg:col-span-6 bg-white border border-[#EDE4D8] rounded-sm p-6 sm:p-8 space-y-6 lg:sticky lg:top-32 shadow-xs">
            {/* Store Photo */}
            <div className="aspect-16/10 bg-[#24150F] rounded-sm overflow-hidden relative">
              <img
                src={selectedStore.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80'}
                alt={selectedStore.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <span className="font-display text-2xl text-white">
                  {selectedStore.name}
                </span>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-4 text-xs text-[#5A3825]">
              <div>
                <span className="text-[10px] uppercase font-medium text-[#756A62] block">Address</span>
                <p className="font-semibold text-[#24150F] text-sm mt-0.5">{selectedStore.address}</p>
                <span className="text-xs text-[#756A62] font-normal">{selectedStore.city}, Pakistan</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#EDE4D8]">
                <div>
                  <span className="text-[10px] uppercase font-medium text-[#756A62] block">Operating Hours</span>
                  <p className="font-semibold text-[#24150F] mt-0.5">{selectedStore.opening_hours}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-medium text-[#756A62] block">Helpline / Phone</span>
                  <p className="font-semibold text-[#24150F] mt-0.5">{selectedStore.phone}</p>
                </div>
              </div>

              {selectedStore.features && (
                <div className="pt-2 border-t border-[#EDE4D8]">
                  <span className="text-[10px] uppercase font-medium text-[#756A62] block mb-1.5">Amenities</span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedStore.features) ? selectedStore.features : selectedStore.features.split(',')).map((f, i) => (
                      <span key={i} className="px-2.5 py-1 bg-[#F6F1E9] border border-[#EDE4D8] text-[11px] font-medium text-[#24150F] rounded-sm flex items-center gap-1.5">
                        <Coffee className="w-3 h-3 text-[#B8895B]" /> {f.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Google Maps Directions Button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${selectedStore.name} ${selectedStore.address} ${selectedStore.city}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury flex items-center justify-center gap-2 shadow-xs"
            >
              <Navigation className="w-4 h-4 text-[#B8895B]" /> Get Driving Directions
            </a>
          </div>
        )}

      </div>

    </div>
  );
}
