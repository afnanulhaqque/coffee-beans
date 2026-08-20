import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, History, Sparkles, Award } from 'lucide-react';

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
      description: 'The Chai Tea Latte launched.',
      image: '/heritage/1998.jpg',
    },
    {
      year: '2005',
      description: 'Established the Caring Cup® Global Charity Program.',
      image: '/heritage/2005.jpg',
    },
    {
      year: '2008',
      description: 'We hit the 700 store mark',
      image: '/heritage/2008.jpg',
    },
    {
      year: '2013',
      description: 'The Coffee Bean & Tea Leaf® celebrates its 50THanniversary – Happy Birthday to us!',
      image: '/heritage/2013.jpg',
    },
    {
      year: '2017',
      description: 'The Coffee Bean & Tea launched in Pakistan',
      image: '/heritage/2017.jpg',
    },
  ];

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-20 font-body text-[#1C1714]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
          OUR GLOBAL TIMELINE
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#24150F] tracking-tight leading-tight">
          OUR HERITAGE
        </h1>
        <p className="text-sm sm:text-base text-[#756A62] font-normal leading-relaxed max-w-2xl mx-auto">
          Over 50 years of passion for sourcing the finest coffees and teas, serving generations of coffee lovers worldwide.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative border-l border-[#B8895B]/40 ml-4 sm:ml-32 md:ml-40 space-y-16 py-6">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative pl-8 sm:pl-12 group">
            
            {/* Timeline Marker Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#EDE4D8] border-2 border-[#B8895B] group-hover:bg-[#24150F] transition-colors" />

            {/* Year Tag on Left (Desktop) */}
            <div className="sm:absolute sm:-left-36 md:-left-44 top-0 font-display text-3xl sm:text-4xl text-[#B8895B] group-hover:text-[#24150F] transition-colors">
              {item.year}
            </div>

            {/* Content Card */}
            <div className="bg-white border border-[#EDE4D8] rounded-sm p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
              <p className="text-sm sm:text-base text-[#1C1714] leading-relaxed font-normal">
                {item.description}
              </p>
              <div className="aspect-16/9 bg-[#24150F] rounded-xs overflow-hidden">
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
      <div className="p-10 sm:p-14 bg-[#EDE4D8]/80 border border-[#EDE4D8] text-[#1C1714] text-center space-y-5 rounded-sm shadow-xs">
        <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
          A Legacy In Every Cup
        </h2>
        <p className="text-xs sm:text-sm text-[#5A3825] max-w-md mx-auto font-normal">
          Taste the heritage that started in 1963 and continues every day at our Pakistan cafes.
        </p>
        <div className="pt-2">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md"
          >
            Find A Store Near You <ArrowRight className="w-4 h-4 text-[#B8895B]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
