import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, Sparkles, ShieldCheck, Heart, ArrowRight, Sun, Droplets } from 'lucide-react';

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
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-20 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          HAND-PLUCKED WHOLE LEAF HARVESTING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#24150F] tracking-tight leading-tight">
          The Top Two Leaves <br />
          And A Tender Bud
        </h1>
        <p className="text-sm sm:text-base text-[#756A62] font-normal leading-relaxed max-w-2xl mx-auto">
          We never use machine-harvested dust or broken fannings. We hand-select only unbroken whole tea leaves from family-tended gardens to preserve essential oils and natural antioxidant vitality.
        </p>
      </div>

      {/* Main Tea Philosophy Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#EDE4D8] rounded-sm p-8 sm:p-14 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#24150F] rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80"
            alt="Artisan Tea Cupping"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#B8895B] block">
            THE HARVEST STANDARD
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#24150F] leading-tight">
            Why Whole Leaf Tea Matters
          </h2>
          <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
            When whole tea leaves expand in hot water, they release rich natural tannins, delicate aromas, and natural sweetness without bitter astringency.
          </p>
          <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
            From first-flush Darjeelings to midnight-scented Jasmine pearls and whole chamomile blossoms, our tea master evaluates every harvest for leaf wholeness, liquor clarity, and aromatic persistence.
          </p>
        </div>
      </div>

      {/* 3 Tea Terroirs Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
            HERITAGE GARDENS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
            Our Tea Sourcing Gardens
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teaGardens.map((garden, idx) => (
            <div key={idx} className="bg-white border border-[#EDE4D8] rounded-sm overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="aspect-16/10 bg-[#24150F] overflow-hidden">
                <img src={garden.image} alt={garden.region} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-semibold text-[#B8895B]">{garden.region}</span>
                    <span className="text-[11px] font-mono text-[#756A62]">{garden.elevation}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#24150F]">{garden.variety}</h3>
                  <p className="text-xs text-[#756A62] leading-relaxed font-normal">{garden.notes}</p>
                </div>
                <div className="pt-3 border-t border-[#EDE4D8]">
                  <Link
                    to="/shop/tea"
                    className="text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#B8895B] flex items-center gap-1 transition-colors"
                  >
                    Shop This Tea <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars of Whole Leaf Tea */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Leaf className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Top 2 Leaves &amp; Bud</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Only the tender, nutrient-dense new shoots are selected for delicate complexity.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Sun className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Single-Estate Gardens</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Traceable to specific high-elevation family gardens harvested during prime season.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Droplets className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Pure Essential Oils</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Unbroken whole leaves retain natural volatile aromatics and clean health benefits.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Heart className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Direct Trade Ethic</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Fair wages and organic farming standards supporting local tea farming communities.
          </p>
        </div>
      </div>

      {/* Call to action card */}
      <div className="p-10 sm:p-14 bg-[#EDE4D8]/80 border border-[#EDE4D8] text-[#1C1714] text-center space-y-5 rounded-sm shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
          Explore Whole Leaf Artisan Teas
        </h2>
        <p className="text-xs sm:text-sm text-[#5A3825] max-w-md mx-auto font-normal">
          Discover single-estate black teas, delicate green teas, oolongs, and calming herbal infusions.
        </p>
        <div className="pt-2">
          <Link
            to="/shop/tea"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md"
          >
            Explore Whole Leaf Teas <ArrowRight className="w-4 h-4 text-[#B8895B]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
