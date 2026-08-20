import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Compass, Sparkles, Coffee } from 'lucide-react';

export default function OurCoffee() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-20 font-body text-[#1C1714]">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          ESTATE SOURCING &amp; SMALL BATCH ROASTING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#24150F] tracking-tight leading-tight">
          OUR COFFEE
        </h1>
        <p className="text-base sm:text-lg text-[#5A3825] font-serif italic max-w-2xl mx-auto leading-relaxed">
          “At The Coffee Bean &amp; Tea Leaf, the art of crafting the best tasting coffee requires respecting each individual roast.”
        </p>
      </div>

      {/* Main Narrative with picture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-[#EDE4D8] rounded-sm p-8 sm:p-12 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#24150F] rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80"
            alt="Jay Isais Selecting Coffee Beans"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <p className="text-sm sm:text-base text-[#1C1714] leading-relaxed font-normal">
            Our coffee master, Jay Isais, only selects the top 1% of Arabica beans from the world’s best growing regions in East Africa, Latin America, and the Pacific.
          </p>
          <p className="text-sm sm:text-base text-[#1C1714] leading-relaxed font-normal">
            We roast in small batches at our facility in Camarillo, CA, where we find the roast that best suits the beans from each origin and captures what makes each country’s coffee unique. In other words, we don’t do anything halfway.
          </p>
        </div>
      </div>

      {/* Editorial Alternate Sections */}
      <div className="space-y-16">
        
        {/* Section 1: FLAVOR FACTS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#EDE4D8] pb-14">
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B8895B] block">
              ORIGIN SCIENCE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              FLAVOR FACTS
            </h2>
            <p className="text-xs sm:text-sm text-[#756A62] leading-relaxed font-normal">
              Alienum phaedrum torquatos nec eu, vis detraxit periculis ex, nihil expetendis in mei. Mei an pericula euripidis,
            </p>
          </div>
          <div className="md:col-span-7 aspect-16/9 bg-[#24150F] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80"
              alt="Flavor Facts Cupping"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 2: THE SOURCE MATTERS (Image Left, Text Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#EDE4D8] pb-14">
          <div className="md:col-span-7 md:order-1 aspect-16/9 bg-[#24150F] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80"
              alt="High Altitude Arabica Cherries"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-5 md:order-2 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B8895B] block">
              6,000 FEET ELEVATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              THE SOURCE MATTERS
            </h2>
            <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
              We believe that buying from the best estates and small farms leads to the very best coffee. In our search for the finest coffees in the world, we use only the top 1% of the Arabica Beans found at altitudes up to 6,000 feet, which results in a more concentrated flavor.
            </p>
          </div>
        </div>

        {/* Section 3: OUR PEOPLE BELIEVE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#EDE4D8] pb-14">
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B8895B] block">
              CRAFT &amp; DEDICATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              OUR PEOPLE BELIEVE
            </h2>
            <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
              Many coffee companies claim to search the world for the finest coffees, yet very few do. At The Coffee Bean &amp; Tea Leaf®, our Coffee Master, Jay Isais, goes to the source of our coffee to guarantee it is the highest quality obtainable on earth. The partners who prepare our coffee at every level are extremely passionate people committed to providing ‘Simply the Best’ coffee to our customers. Quality has always been our No. 1 priority, and it will never be compromised.
            </p>
          </div>
          <div className="md:col-span-7 aspect-16/9 bg-[#24150F] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
              alt="Passionate Baristas and Coffee Masters"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 4: KNOW WHERE EVERY BEAN COMES FROM (Image Left, Text Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#EDE4D8] pb-14">
          <div className="md:col-span-7 md:order-1 aspect-16/9 bg-[#24150F] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
              alt="Green Beans Roasted in Small Batches"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-5 md:order-2 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B8895B] block">
              TOTAL TRACEABILITY
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              KNOW WHERE EVERY BEAN COMES FROM
            </h2>
            <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
              From the ship to shore, to the lab where our great taste is born, small batches of our fresh green coffee beans are roasted to perfection and analyzed for fragrance, aroma, flavor, acidity, body and finish. Only when quality is at its peak and our rigorous standards are met is it ready to be shared with you.
            </p>
          </div>
        </div>

        {/* Section 5: SEEKING QUALITY WHEREVER IT GROWS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B8895B] block">
              GLOBAL EXPEDITIONS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              SEEKING QUALITY WHEREVER IT GROWS
            </h2>
            <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed font-normal">
              At The Coffee Bean &amp; Tea Leaf®, we travel to small farms and private estates in East Africa, Latin America and the Pacific in search of the very best coffee the world has to offer. We buy only the finest beans where they live, from the most prestigious growers on earth.
            </p>
          </div>
          <div className="md:col-span-7 aspect-16/9 bg-[#24150F] rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1000&q=80"
              alt="Global Coffee Farming Estates"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Call to action */}
      <div className="p-10 sm:p-14 bg-[#EDE4D8]/80 border border-[#EDE4D8] text-[#1C1714] text-center space-y-5 rounded-sm shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
          Experience Our Handcrafted Roasts
        </h2>
        <p className="text-xs sm:text-sm text-[#5A3825] max-w-md mx-auto font-normal">
          Explore whole bean single-origins, handcrafted espresso blends, and signature roasts.
        </p>
        <div className="pt-2">
          <Link
            to="/shop/coffee"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md"
          >
            Shop Whole Bean Coffee <ArrowRight className="w-4 h-4 text-[#B8895B]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
