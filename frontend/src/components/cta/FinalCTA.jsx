/**
 * FinalCTA — Item 27
 * Dark section (gw-black), huge white display type with olive accent word.
 * Primary "Start a Project →" (to /contact) and text link "WhatsApp →".
 * Contact config from site_settings.
 * Motion: large type line reveal, CTA hover (magnetic on desktop).
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './FinalCTA.css';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const [settings, setSettings] = useState(null);
  const sectionRef = useRef(null);
  const btnRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get('/api/site-settings');
        setSettings(data);
      } catch {
        // Use defaults
      }
    };
    fetchSettings();
  }, []);

  // Line reveal animation
  useGSAP(() => {
    if (!sectionRef.current || reducedMotion) return;

    const lines = sectionRef.current.querySelectorAll('.cta-line');
    const meta = sectionRef.current.querySelectorAll('.cta-meta');

    if (lines.length) {
      gsap.from(lines, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (meta.length) {
      gsap.from(meta, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: sectionRef, dependencies: [reducedMotion] });

  // Magnetic hover on desktop CTA button
  useEffect(() => {
    if (reducedMotion || !btnRef.current) return;
    const btn = btnRef.current;

    const handleMove = (e) => {
      if (window.innerWidth <= 1024) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };

    const handleLeave = () => {
      btn.style.transform = '';
    };

    btn.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseleave', handleLeave);
    return () => {
      btn.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, [reducedMotion]);

  const whatsappUrl = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent("Hi Growthway! I'd like to discuss a project commission.")}`
    : "https://wa.me/917607012896?text=Hi%20Growthway!%20I'd%20like%20to%20discuss%20a%20project%20commission.";

  return (
    <section ref={sectionRef} className="final-cta" aria-label="Start a project">
      <div className="final-cta-bg-glow" aria-hidden="true" />

      <div className="final-cta-container">
        
        {/* Editorial Eyebrow */}
        <div className="final-cta-eyebrow-wrap cta-meta">
          <span className="final-cta-dot" />
          <span className="final-cta-eyebrow">COMMISSION INTAKE // VOL. 2026</span>
        </div>

        <h2 className="final-cta-heading">
          <span className="cta-line">Have an idea?</span>
          <span className="cta-line">
            Let's turn it into{' '}
            <span className="cta-accent">impact</span>.
          </span>
        </h2>

        <div className="final-cta-actions cta-meta">
          <Link
            ref={btnRef}
            to="/contact"
            className="final-cta-primary group"
          >
            <span>START A PROJECT</span>
            <span className="final-cta-circle">
              <span className="final-cta-arrow">→</span>
            </span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="final-cta-whatsapp group"
          >
            <span>WHATSAPP DIRECT</span>
            <span className="final-cta-circle final-cta-circle-wa">
              <span className="final-cta-arrow">→</span>
            </span>
          </a>
        </div>

        {/* Foot Stamps */}
        <div className="final-cta-foot-stamps cta-meta">
          <span>Gorakhpur · UP · Global Ventures</span>
          <span>Discovery Review &lt; 24h</span>
        </div>

      </div>
    </section>
  );
}
