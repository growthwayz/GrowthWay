import React from 'react';

const PortfolioFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div id="portfolio-filter" className="filter-bar bg-gw-canvas/80 border-b border-gw-line/50 py-5 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-5 md:px-18">
        <div className="flex justify-center w-full">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pb-1 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelect(category)}
                className={`
                  relative text-xs md:text-sm uppercase tracking-wide whitespace-nowrap interactive-hover
                  transition-all duration-400 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gw-olive
                  ${activeCategory === category 
                    ? 'text-gw-ink font-semibold' 
                    : 'text-gw-muted font-normal hover:text-gw-ink'}
                `}
                aria-current={activeCategory === category ? 'true' : 'false'}
              >
                {category}

                {/* Active olive underline with smooth width transition */}
                <span 
                  className={`
                    absolute -bottom-2 left-0 h-[2px] bg-gw-olive rounded-full
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${activeCategory === category ? 'w-full opacity-100' : 'w-0 opacity-0'}
                  `}
                ></span>

                {/* Hover underline */}
                {activeCategory !== category && (
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gw-muted/40 rounded-full transition-all duration-300 hover:w-full group-hover:w-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioFilter;

