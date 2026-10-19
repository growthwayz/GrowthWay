/**
 * IndustriesList — Who We Work With
 * Editorial interactive sector showcase matching the exact design:
 * - Header with eyebrow and 3 live metric pill badges
 * - Left column with numbered sectors, custom sub-tags, and active floating card
 * - Right column with luxury preview card, image overlays, and pill CTA
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
    subtitle: 'VENTURE & SCALE',
    tag: 'VENTURE & SCALE',
    shortLine: 'From zero to brand recognition and market dominance',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop',
    imageAlt: 'Startup workspace collaboration',
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    subtitle: 'LUXURY STAYS',
    tag: 'LUXURY STAYS',
    shortLine: 'Boutique experiences guests remember and share',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    imageAlt: 'Luxury boutique hotel interior and pool loungers',
  },
  {
    slug: 'cafes-restaurants',
    name: 'Cafes & Restaurants',
    subtitle: 'F&B CONCEPTS',
    tag: 'F&B CONCEPTS',
    shortLine: 'Where taste meets visual identity and packed tables',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
    imageAlt: 'Artisanal cafe ambience',
  },
  {
    slug: 'fashion-jewellery',
    name: 'Fashion & Jewellery',
    subtitle: 'FINE ATELIERS',
    tag: 'FINE ATELIERS',
    shortLine: 'Crafting desire through distinct editorial design and media',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
    imageAlt: 'Fine jewellery and fashion showcase',
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    subtitle: 'SKIN & COSMETICS',
    tag: 'SKIN & COSMETICS',
    shortLine: 'Aesthetics that convert browsers into brand evangelists',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
    imageAlt: 'Organic beauty and skincare',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    subtitle: 'PREMIUM ASSETS',
    tag: 'PREMIUM ASSETS',
    shortLine: 'Positioning properties with cinematic purpose and high conviction',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    imageAlt: 'Modern architectural property',
  },
  {
    slug: 'events',
    name: 'Events',
    subtitle: 'STAGE & PRODUCTION',
    tag: 'STAGE & PRODUCTION',
    shortLine: 'Making high-production moments unforgettable and viral',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    imageAlt: 'High production creative event stage',
  },
  {
    slug: 'personal-brands',
    name: 'Personal Brands',
    subtitle: 'CREATORS & EXECS',
    tag: 'CREATORS & EXECS',
    shortLine: 'Your authority amplified through high-retention media systems',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    imageAlt: 'Founder personal brand portrait',
  },
  {
    slug: 'local-businesses',
    name: 'Local Businesses',
    subtitle: 'COMMUNITY PILLARS',
    tag: 'COMMUNITY PILLARS',
    shortLine: 'Neighbourhood names with modern digital reach and revenue',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop',
    imageAlt: 'Local business retail store',
  },
];

export default function IndustriesList() {
  const [industries, setIndustries] = useState(DEFAULT_INDUSTRIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1); // Default to Hospitality as shown in target design
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;
    const fetchIndustries = async () => {
      try {
        const data = await api.get('/api/industries');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const merged = data.map((item, idx) => {
            const fallback = DEFAULT_INDUSTRIES[idx] || DEFAULT_INDUSTRIES.find(d => d.slug === item.slug) || {};
            return {
              ...fallback,
              ...item,
              subtitle: item.subtitle || fallback.subtitle || 'SPECIALIZED SECTOR',
              tag: item.tag || fallback.tag || fallback.subtitle || 'SECTOR',
              shortLine: item.shortLine || fallback.shortLine || 'Transforming vision into market impact.',
              image: item.image || fallback.image || DEFAULT_INDUSTRIES[0].image,
            };
          });
          setIndustries(merged);
        }
      } catch {
        // Fallback to verified DEFAULT_INDUSTRIES
      }
    };
    fetchIndustries();
    return () => { isMounted = false; };
  }, []);

  // Restore previously focused industry sector on returning from detail view
  useEffect(() => {
    const savedSlug = sessionStorage.getItem('gw_active_industry');
    if (savedSlug && industries.length > 0) {
      const idx = industries.findIndex(d => d.slug === savedSlug);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [industries]);

  // Scroll-triggered subtle entry animation
  useGSAP(() => {
    if (!sectionRef.current || reducedMotion) return;
    const rows = sectionRef.current.querySelectorAll('.ind-row');
    if (!rows.length) return;

    gsap.from(rows, {
      y: 16,
      opacity: 0,
      duration: 0.45,
      stagger: 0.03,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef, dependencies: [industries.length, reducedMotion] });

  // Smooth image crossfade on change
  useEffect(() => {
    if (activeIndex < 0 || !imageRef.current || reducedMotion) return;
    const img = imageRef.current;
    gsap.fromTo(img,
      { opacity: 0.75, scale: 0.985 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeIndex, reducedMotion]);

  const handleKeyDown = useCallback((e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, industries.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }
  }, [industries.length]);

  if (!loading && industries.length === 0 && !error) return null;

  const activeIndustry = industries[activeIndex] || industries[0];

  return (
    <section
      ref={sectionRef}
      className="ind-section"
      aria-label="Industries we serve"
    >
      <div className="ind-container">
        {/* Header & Badges Row */}
        <div className="ind-header-wrap">
          <div className="ind-header-left">
            <span className="ind-eyebrow">SECTORS // INDUSTRIES</span>
            <h2 className="ind-title">WHO WE WORK WITH</h2>
          </div>

          <div className="ind-header-pills">
            <div className="ind-header-pill">
              <span className="ind-pill-dot" />
              <span>09 SPECIALIZED NICHES</span>
            </div>
            <div className="ind-header-pill">
              <span className="ind-pill-plus">+</span>
              <span>100M+ VIEWS GENERATED</span>
            </div>
            <div className="ind-header-pill">
              <span>50+ BRANDS COMMISSIONED</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="ind-layout">
          {/* Left Column — Sector List */}
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
              industries.map((ind, i) => {
                const isActive = activeIndex === i;
                return (
                  <div
                    key={ind.slug || i}
                    id={`industry-row-${ind.slug}`}
                    className={`ind-row ${isActive ? 'ind-row-active' : ''} scroll-mt-28`}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={0}
                    onMouseEnter={() => window.innerWidth > 1024 && setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    onClick={() => {
                      setActiveIndex(i);
                      sessionStorage.setItem('gw_active_industry', ind.slug);
                    }}
                  >
                    <div className="ind-row-content">
                      <span className="ind-row-num">{String(i + 1).padStart(2, '0')}</span>
                      <div className="ind-row-info">
                        <h3 className="ind-row-name">{ind.name}</h3>
                        <span className="ind-row-sub">{ind.subtitle || ind.tag}</span>
                      </div>
                    </div>

                    {isActive && (
                      <Link
                        to={`/work/${ind.slug}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sessionStorage.setItem('gw_return_scroll', String(window.scrollY));
                          sessionStorage.setItem('gw_return_target', `industry-row-${ind.slug}`);
                          sessionStorage.setItem('gw_active_industry', ind.slug);
                        }}
                        state={{ 
                          from: 'industries', 
                          returnTo: '/#industries', 
                          returnTarget: `industry-row-${ind.slug}`, 
                          returnScrollY: window.scrollY, 
                          returnLabel: 'Back to Who We Work With' 
                        }}
                        className="ind-row-indicator group cursor-pointer"
                        title={`Explore ${ind.name} work`}
                      >
                        <span className="ind-row-dot" />
                        <span className="ind-row-arrow">→</span>
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column — Large Interactive Preview Card */}
          <div className="ind-preview">
            {activeIndustry && (
              <div className="ind-preview-card">
                {/* Image Viewport with Floating Badges */}
                <div className="ind-preview-img-wrap" ref={imageRef}>
                  <img
                    src={activeIndustry.image}
                    alt={activeIndustry.imageAlt || activeIndustry.name}
                    loading="lazy"
                    className="ind-preview-img"
                  />
                  {/* Top-Left Sector Tag */}
                  <div className="ind-badge-tl">
                    <span>SECTOR // [{activeIndustry.tag || activeIndustry.subtitle || 'SPECIALIZED'}]</span>
                  </div>
                  {/* Bottom-Right Commission Archive Stamp */}
                  <div className="ind-badge-br">
                    <span>LUCKNOW STUDIO // COMMISSION ARCHIVE</span>
                  </div>
                </div>

                {/* Card Meta & Action */}
                <div className="ind-preview-body">
                  <div className="ind-preview-title-row">
                    <h3 className="ind-preview-name">{activeIndustry.name}</h3>
                    <span className="ind-preview-tag">{activeIndustry.tag || activeIndustry.subtitle}</span>
                  </div>

                  <p className="ind-preview-desc">
                    {activeIndustry.shortLine}
                  </p>

                  <Link
                    to={`/work/${activeIndustry.slug}`}
                    onClick={() => {
                      sessionStorage.setItem('gw_return_scroll', String(window.scrollY));
                      sessionStorage.setItem('gw_return_target', `industry-row-${activeIndustry.slug}`);
                      sessionStorage.setItem('gw_active_industry', activeIndustry.slug);
                    }}
                    state={{ 
                      from: 'industries', 
                      returnTo: '/#industries', 
                      returnTarget: `industry-row-${activeIndustry.slug}`, 
                      returnScrollY: window.scrollY, 
                      returnLabel: 'Back to Who We Work With' 
                    }}
                    className="ind-explore-btn"
                  >
                    <span>EXPLORE {activeIndustry.name.toUpperCase()} WORK</span>
                    <span className="ind-explore-circle">
                      <span className="ind-explore-arrow">→</span>
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
