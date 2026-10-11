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

export default function IndustriesList() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const data = await api.get('/api/industries');
        setIndustries(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  // Scroll-triggered reveal
  useGSAP(() => {
    if (loading || !sectionRef.current || reducedMotion) return;
    const items = sectionRef.current.querySelectorAll('.ind-item');
    if (!items.length) return;

    gsap.from(items, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef, dependencies: [loading, reducedMotion] });

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
