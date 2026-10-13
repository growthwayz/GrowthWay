/**
 * FounderCards — Leadership Section
 * Art-directed editorial feature for Priyanka Barnwal (Founder & Creative Director).
 * Left: Photographic portrait with production badges.
 * Right: Attractive luxury introduction, vision statement, capability tags, and impact metrics.
 */

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import priyankaPhoto from '../../assets/Priyanka Barnwal.jpeg';
import './FounderCards.css';

gsap.registerPlugin(ScrollTrigger);

export default function FounderCards() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!sectionRef.current || reducedMotion) return;

    const imgWrap = sectionRef.current.querySelector('.fc-single-img-wrap');
    const content = sectionRef.current.querySelector('.fc-single-content');

    if (imgWrap) {
      gsap.from(imgWrap, {
        opacity: 0,
        x: -30,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }

    if (content) {
      gsap.from(content, {
        opacity: 0,
        x: 30,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }
  }, { scope: sectionRef, dependencies: [reducedMotion] });

  return (
    <section ref={sectionRef} className="fc-section" aria-label="Leadership">
      <div className="fc-container">
        
        {/* Editorial Header */}
        <div className="fc-header">
          <div className="fc-eyebrow">
            <span>Leadership // Founder</span>
          </div>
          <h2 className="fc-title">
            The Minds Behind <br />
            <span className="text-gw-olive">Growthway</span>
          </h2>
        </div>

        {/* 2-Column Editorial Profile: Left Photo Tab, Right Attractive Intro */}
        <div className="fc-single-layout">
          
          {/* Left Column: Framed Image Tab */}
          <div className="fc-single-media-col">
            <div className="fc-single-img-wrap group">
              <img
                src={priyankaPhoto}
                alt="Priyanka Barnwal — Founder & Creative Director at Growthway"
                className="fc-single-img"
                loading="lazy"
              />

              {/* Top Floating Status Pill */}
              <div className="fc-badge-top">
                <span className="fc-badge-dot" />
                <span>FOUNDER & LEAD DIRECTOR</span>
              </div>
            </div>
          </div>

          {/* Right Column: Attractive Introduction */}
          <div className="fc-single-content">
            
            <div className="fc-content-badge">
              <span>EXECUTIVE CREATIVE DIRECTION</span>
            </div>

            <h3 className="fc-founder-name">Priyanka Barnwal</h3>
            <p className="fc-founder-role">Founder, Creative Director & Strategic Lead</p>

            {/* Core Conviction Quote */}
            <blockquote className="fc-founder-quote">
              “True brand power isn’t about chasing algorithmic noise — it’s about crafting undeniable visual worlds that command culture and compel action.”
            </blockquote>

            {/* Editorial Biography — Stylized Art Direction */}
            <div className="fc-founder-bio-card">
              <p className="fc-founder-bio">
                <span className="fc-bio-highlight">Priyanka is the creative heartbeat</span> and founding visionary of GrowthWay. With an instinctive eye for <span className="fc-bio-accent">cinematography</span>, <span className="fc-bio-accent">high-retention visual storytelling</span>, and <span className="fc-bio-accent">brand architecture</span>, she bridges the gap between raw artistic expression and measurable commercial growth.
              </p>
            </div>


          </div>

        </div>

      </div>
    </section>
  );
}
