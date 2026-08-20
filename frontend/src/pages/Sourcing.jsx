import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Award, Sparkles, ShieldCheck, Heart, ArrowRight, Mountain, CheckCircle2 } from 'lucide-react';

export default function Sourcing() {
  const origins = [
    {
      region: 'Latin America',
      country: 'Costa Rica & Colombia',
      elevation: '4,500 – 6,000 ft',
      notes: 'Crisp green apple, milk chocolate, and sweet honey finish.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    },
    {
      region: 'East Africa',
      country: 'Ethiopia & Kenya',
      elevation: '5,000 – 7,200 ft',
      notes: 'Wild jasmine florality, bergamot citrus, and wine-like acidity.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    },
    {
      region: 'Pacific & Islands',
      country: 'Sumatra Mandheling & Hawaii Kona',
      elevation: '3,800 – 5,500 ft',
      notes: 'Full heavy body, cedar wood, dark cocoa, and herbal sweetness.',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-20 font-body text-[#1C1714]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          ESTATE HARVESTING &amp; ETHICAL SOURCING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#24150F] tracking-tight leading-tight">
          Sourced From The Top 1% <br />
          High-Altitude Arabica
        </h1>
        <p className="text-sm sm:text-base text-[#756A62] font-normal leading-relaxed max-w-2xl mx-auto">
          Since 1963, we have worked directly with smallholder family farms and generational estates across the world's finest coffee growing regions.
        </p>
      </div>

      {/* Main Sourcing Narrative Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#EDE4D8] rounded-sm p-8 sm:p-14 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#24150F] rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80"
            alt="Single Origin Coffee Cherries"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#B8895B] block">
            THE ELEVATION STANDARD
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#24150F] leading-tight">
            Why High Altitude Matters
          </h2>
          <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
            We only select beans harvested above 4,000 feet. At these cooler elevations, coffee cherries mature much slower, allowing complex organic sugars, vibrant acidity, and dense cellular structures to fully develop inside the seed.
          </p>
          <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
            Every harvest lot is cupped, evaluated for moisture content, and tested through strict 10-point specialty coffee scoring before entering our small-batch roastery.
          </p>
        </div>
      </div>

      {/* 3 Origin Terroirs Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
            TERROIRS OF EXCELLENCE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
            Our Sourcing Regions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {origins.map((orig, idx) => (
            <div key={idx} className="bg-white border border-[#EDE4D8] rounded-sm overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="aspect-16/10 bg-[#24150F] overflow-hidden">
                <img src={orig.image} alt={orig.region} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-semibold text-[#B8895B]">{orig.region}</span>
                    <span className="text-[11px] font-mono text-[#756A62]">{orig.elevation}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#24150F]">{orig.country}</h3>
                  <p className="text-xs text-[#756A62] leading-relaxed font-normal">{orig.notes}</p>
                </div>
                <div className="pt-3 border-t border-[#EDE4D8]">
                  <Link
                    to="/shop/coffee"
                    className="text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:text-[#B8895B] flex items-center gap-1 transition-colors"
                  >
                    Shop This Origin <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars of Sustainable Sourcing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Award className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Top 1% Arabica</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Only the top 1% of the world's Arabica harvest meets our strict cupping standards.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Heart className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Direct Trade</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Long term partnerships with farm families ensuring living wages and community investment.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Mountain className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">High-Altitude Estates</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Grown above 4,000 feet in shade-grown microclimates for concentrated natural sugars.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
          <Sparkles className="w-6 h-6 text-[#B8895B]" />
          <h4 className="font-semibold text-base text-[#24150F]">Small-Batch Roasted</h4>
          <p className="text-xs text-[#756A62] leading-relaxed font-normal">
            Precision temperature curves tailored to each bean's origin voice and moisture.
          </p>
        </div>
      </div>

      {/* Call to action card */}
      <div className="p-10 sm:p-14 bg-[#EDE4D8]/80 border border-[#EDE4D8] text-[#1C1714] text-center space-y-5 rounded-sm shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
          Taste The Single Origin Difference
        </h2>
        <p className="text-xs sm:text-sm text-[#5A3825] max-w-md mx-auto font-normal">
          Explore our freshly roasted whole bean single-origin coffees and signature blends.
        </p>
        <div className="pt-2">
          <Link
            to="/shop/coffee"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md"
          >
            Explore Coffee Roasts <ArrowRight className="w-4 h-4 text-[#B8895B]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
