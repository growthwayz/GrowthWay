/**
 * Testimonials — Items 23–24
 * One large quote at a time (H3 scale) with name/brand.
 * Marquee/carousel with pause on hover & focus.
 * Keyboard operable prev/next. Swipeable on mobile.
 * Hides if API returns no approved testimonials.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './Testimonials.css';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.get('/api/testimonials');
        setTestimonials(data);
      } catch {
        // Hide on error
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-advance carousel (unless reduced motion or paused)
  useEffect(() => {
    if (reducedMotion || paused || testimonials.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(intervalRef.current);
  }, [paused, testimonials.length, reducedMotion]);

  const goTo = useCallback((i) => {
    setCurrent(i);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goNext = useCallback(() => {
    setCurrent(prev => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
  }, [goPrev, goNext]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  if (!loading && testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section
      ref={sectionRef}
      className="test-section"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
    >
      <div className="test-container">
        {loading ? (
          <div className="test-skeleton">
            <div className="test-skel-quote" />
            <div className="test-skel-name" />
          </div>
        ) : t ? (
          <div className="test-content" aria-live="polite" aria-atomic="true">
            <div className="test-quote-mark" aria-hidden="true">"</div>
            <blockquote className="test-quote" key={current}>
              {t.quote}
            </blockquote>
            <div className="test-author">
              <span className="test-name">{t.personName}</span>
              {t.role && <span className="test-role">{t.role}{t.brand ? `, ${t.brand}` : ''}</span>}
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="test-nav">
                <button
                  className="test-btn"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                >
                  ←
                </button>
                <div className="test-dots">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`test-dot ${i === current ? 'active' : ''}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="test-btn"
                  onClick={goNext}
                  aria-label="Next testimonial"
                >
                  →
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
