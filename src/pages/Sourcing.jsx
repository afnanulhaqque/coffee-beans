import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Sparkles, Heart, ArrowRight, Mountain } from 'lucide-react';

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
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-20 font-body text-[#2A1B17]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          ESTATE HARVESTING &amp; ETHICAL SOURCING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#351B38] tracking-tight leading-tight">
          Sourced From The Top 1% <br />
          High-Altitude Arabica
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A3A] font-normal leading-relaxed max-w-2xl mx-auto">
          Since 1963, we have worked directly with smallholder family farms and generational estates across the world's finest coffee growing regions.
        </p>
      </div>

      {/* Main Sourcing Narrative Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#E8DED2] rounded-md p-8 sm:p-14 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#2A1B17] rounded-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80"
            alt="Single Origin Coffee Cherries"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
            THE ELEVATION STANDARD
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#351B38] leading-tight">
            Why High Altitude Matters
          </h2>
          <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
            We only select beans harvested above 4,000 feet. At these cooler elevations, coffee cherries mature much slower, allowing complex organic sugars, vibrant acidity, and dense cellular structures to fully develop inside the seed.
          </p>
          <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
            Every harvest lot is cupped, evaluated for moisture content, and tested through strict specialty coffee scoring before entering our small-batch roastery.
          </p>
        </div>
      </div>

      {/* 3 Origin Terroirs Showcase */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
            TERROIRS OF EXCELLENCE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
            Our Sourcing Regions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {origins.map((orig, idx) => (
            <div key={idx} className="bg-white border border-[#E8DED2] rounded-md overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="aspect-16/10 bg-[#2A1B17] overflow-hidden">
                <img src={orig.image} alt={orig.region} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#4B274F]">{orig.region}</span>
                    <span className="text-[11px] font-mono text-[#6B4A3A]">{orig.elevation}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#351B38]">{orig.country}</h3>
                  <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">{orig.notes}</p>
                </div>
                <div className="pt-3 border-t border-[#E8DED2]">
                  <Link
                    to="/coffee"
                    className="text-xs font-semibold uppercase tracking-wider text-[#2A1B17] hover:text-[#4B274F] flex items-center gap-1 transition-colors"
                  >
                    Shop This Origin <ArrowRight className="w-3.5 h-3.5 text-[#4B274F]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Pillars of Sustainable Sourcing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2">
          <Award className="w-6 h-6 text-[#4B274F]" />
          <h4 className="font-semibold text-base text-[#351B38]">Top 1% Arabica</h4>
          <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">
            Only the top 1% of the world's Arabica harvest meets our strict cupping standards.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2">
          <Heart className="w-6 h-6 text-[#4B274F]" />
          <h4 className="font-semibold text-base text-[#351B38]">Direct Trade</h4>
          <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">
            Long term partnerships with farm families ensuring living wages and community investment.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2">
          <Mountain className="w-6 h-6 text-[#4B274F]" />
          <h4 className="font-semibold text-base text-[#351B38]">High-Altitude Estates</h4>
          <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">
            Grown above 4,000 feet in shade-grown microclimates for concentrated natural sugars.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2">
          <Sparkles className="w-6 h-6 text-[#4B274F]" />
          <h4 className="font-semibold text-base text-[#351B38]">Small-Batch Roasted</h4>
          <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">
            Precision temperature curves tailored to each bean's origin voice and moisture.
          </p>
        </div>
      </div>

      {/* Call to action card */}
      <div className="p-10 sm:p-14 bg-[#E8DED2]/40 border border-[#E8DED2] text-[#2A1B17] text-center space-y-5 rounded-md shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
          Taste The Single Origin Difference
        </h2>
        <p className="text-xs sm:text-sm text-[#6B4A3A] max-w-md mx-auto font-normal">
          Explore our freshly roasted whole bean single-origin coffees and signature blends.
        </p>
        <div className="pt-2">
          <Link
            to="/coffee"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md"
          >
            Explore Coffee Roasts <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

    </div>
  );
}
