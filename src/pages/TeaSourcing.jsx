import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function TeaSourcing() {
  const teaGardens = [
    {
      region: 'Sri Lanka (Ceylon)',
      estate: 'Nuwara Eliya High-Grown',
      variety: 'Artisan Black & Earl Grey',
      elevation: '6,000 ft',
      notes: 'Bright golden liquor, brisk citrus notes, and refined floral bouquet.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    },
    {
      region: 'Japan',
      estate: 'Shizuoka Prefecture',
      variety: 'Steamed Sencha & Matcha',
      elevation: 'High Foothills of Mt. Fuji',
      notes: 'Sweet vegetal umami, vivid emerald infusion, and clean soothing finish.',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    },
    {
      region: 'Fujian & Taiwan',
      estate: 'Wuyi Mountains & Alishan',
      variety: 'Jasmine Dragon & Oolong',
      elevation: '4,000 – 5,500 ft',
      notes: 'Hand-rolled pearls layered with night-blooming jasmine flowers and honey notes.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-20 font-body text-[#2A1B17]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          HAND-PLUCKED WHOLE LEAF HARVESTING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#351B38] tracking-tight leading-tight">
          The Top Two Leaves <br />
          And A Tender Bud
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A3A] font-normal leading-relaxed max-w-2xl mx-auto">
          We never use machine-harvested dust or broken fannings. We hand-select only unbroken whole tea leaves from family-tended gardens to preserve essential oils and natural antioxidant vitality.
        </p>
      </div>

      {/* Main Tea Philosophy Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#E8DED2] rounded-md p-8 sm:p-14 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#2A1B17] rounded-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80"
            alt="Artisan Tea Cupping"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
            THE HARVEST STANDARD
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#351B38] leading-tight">
            Why Whole Leaf Tea Matters
          </h2>
          <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
            When whole tea leaves expand in hot water, they release rich natural tannins, delicate aromas, and natural sweetness without bitter astringency.
          </p>
          <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
            From first-flush Darjeelings to midnight-scented Jasmine pearls and whole chamomile blossoms, our tea master evaluates every harvest for leaf wholeness, liquor clarity, and aromatic persistence.
          </p>
        </div>
      </div>

      {/* 3 Tea Terroirs Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
            HERITAGE GARDENS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
            Our Tea Sourcing Gardens
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teaGardens.map((garden, idx) => (
            <div key={idx} className="bg-white border border-[#E8DED2] rounded-md overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="aspect-16/10 bg-[#2A1B17] overflow-hidden">
                <img src={garden.image} alt={garden.region} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#4B274F]">{garden.region}</span>
                    <span className="text-[11px] font-mono text-[#6B4A3A]">{garden.elevation}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#351B38]">{garden.variety}</h3>
                  <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">{garden.notes}</p>
                </div>
                <div className="pt-3 border-t border-[#E8DED2]">
                  <Link
                    to="/tea"
                    className="text-xs font-semibold uppercase tracking-wider text-[#2A1B17] hover:text-[#4B274F] flex items-center gap-1 transition-colors"
                  >
                    Shop This Blend <ArrowRight className="w-3.5 h-3.5 text-[#4B274F]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action card */}
      <div className="p-10 sm:p-14 bg-[#E8DED2]/40 border border-[#E8DED2] text-[#2A1B17] text-center space-y-5 rounded-md shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
          Explore Whole Leaf Tea Blends
        </h2>
        <p className="text-xs sm:text-sm text-[#6B4A3A] max-w-md mx-auto font-normal">
          From invigorating morning blacks to soothing caffeine-free herbal tisanes.
        </p>
        <div className="pt-2">
          <Link
            to="/tea"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md"
          >
            Explore Tea Catalog <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

    </div>
  );
}
