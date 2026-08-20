import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Compass, 
  Check, 
  ChevronRight, 
  Wifi, 
  Car, 
  Utensils, 
  ShoppingBag,
  Layers,
  List,
  Map as MapIcon,
  ExternalLink
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';

// Custom Map Marker Icon for CBTL
const createCustomMarker = (isSelected = false) => {
  const bg = isSelected ? '#351B38' : '#4B274F';
  const size = isSelected ? 38 : 32;
  return L.divIcon({
    className: 'custom-cbtl-marker',
    html: `
      <div style="
        background-color: ${bg};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        font-size: 14px;
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
      ">
        ☕
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeCity, setActiveCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'map'

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Fetch initial stores and cities
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCity !== 'all') params.city = activeCity;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (userLocation) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        const res = await api.get('/stores', { params });
        setStores(res.data.stores || []);
        if (res.data.cities && res.data.cities.length > 0) {
          setCities(res.data.cities);
        }
      } catch (err) {
        console.error('Failed to load store locations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [activeCity, searchQuery, userLocation]);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Pakistan (Islamabad / Lahore region)
      const map = L.map(mapRef.current, {
        center: [33.7297, 73.0768],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const validStores = stores.filter((s) => s.latitude && s.longitude);
    const bounds = L.latLngBounds([]);

    validStores.forEach((store) => {
      const isSelected = selectedStore && selectedStore.id === store.id;
      const marker = L.marker([store.latitude, store.longitude], {
        icon: createCustomMarker(isSelected),
      }).addTo(map);

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'font-body p-2 space-y-1.5 text-xs text-[#2A1B17]';
      popupContent.innerHTML = `
        <span class="text-[9px] uppercase tracking-wider font-bold text-[#4B274F] block">${store.city}</span>
        <h4 class="font-display font-bold text-sm text-[#351B38] m-0">${store.name}</h4>
        <p class="text-[11px] text-[#6B4A3A] m-0">${store.address || 'Address available in store list'}</p>
        ${store.phone ? `<p class="text-[11px] font-semibold text-[#4B274F] m-0">📞 ${store.phone}</p>` : ''}
        <div class="pt-2">
          <a href="${store.google_maps_url}" target="_blank" rel="noopener noreferrer" 
             style="display: inline-block; background-color: #4B274F; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 9px; text-decoration: none;">
            Get Directions
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedStore(store);
      });

      markersRef.current[store.id] = marker;
      bounds.extend([store.latitude, store.longitude]);
    });

    if (validStores.length > 0 && !selectedStore) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [stores, selectedStore]);

  // Handle store card selection
  const handleSelectStore = (store) => {
    setSelectedStore(store);
    if (store.latitude && store.longitude && mapInstanceRef.current) {
      mapInstanceRef.current.setView([store.latitude, store.longitude], 15, {
        animate: true,
        duration: 0.8,
      });

      const marker = markersRef.current[store.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 13, {
            animate: true,
          });

          L.circleMarker([coords.lat, coords.lng], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .addTo(mapInstanceRef.current)
            .bindPopup('You are here')
            .openPopup();
        }
      },
      (err) => {
        setLocating(false);
        setLocError('Unable to retrieve your location. Please check browser permissions.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#2A1B17] font-body">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#4B274F] block">
          FIND YOUR NEAREST CAFE
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#351B38]">
          Store Locator
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A]">
          Discover all 33 official The Coffee Bean &amp; Tea Leaf locations across Pakistan.
        </p>
      </div>

      {/* Toolbar: City Filters + Search + Geolocation */}
      <div className="bg-white border border-[#E8DED2] p-4 sm:p-5 rounded-md space-y-4 shadow-xs">
        
        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <button
            onClick={() => setActiveCity('all')}
            className={`px-4 py-2 rounded-md text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              activeCity === 'all'
                ? 'bg-[#4B274F] text-white shadow-xs'
                : 'bg-[#F5F0E8] text-[#2A1B17] hover:bg-[#E8DED2]'
            }`}
          >
            All Cities ({stores.length})
          </button>

          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCity(c)}
              className={`px-4 py-2 rounded-md text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activeCity === c
                  ? 'bg-[#4B274F] text-white shadow-xs'
                  : 'bg-[#F5F0E8] text-[#2A1B17] hover:bg-[#E8DED2]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Bar & Geolocation Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by branch name, address, area, or phone..."
              className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-9 pr-4 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
            />
            <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3 top-3" />
          </div>

          <button
            onClick={handleUseMyLocation}
            disabled={locating}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border-2 border-[#4B274F] hover:bg-[#4B274F] text-[#4B274F] hover:text-white rounded-md text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Locating...' : 'Use My Location'}
          </button>
        </div>

        {locError && (
          <p className="text-xs text-red-600 font-semibold">{locError}</p>
        )}
      </div>

      {/* Mobile Toggle Switcher (List vs Map) */}
      <div className="flex sm:hidden rounded-md border border-[#E8DED2] bg-white p-1">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'list' ? 'bg-[#4B274F] text-white shadow-xs' : 'text-[#2A1B17]'
          }`}
        >
          <List className="w-3.5 h-3.5" /> List View ({stores.length})
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileView === 'map' ? 'bg-[#4B274F] text-white shadow-xs' : 'text-[#2A1B17]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" /> Map View
        </button>
      </div>

      {/* Main 2-Column Presentation: Store List (40%) + Interactive Map (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Store Cards (Span 5 on Desktop) */}
        <div className={`lg:col-span-5 space-y-4 ${mobileView === 'map' ? 'hidden sm:block' : 'block'}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B4A3A]">
              {stores.length} Locations Available
            </span>
            {userLocation && (
              <span className="text-[11px] font-semibold text-[#4B274F]">
                Sorted by Distance
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-[#E8DED2] p-5 rounded-md space-y-3 h-40" />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="p-8 bg-white border border-[#E8DED2] rounded-md text-center space-y-2">
              <MapPin className="w-8 h-8 text-[#6B4A3A] mx-auto opacity-50" />
              <h3 className="font-display font-bold text-base text-[#351B38]">No Branches Found</h3>
              <p className="text-xs text-[#6B4A3A]">Try selecting a different city or clearing your search query.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {stores.map((store) => {
                const isSelected = selectedStore && selectedStore.id === store.id;
                const status = store.current_status || {};

                return (
                  <div
                    key={store.id}
                    onClick={() => handleSelectStore(store)}
                    className={`bg-white border rounded-md p-5 transition-all cursor-pointer space-y-3 shadow-xs hover:border-[#4B274F] ${
                      isSelected
                        ? 'border-[#4B274F] ring-2 ring-[#4B274F]/20'
                        : 'border-[#E8DED2]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#4B274F] block">
                          {store.city} {store.province ? `• ${store.province}` : ''}
                        </span>
                        <h3 className="font-display text-base font-bold text-[#351B38]">
                          {store.name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-xs ${
                          status.is_open ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {status.badge || (status.is_open ? 'Open' : 'Closed')}
                        </span>
                        {store.distance_km !== null && store.distance_km !== undefined && (
                          <span className="text-[11px] font-bold text-[#4B274F] block mt-1">
                            {store.distance_km} km away
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address & Contact */}
                    <div className="space-y-1.5 text-xs text-[#6B4A3A]">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#4B274F] shrink-0 mt-0.5" />
                        <span>{store.address || 'Address listed in store directory'}</span>
                      </div>

                      {store.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#4B274F] shrink-0" />
                          <a
                            href={`tel:${store.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-[#2A1B17] hover:underline"
                          >
                            {store.phone}
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#4B274F] shrink-0" />
                        <span className="font-medium text-[#2A1B17]">
                          {status.status_text || store.opening_hours || '8:00 AM - 1:00 AM'}
                        </span>
                      </div>
                    </div>

                    {/* Services Chips */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 text-[10px] text-[#6B4A3A]">
                      {store.dine_in && (
                        <span className="px-2 py-0.5 bg-[#F5F0E8] rounded-xs flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-[#4B274F]" /> Dine-in
                        </span>
                      )}
                      {store.takeaway && (
                        <span className="px-2 py-0.5 bg-[#F5F0E8] rounded-xs flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-[#4B274F]" /> Takeaway
                        </span>
                      )}
                      {store.wifi && (
                        <span className="px-2 py-0.5 bg-[#F5F0E8] rounded-xs flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-[#4B274F]" /> Free Wi-Fi
                        </span>
                      )}
                      {store.parking && (
                        <span className="px-2 py-0.5 bg-[#F5F0E8] rounded-xs flex items-center gap-1">
                          <Car className="w-3 h-3 text-[#4B274F]" /> Parking
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    <div className="pt-2 border-t border-[#E8DED2] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleSelectStore(store)}
                        className="text-xs font-bold text-[#4B274F] hover:underline flex items-center gap-1"
                      >
                        View on Map <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={store.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-1.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Navigation className="w-3 h-3" /> Get Directions
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map (Span 7 on Desktop) */}
        <div className={`lg:col-span-7 sticky top-32 ${mobileView === 'list' ? 'hidden sm:block' : 'block'}`}>
          <div className="bg-white border border-[#E8DED2] rounded-md overflow-hidden shadow-md">
            <div 
              ref={mapRef} 
              className="w-full h-[500px] sm:h-[650px] z-10"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
