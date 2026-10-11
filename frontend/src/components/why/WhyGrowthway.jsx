/**
 * WhyGrowthway — Item 21
 * Manifesto section: STRATEGY / CREATIVITY / EXECUTION.
 * Art-directed editorial layout matching Hero & SignatureExperience.
 * Content from /api/site-settings → whyGrowthway.
 */

import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './WhyGrowthway.css';

gsap.registerPlugin(ScrollTrigger);

export default function WhyGrowthway() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/api/site-settings');
        if (settings.whyGrowthway && settings.whyGrowthway.items?.length) {
          setData(settings.whyGrowthway);
        }
      } catch {
        // Silently fail — section will hide
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useGSAP(() => {
    if (loading || !data || !sectionRef.current || reducedMotion) return;

    const words = sectionRef.current.querySelectorAll('.why-word');
    const lines = sectionRef.current.querySelectorAll('.why-line');
    const nums = sectionRef.current.querySelectorAll('.why-num');
    const intro = sectionRef.current.querySelector('.why-intro');

    if (intro) {
      gsap.from(intro, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (words.length) {
      gsap.from(words, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: words[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (nums.length) {
      gsap.from(nums, {
        x: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: words[0] || sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (lines.length) {
      gsap.from(lines, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: words[0] || sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: sectionRef, dependencies: [loading, data, reducedMotion] });

  if (loading) return null;
  if (!data || !data.items?.length) return null;

  return (
    <section ref={sectionRef} className="why-section" aria-label="Why Growthway">
      <div className="why-container">
        
        {/* Eyebrow & Metadata Header */}
        <div className="why-header">
          <div className="why-eyebrow">
            <span className="why-eyebrow-line" />
            <span>02 // The Manifesto</span>
          </div>
          <span className="why-corner-tag">PRINCIPLES · VOL. 2026</span>
        </div>

        {data.intro && (
          <p className="why-intro">{data.intro}</p>
        )}

        <div className="why-manifesto">
          {data.items.map((item, i) => (
            <div key={i} className="why-row group">
              <div className="why-row-inner">
                <span className="why-num">0{i + 1}</span>
                <div className="why-content">
                  <h3 className="why-word">{item.word}</h3>
                  <p className="why-line">{item.line}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Architectural Stamp */}
        <div className="why-footer-stamp">
          <span>End-To-End Growth Architecture</span>
          <span>Zero Bureaucracy · Direct Founder Oversight</span>
        </div>

      </div>
    </section>
  );
}
