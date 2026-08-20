import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Compass, Sparkles, Coffee } from 'lucide-react';

export default function OurCoffee() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-20 font-body text-[#2A1B17]">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          ESTATE SOURCING &amp; SMALL BATCH ROASTING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#351B38] tracking-tight leading-tight">
          OUR COFFEE
        </h1>
        <p className="text-base sm:text-lg text-[#6B4A3A] font-serif italic max-w-2xl mx-auto leading-relaxed">
          “At The Coffee Bean &amp; Tea Leaf, the art of crafting the best tasting coffee requires respecting each individual roast.”
        </p>
      </div>

      {/* Main Narrative with picture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-[#E8DED2] rounded-md p-8 sm:p-12 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#2A1B17] rounded-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80"
            alt="Selecting Coffee Beans"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <p className="text-sm sm:text-base text-[#2A1B17] leading-relaxed font-normal">
            Our coffee master, Jay Isais, only selects the top 1% of Arabica beans from the world’s best growing regions in East Africa, Latin America, and the Pacific.
          </p>
          <p className="text-sm sm:text-base text-[#2A1B17] leading-relaxed font-normal">
            We roast in small batches at our facility in Camarillo, CA, where we find the roast that best suits the beans from each origin and captures what makes each country’s coffee unique. In other words, we don’t do anything halfway.
          </p>
        </div>
      </div>

      {/* Editorial Alternate Sections */}
      <div className="space-y-16">
        
        {/* Section 1: FLAVOR FACTS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#E8DED2] pb-14">
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
              ORIGIN SCIENCE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#351B38]">
              FLAVOR FACTS
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
              From bright, floral high-grown light roasts to deep caramel, smoky dark roasts, each coffee is profiled to unlock its peak aroma and distinct origin nuances.
            </p>
          </div>
          <div className="md:col-span-7 aspect-16/9 bg-[#2A1B17] rounded-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
              alt="Flavor Facts Cupping"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 2: THE SOURCE MATTERS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#E8DED2] pb-14">
          <div className="md:col-span-7 md:order-1 aspect-16/9 bg-[#2A1B17] rounded-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80"
              alt="High Altitude Arabica Cherries"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-5 md:order-2 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
              6,000 FEET ELEVATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#351B38]">
              THE SOURCE MATTERS
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
              We believe that buying from the best estates and small farms leads to the very best coffee. In our search for the finest coffees in the world, we use only the top 1% of the Arabica Beans found at altitudes up to 6,000 feet, which results in a more concentrated flavor.
            </p>
          </div>
        </div>

        {/* Section 3: OUR PEOPLE BELIEVE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#E8DED2] pb-14">
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
              CRAFT &amp; DEDICATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#351B38]">
              OUR PEOPLE BELIEVE
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed font-normal">
              Many coffee companies claim to search the world for the finest coffees, yet very few do. At The Coffee Bean &amp; Tea Leaf®, our Coffee Master goes to the source of our coffee to guarantee it is the highest quality obtainable on earth. Quality has always been our No. 1 priority, and it will never be compromised.
            </p>
          </div>
          <div className="md:col-span-7 aspect-16/9 bg-[#2A1B17] rounded-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
              alt="Quality Roasted Coffee"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Call to Action Banner */}
      <div className="p-10 sm:p-14 bg-[#E8DED2]/40 border border-[#E8DED2] text-[#2A1B17] text-center space-y-5 rounded-md shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
          Taste the Passion in Every Cup
        </h2>
        <p className="text-xs sm:text-sm text-[#6B4A3A] max-w-md mx-auto font-normal">
          Explore our range of medium, light, and dark roast whole bean coffees roasted with care.
        </p>
        <div className="pt-2">
          <Link
            to="/coffee"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md"
          >
            Explore Coffee Collection <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

    </div>
  );
}
