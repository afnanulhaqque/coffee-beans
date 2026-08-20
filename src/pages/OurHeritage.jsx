import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function OurHeritage() {
  const timeline = [
    {
      year: '1963',
      description: 'Our first store in Southern California opened, where founder Herb Hyman began importing and roasting coffee.',
      image: '/heritage/1963.jpg',
    },
    {
      year: '1970',
      description: 'Herb Hyman moved roasting facility to Camarillo and began to establish direct relationships with coffee growers.',
      image: '/heritage/1970.jpg',
    },
    {
      year: '1987',
      description: 'History was made when a barista invented the ICE BLENDED® drink at our Westwood, California store.',
      image: '/heritage/1987.jpg',
    },
    {
      year: '1998',
      description: 'The Chai Tea Latte launched, transforming specialty spiced tea culture worldwide.',
      image: '/heritage/1998.jpg',
    },
    {
      year: '2005',
      description: 'Established the Caring Cup® Global Charity Program to give back to growing communities.',
      image: '/heritage/2005.jpg',
    },
    {
      year: '2008',
      description: 'We hit the milestone 700-store mark across global territories.',
      image: '/heritage/2008.jpg',
    },
    {
      year: '2013',
      description: 'The Coffee Bean & Tea Leaf® celebrates its 50TH anniversary – 50 years of crafting the perfect cup!',
      image: '/heritage/2013.jpg',
    },
    {
      year: '2017',
      description: 'The Coffee Bean & Tea Leaf launched in Pakistan, bringing authentic Californian coffee heritage.',
      image: '/heritage/2017.jpg',
    },
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-20 font-body text-[#2A1B17]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          OUR GLOBAL TIMELINE
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#351B38] tracking-tight leading-tight">
          OUR HERITAGE
        </h1>
        <p className="text-sm sm:text-base text-[#6B4A3A] font-normal leading-relaxed max-w-2xl mx-auto">
          Over 50 years of passion for sourcing the finest coffees and teas, serving generations of coffee lovers worldwide.
        </p>
      </div>

      {/* Timeline Layout with Bossanova Purple Line & Year Indicators */}
      <div className="relative border-l-2 border-[#4B274F]/40 ml-4 sm:ml-32 md:ml-40 space-y-16 py-6">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative pl-8 sm:pl-12 group">
            
            {/* Timeline Marker Dot in Bossanova */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#E8DED2] border-2 border-[#4B274F] group-hover:bg-[#4B274F] transition-colors" />

            {/* Year Tag on Left (Desktop) */}
            <div className="sm:absolute sm:-left-36 md:-left-44 top-0 font-display text-3xl sm:text-4xl text-[#4B274F] group-hover:text-[#351B38] transition-colors">
              {item.year}
            </div>

            {/* Content Card */}
            <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
              <p className="text-sm sm:text-base text-[#2A1B17] leading-relaxed font-normal">
                {item.description}
              </p>
              <div className="aspect-16/9 bg-[#2A1B17] rounded-md overflow-hidden">
                <img
                  src={item.image}
                  alt={`${item.year} Heritage`}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="p-10 sm:p-14 bg-[#E8DED2]/40 border border-[#E8DED2] text-[#2A1B17] text-center space-y-5 rounded-md shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
          A Legacy In Every Cup
        </h2>
        <p className="text-xs sm:text-sm text-[#6B4A3A] max-w-md mx-auto font-normal">
          Taste the heritage that started in 1963 and continues every day at our Pakistan cafes.
        </p>
        <div className="pt-2">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md"
          >
            Find A Store Near You <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

    </div>
  );
}
