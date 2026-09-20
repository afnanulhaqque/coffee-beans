import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Compass, 
  ChevronRight, 
  Wifi, 
  Car, 
  Utensils, 
  ShoppingBag,
  List,
  Map as MapIcon,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';

// Fallback Stores for CBTL Pakistan (33 official locations)
const FALLBACK_STORES = [
  { id: 7, name: 'F-11 Markaz', address: 'Shop 23, Olympus Mall, F-11 Markaz, Islamabad', city: 'Islamabad', phone: '051 8460200', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.6844, longitude: 72.9885, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 8, name: 'F-6 Markaz', address: 'Plot 16-A, Mountain View Plaza, F-6 Markaz, Islamabad', city: 'Islamabad', phone: '051 8467900', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.7297, longitude: 73.0768, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 9, name: 'I-8 Markaz', address: 'Plot # 17 & 18, I-8 Markaz, Islamabad', city: 'Islamabad', phone: '051 8892429', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.6685, longitude: 73.0761, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 10, name: 'Bahria Town Islamabad', address: 'Phase 7, Bahria Town Expressway, Islamabad', city: 'Islamabad', phone: '051 8355507', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.5358, longitude: 73.1205, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 11, name: 'Elysium Tower', address: 'Opposite Centaurus, Elysium Tower, Islamabad', city: 'Islamabad', phone: '051 6167272', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.7081, longitude: 73.0519, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 12, name: 'Zarpar Orchard D12', address: 'D12 Markaz, Islamabad', city: 'Islamabad', phone: '051 2750276', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.7198, longitude: 72.9554, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 13, name: 'PSO Capri F-7', address: 'Jinnah Super, F-7, Islamabad', city: 'Islamabad', phone: '051 2744984', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.7215, longitude: 73.0558, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 14, name: 'PSO Islamabad Expressway', address: 'PSO Islamabad Expressway, Islamabad', city: 'Islamabad', phone: '051 6107528', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.6421, longitude: 73.1092, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 15, name: 'AJ Towers', address: 'Gulberg Greens, Islamabad', city: 'Islamabad', phone: '051 8824934', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.6062, longitude: 73.1345, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 16, name: 'Civic Mall', address: 'Bahria Town, Phase 04, Islamabad', city: 'Islamabad', phone: '051 8460200', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.5684, longitude: 73.1052, province: 'Federal Capital', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 17, name: 'Saddar Rawalpindi', address: 'Ground Floor, Madison Square Mall, Near GPO, Saddar, Rawalpindi', city: 'Rawalpindi', phone: '051 6162606', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.5975, longitude: 73.0543, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 18, name: 'Bahria Town Rawalpindi', address: 'Rizvi Plaza, Talwar Chowk, Bahria Town, Rawalpindi', city: 'Rawalpindi', phone: '051 8355507', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.5412, longitude: 73.1167, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 19, name: 'Gulberg Fountain', address: 'Avenue, Main Boulevard, Gulberg, Lahore', city: 'Lahore', phone: '042 38911007', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.5204, longitude: 74.3587, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 20, name: 'Packages Mall', address: 'Walton Road, Packages Mall, Lahore', city: 'Lahore', phone: '042 38912490', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4744, longitude: 74.3592, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 21, name: 'DHA Phase 5', address: 'Plot 20-A, Commercial Area, Main Boulevard, DHA Phase 5, Lahore', city: 'Lahore', phone: '042 37182933', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4645, longitude: 74.4089, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 22, name: 'Phase 2 Johar Town', address: 'Block N, Phase 2, Johar Town, Lahore', city: 'Lahore', phone: '042 32290489', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4697, longitude: 74.2728, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 23, name: 'Thokar Niaz Baig', address: 'Attock Fuel Station, Thokar Niaz Baig, Lahore', city: 'Lahore', phone: '042 32800004', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4702, longitude: 74.2384, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 24, name: 'Downtown Hotel & Residences', address: 'Liberty Roundabout, Downtown Hotel & Residences, Lahore', city: 'Lahore', phone: '042 37897444', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.5126, longitude: 74.3438, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 25, name: 'PSO Girja Chowk', address: 'PSO, Girja Chowk, Cantt, Lahore', city: 'Lahore', phone: '042 37250399', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.5497, longitude: 74.3912, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 26, name: 'Defense Raya', address: '85 Fairways Commercial, DHA Phase VI, Lahore', city: 'Lahore', phone: '042 34551243', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4398, longitude: 74.4532, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 27, name: 'Bahria Town Lahore', address: 'Rizvi Plaza, Talwar Chowk, Bahria Town, Lahore', city: 'Lahore', phone: '042 37450703', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.3687, longitude: 74.1812, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 28, name: 'Lake City', address: 'Block M 1, Lake City, Lahore', city: 'Lahore', phone: '042 32321422', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.3854, longitude: 74.2498, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 29, name: 'Z Block DHA Phase III', address: 'Z Block Commercial Area, DHA Phase III, Lahore', city: 'Lahore', phone: '042 34551932', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4795, longitude: 74.3854, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 30, name: 'DHA Phase 6 Karachi', address: '12-C, Main Khayaban-e-Bukhari, DHA Phase 6, Karachi', city: 'Karachi', phone: '021 33399587', opening_hours: '8:00 AM - 1:00 AM', latitude: 24.7932, longitude: 67.0654, province: 'Sindh', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 31, name: 'Marine Tower', address: 'Plot # 9, Block 4, Clifton, Karachi', city: 'Karachi', phone: '021 33393383', opening_hours: '8:00 AM - 1:00 AM', latitude: 24.8189, longitude: 67.0287, province: 'Sindh', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 32, name: 'Tipu Sultan', address: 'Remmco Tower, Tipu Sultan Road, Karachi', city: 'Karachi', phone: '021 33406562', opening_hours: '8:00 AM - 1:00 AM', latitude: 24.8698, longitude: 67.0854, province: 'Sindh', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 33, name: 'Byco Sea View', address: 'DHA V, Karachi', city: 'Karachi', phone: '021 33409134', opening_hours: '8:00 AM - 1:00 AM', latitude: 24.7895, longitude: 67.0421, province: 'Sindh', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 34, name: 'Faisalabad', address: '7th Faisal Lane, Civil Lines, Adjacent Sitara Tower, Faisalabad', city: 'Faisalabad', phone: '041 5486161', opening_hours: '8:00 AM - 1:00 AM', latitude: 31.4187, longitude: 73.0791, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 35, name: 'Mall of Gujranwala', address: 'Grand Trunk Road, Mall of Gujranwala', city: 'Gujranwala', phone: '055 8026182', opening_hours: '8:00 AM - 1:00 AM', latitude: 32.1876, longitude: 74.1945, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 36, name: 'Jhelum', address: 'G.T Road, Adjacent Tulip Hotel, Jhelum', city: 'Jhelum', phone: '0544 620000', opening_hours: '8:00 AM - 1:00 AM', latitude: 32.9405, longitude: 73.7276, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 37, name: 'Murree', address: 'Lower Topa, Murree Expressway', city: 'Murree', phone: '051 8460200', opening_hours: '8:00 AM - 1:00 AM', latitude: 33.8954, longitude: 73.4187, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 38, name: 'Bhera Service Area', address: 'Bhera Service Area, North & South, M-2 Motorway', city: 'Bhera', phone: '051 8460200', opening_hours: '24 Hours', latitude: 32.4821, longitude: 72.9154, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
  { id: 39, name: 'Sialkot Cantonment', address: 'Aziz Bhatti Shaheed Road, Sialkot Cantonment, Sialkot', city: 'Sialkot', phone: '052 4292949', opening_hours: '8:00 AM - 1:00 AM', latitude: 32.5087, longitude: 74.5387, province: 'Punjab', dine_in: true, takeaway: true, wifi: true, parking: true },
];

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
    let isMounted = true;
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
        let loadedStores = res?.data?.stores || [];
        
        // If API returns empty, use client fallback list
        if (!loadedStores || loadedStores.length === 0) {
          loadedStores = FALLBACK_STORES;
          if (activeCity !== 'all') {
            loadedStores = loadedStores.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
          }
          if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            loadedStores = loadedStores.filter(s => 
              (s.name && s.name.toLowerCase().includes(q)) ||
              (s.address && s.address.toLowerCase().includes(q)) ||
              (s.city && s.city.toLowerCase().includes(q)) ||
              (s.phone && s.phone.toLowerCase().includes(q))
            );
          }
        }

        if (isMounted) {
          setStores(loadedStores);
          const distinctCities = res?.data?.cities && res.data.cities.length > 0 
            ? res.data.cities 
            : [...new Set(FALLBACK_STORES.map(s => s.city))].sort();
          setCities(distinctCities);
        }
      } catch (err) {
        console.error('Failed to load store locations, using fallbacks', err);
        if (isMounted) {
          let fallback = FALLBACK_STORES;
          if (activeCity !== 'all') {
            fallback = fallback.filter(s => s.city.toLowerCase() === activeCity.toLowerCase());
          }
          if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            fallback = fallback.filter(s => 
              (s.name && s.name.toLowerCase().includes(q)) ||
              (s.address && s.address.toLowerCase().includes(q)) ||
              (s.city && s.city.toLowerCase().includes(q))
            );
          }
          setStores(fallback);
          setCities([...new Set(FALLBACK_STORES.map(s => s.city))].sort());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStores();
    return () => {
      isMounted = false;
    };
  }, [activeCity, searchQuery, userLocation]);

  // Clean up Leaflet map instance on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;

    // Check if DOM container already has Leaflet ID attached (e.g. from hot-reloads)
    if (!mapInstanceRef.current) {
      if (mapRef.current._leaflet_id) {
        delete mapRef.current._leaflet_id;
      }

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

    // Invalidate map size after mobile view toggle or layout render
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const validStores = stores.filter((s) => s.latitude && s.longitude);
    const bounds = L.latLngBounds([]);

    validStores.forEach((store) => {
      const isSelected = selectedStore && selectedStore.id === store.id;
      const lat = Number(store.latitude);
      const lng = Number(store.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const marker = L.marker([lat, lng], {
        icon: createCustomMarker(isSelected),
      }).addTo(map);

      const googleMapsLink = store.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'font-body p-2 space-y-1.5 text-xs text-[#2A1B17]';
      popupContent.innerHTML = `
        <span class="text-[9px] uppercase tracking-wider font-bold text-[#4B274F] block">${store.city || ''}</span>
        <h4 class="font-display font-bold text-sm text-[#351B38] m-0">${store.name || ''}</h4>
        <p class="text-[11px] text-[#6B4A3A] m-0">${store.address || 'Address available in store list'}</p>
        ${store.phone ? `<p class="text-[11px] font-semibold text-[#4B274F] m-0">📞 ${store.phone}</p>` : ''}
        <div class="pt-2">
          <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer" 
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
      bounds.extend([lat, lng]);
    });

    if (validStores.length > 0 && !selectedStore && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [stores, selectedStore, mobileView]);

  // Handle store card selection
  const handleSelectStore = (store) => {
    setSelectedStore(store);
    const lat = Number(store.latitude);
    const lng = Number(store.longitude);
    if (!isNaN(lat) && !isNaN(lng) && mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15, {
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
            <div className="space-y-4 max-h-175 overflow-y-auto pr-1">
              {stores.map((store) => {
                const isSelected = selectedStore && selectedStore.id === store.id;
                const status = store.current_status || {};
                const hoursText = typeof status.status_text === 'string' && status.status_text
                  ? status.status_text
                  : typeof store.opening_hours === 'string' && store.opening_hours
                  ? store.opening_hours
                  : '8:00 AM - 1:00 AM';

                const mapsUrl = store.google_maps_url || (
                  store.latitude && store.longitude
                    ? `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((store.name || '') + ' ' + (store.address || '') + ' ' + (store.city || ''))}`
                );

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
                          status.is_open !== false ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {status.badge || (status.is_open !== false ? 'Open' : 'Closed')}
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
                          {hoursText}
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
                        href={mapsUrl}
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
              className="w-full h-125 sm:h-162.5 z-10"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
