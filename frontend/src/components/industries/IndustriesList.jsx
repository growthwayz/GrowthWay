/**
 * IndustriesList — Items 19–20
 * Large typographic list on light canvas.
 * Desktop: hover/focus swaps large image + shortLine + link.
 * Mobile: tap expands accordion (one open at a time).
 * Hides entirely if API returns empty.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './IndustriesList.css';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_INDUSTRIES = [
  {
    slug: 'startups',
    name: 'Startups',
    shortLine: 'From zero to brand recognition',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
    imageAlt: 'Startup workspace collaboration',
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    shortLine: 'Experiences guests remember',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    imageAlt: 'Luxury boutique hotel interior',
  },
  {
    slug: 'cafes-restaurants',
    name: 'Cafes & Restaurants',
    shortLine: 'Where taste meets visual identity',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
    imageAlt: 'Artisanal cafe ambience',
  },
  {
    slug: 'fashion-jewellery',
    name: 'Fashion & Jewellery',
    shortLine: 'Crafting desire through design',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop',
    imageAlt: 'Fine jewellery and fashion showcase',
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    shortLine: 'Aesthetics that sell themselves',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
    imageAlt: 'Organic beauty and skincare',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    shortLine: 'Positioning properties with purpose',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    imageAlt: 'Modern architectural property',
  },
  {
    slug: 'events',
    name: 'Events',
    shortLine: 'Making moments unforgettable',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    imageAlt: 'High production creative event stage',
  },
  {
    slug: 'personal-brands',
    name: 'Personal Brands',
    shortLine: 'Your story, amplified',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    imageAlt: 'Founder personal brand portrait',
  },
  {
    slug: 'local-businesses',
    name: 'Local Businesses',
    shortLine: 'Neighbourhood names, national reach',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop',
    imageAlt: 'Local business retail store',
  },
];

export default function IndustriesList() {
  const [industries, setIndustries] = useState(DEFAULT_INDUSTRIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await api.get('/api/industries');
        if (Array.isArray(data) && data.length > 0) {
          setIndustries(data);
        }
      } catch {
        // Keep DEFAULT_INDUSTRIES
      }
    };
    fetchIndustries();
  }, []);

  // Scroll-triggered reveal with guaranteed visibility cleanup
  useGSAP(() => {
    if (!sectionRef.current || reducedMotion) return;
    const items = sectionRef.current.querySelectorAll('.ind-item');
    if (!items.length) return;

    gsap.from(items, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef, dependencies: [industries.length, reducedMotion] });

  // Image crossfade on active change
  useEffect(() => {
    if (activeIndex < 0 || !imageRef.current || reducedMotion) return;
    const img = imageRef.current;
    gsap.fromTo(img,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0.3 },
      { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.6, ease: 'power2.inOut' }
    );
  }, [activeIndex, reducedMotion]);

  const handleKeyDown = useCallback((e) => {
    if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, industries.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      // Toggle on mobile
      setActiveIndex(prev => prev);
    }
  }, [industries.length]);

  // Don't render if empty
  if (!loading && industries.length === 0 && !error) return null;

  const activeIndustry = industries[activeIndex] || null;

  return (
    <section
      ref={sectionRef}
      className="ind-section"
      aria-label="Industries we serve"
    >
      <div className="ind-container">
        {/* Header */}
        <div className="ind-header">
          <span className="ind-eyebrow">Industries</span>
          <h2 className="ind-title">Who We Work With</h2>
        </div>

        <div className="ind-layout">
          {/* Left — typographic list */}
          <div
            className="ind-list"
            role="listbox"
            aria-label="Select an industry"
            onKeyDown={handleKeyDown}
          >
            {loading ? (
              <div className="ind-skeleton">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="ind-skeleton-row" />
                ))}
              </div>
            ) : error ? (
              <p className="ind-error">Unable to load industries right now.</p>
            ) : (
              industries.map((ind, i) => (
                <div
                  key={ind.slug}
                  className={`ind-item ${activeIndex === i ? 'active' : ''} ${activeIndex >= 0 && activeIndex !== i ? 'faded' : ''}`}
                  role="option"
                  aria-selected={activeIndex === i}
                  aria-expanded={activeIndex === i}
                  tabIndex={0}
                  onMouseEnter={() => window.innerWidth > 1024 && setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(prev => prev === i ? -1 : i)}
                >
                  <span className="ind-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="ind-name">{ind.name}</h3>
                  <span className="ind-arrow">→</span>

                  {/* Mobile accordion content */}
                  <div className={`ind-accordion ${activeIndex === i ? 'expanded' : ''}`}>
                    <div className="ind-accordion-inner">
                      {ind.image && (
                        <div className="ind-accordion-img">
                          <img src={ind.image} alt={ind.name} loading="lazy" />
                        </div>
                      )}
                      <p className="ind-shortline">{ind.shortLine}</p>
                      <a
                        href={`/work?industry=${ind.slug}`}
                        className="ind-link"
                      >
                        See related work <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right — large image preview (desktop only) */}
          <div className="ind-preview">
            {activeIndustry && activeIndustry.image && (
              <div className="ind-preview-card">
                <div className="ind-preview-img" ref={imageRef}>
                  <img
                    src={activeIndustry.image}
                    alt={activeIndustry.name}
                    loading="lazy"
                  />
                </div>
                <div className="ind-preview-meta">
                  <p className="ind-preview-line">{activeIndustry.shortLine}</p>
                  <a
                    href={`/work?industry=${activeIndustry.slug}`}
                    className="ind-preview-link"
                  >
                    See related work <span>→</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
