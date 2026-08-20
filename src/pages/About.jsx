import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function About() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-16 font-body text-[#2A1B17]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-2">
          <img src={logoImg} alt="The Coffee Bean & Tea Leaf" className="w-16 h-16 object-contain" />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          ESTABLISHED 1963
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#351B38] tracking-tight leading-tight">
          ABOUT US
        </h1>
      </div>

      {/* Main Narrative Split 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white border border-[#E8DED2] rounded-md p-8 sm:p-12 shadow-xs">
        <div className="lg:col-span-6 aspect-4/3 bg-[#2A1B17] rounded-md overflow-hidden">
          <img
            src="/heritage/1963.jpg"
            alt="Herb Hyman Founding Father"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
            BORN &amp; BREWED IN SOUTHERN CALIFORNIA
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-[#351B38] leading-tight">
            Our California Roots
          </h2>
          <p className="text-sm sm:text-base text-[#2A1B17] leading-relaxed font-normal">
            Born &amp; brewed in Southern California since 1963, Herbert B. Hyman started The Coffee Bean &amp; Tea Leaf. Hyman’s effort in serving the best coffee and tea in the world made him the founding father of gourmet coffee in California. Now, over 50 years later, The Coffee Bean &amp; Tea Leaf has grown into one of the largest privately-owned, family-run coffee and tea companies in the world.
          </p>
        </div>
      </div>

      {/* Global Presence Section */}
      <div className="bg-white border border-[#E8DED2] rounded-md p-8 sm:p-12 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-[#4B274F]" />
          <h2 className="font-display text-2xl sm:text-3xl text-[#351B38]">
            1,400+ Stores In Nearly 40 Countries
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#6B4A3A] leading-relaxed font-normal">
          The Coffee Bean &amp; Tea Leaf® has since grown to over 1400 stores in nearly 40 Countries worldwide. Company-owned stores are located in California, Arizona, Singapore and Malaysia. Our domestically franchised stores span from California to New York and include locations in Arizona, Colorado, Georgia, Hawaii, Maryland, Michigan, Nevada, Oklahoma, Texas, Washington and Washington D.C. Internationally, The Coffee Bean &amp; Tea Leaf® franchised locations can be found in Bahrain, Brunei, Cambodia, China, East Malaysia (Sabah), Egypt, Georgia, India, Indonesia, Iraqi Kurdistan, Japan, Jordan, Kuwait, Lebanon, Mongolia, Oman, Panama, Paraguay, Philippines, Pakistan, Qatar, Saudi Arabia, South Korea, Sri Lanka, Thailand, and Vietnam.
        </p>
      </div>

      {/* Pakistan Brand Statement Card */}
      <div className="bg-[#E8DED2]/40 border border-[#E8DED2] rounded-md p-8 sm:p-12 shadow-xs text-center space-y-6">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          THE PAKISTAN COMMITMENT
        </span>
        <blockquote className="font-quote italic text-xl sm:text-2xl text-[#351B38] max-w-3xl mx-auto leading-relaxed">
          “The Coffee Bean &amp; Tea Leaf Pakistan strives to stay true to the social Californian lifestyle that our brand so joyously signifies. This is why we operate all local Coffee Bean stores ourselves and don’t offer franchises. We wanna make sure that each cup you sip is equally enriched in goodness!”
        </blockquote>
        <div className="pt-2">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md"
          >
            Explore Pakistan Lounges <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

    </div>
  );
}
