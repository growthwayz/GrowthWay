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

const DEFAULT_WHY_GROWTHWAY = {
  intro: 'Everything your brand needs to grow — strategy, creativity, and execution, all under one roof.',
  items: [
    {
      word: 'STRATEGY',
      line: 'Personalised plans rooted in real market insight.',
      tags: ['Audience Insight', 'Brand Architecture', 'Growth Roadmap'],
      proof: 'Strategy before execution — every decision tied to commercial revenue.',
    },
    {
      word: 'CREATIVITY',
      line: 'End-to-end design and content that stands out in crowded feeds.',
      tags: ['High-Retention Video', 'Visual Identity', 'Motion Graphics'],
      proof: 'Scroll-stopping creative engineered to convert attention into affinity.',
    },
    {
      word: 'EXECUTION',
      line: 'Practical, results-driven campaigns that deliver verified growth.',
      tags: ['Performance Campaigns', 'Paid Social / Meta Ads', 'Rapid Sprints'],
      proof: 'Agile sprints with direct founder-level accountability and zero bureaucracy.',
    },
  ],
};

const PILLAR_METADATA = [
  {
    tags: ['Audience Insight', 'Brand Architecture', 'Growth Roadmap'],
    proof: 'Strategy before execution — every decision tied to commercial revenue.',
  },
  {
    tags: ['High-Retention Video', 'Visual Identity', 'Motion Graphics'],
    proof: 'Scroll-stopping creative engineered to convert attention into affinity.',
  },
  {
    tags: ['Performance Campaigns', 'Paid Social / Meta Ads', 'Rapid Sprints'],
    proof: 'Agile sprints with direct founder-level accountability and zero bureaucracy.',
  },
];

export default function WhyGrowthway() {
  const [data, setData] = useState(DEFAULT_WHY_GROWTHWAY);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const settings = await api.get('/api/site-settings');
        if (isMounted && settings?.whyGrowthway?.items?.length) {
          // If backend has the official manifesto or customized items, use it; otherwise preserve DEFAULT_WHY_GROWTHWAY
          if (settings.whyGrowthway.intro && !settings.whyGrowthway.intro.includes('A new agency built on practical experience')) {
            setData(settings.whyGrowthway);
          } else {
            setData(DEFAULT_WHY_GROWTHWAY);
          }
        }
      } catch {
        // Graceful fallback to default brand manifesto
      }
    };
    fetchSettings();
    return () => { isMounted = false; };
  }, []);

  useGSAP(() => {
    if (!data || !sectionRef.current || reducedMotion) return;

    const rows = sectionRef.current.querySelectorAll('.why-row');
    const intro = sectionRef.current.querySelector('.why-intro');

    if (intro) {
      gsap.from(intro, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (rows.length) {
      gsap.from(rows, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: rows[0] || sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: sectionRef, dependencies: [data, reducedMotion] });

  if (!data || !data.items?.length) return null;

  return (
    <section ref={sectionRef} className="why-section" aria-label="Why Growthway">
      <div className="why-container">
        
        {/* Eyebrow & Metadata Header */}
        <div className="why-header">
          <div className="why-eyebrow">
            <span className="why-eyebrow-line" />
            <span>The Manifesto</span>
          </div>
          <span className="why-corner-tag">PRINCIPLES // ALL UNDER ONE ROOF</span>
        </div>

        {data.intro && (
          <h2 className="why-intro">{data.intro}</h2>
        )}

        <div className="why-manifesto">
          {data.items.map((item, i) => {
            const meta = PILLAR_METADATA[i] || {};
            const tags = item.tags || meta.tags || [];
            const proof = item.proof || meta.proof || '';

            return (
              <div key={i} className="why-row group">
                <div className="why-row-inner">
                  <div className="why-num-wrap">
                    <span className="why-num">0{i + 1}</span>
                    <span className="why-num-dot" />
                  </div>

                  <div className="why-content">
                    <div className="why-top-line">
                      <h3 className="why-word">{item.word}</h3>
                      {proof && (
                        <span className="why-proof-badge">{proof}</span>
                      )}
                    </div>

                    <p className="why-line">{item.line}</p>

                    {tags.length > 0 && (
                      <div className="why-tags">
                        {tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="why-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
