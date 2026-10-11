/**
 * FounderCards — Items 25–26
 * Two large portraits: mobile stacked, desktop side-by-side with staggered vertical offset.
 * Art-directed editorial styling with geometric monogram fallback, clip reveal,
 * and subtle parallax.
 * Data from /api/team.
 */

import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './FounderCards.css';

gsap.registerPlugin(ScrollTrigger);

export default function FounderCards() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await api.get('/api/team');
        if (Array.isArray(data) && data.length > 0) {
          setMembers(data);
        } else {
          // Default placeholder team per design doc
          setMembers([
            {
              name: 'Priyanka Barnwal',
              role: 'Founder & Brand Strategist',
              bio: 'Leading strategic brand positioning, corporate narratives, and end-to-end creative direction.',
            },
            {
              name: 'Ajay Ojha',
              role: 'Co-Founder & Creative Director',
              bio: 'Directing design architectures, campaign executions, and experiential digital products.',
            },
          ]);
        }
      } catch {
        setMembers([
          {
            name: 'Priyanka Barnwal',
            role: 'Founder & Brand Strategist',
            bio: 'Leading strategic brand positioning, corporate narratives, and end-to-end creative direction.',
          },
          {
            name: 'Ajay Ojha',
            role: 'Co-Founder & Creative Director',
            bio: 'Directing design architectures, campaign executions, and experiential digital products.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  useGSAP(() => {
    if (loading || !sectionRef.current || reducedMotion) return;

    const cards = sectionRef.current.querySelectorAll('.fc-card');
    const images = sectionRef.current.querySelectorAll('.fc-img-wrap');

    // Clip-reveal images
    if (images.length) {
      gsap.from(images, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        stagger: 0.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Text reveal
    if (cards.length) {
      const texts = sectionRef.current.querySelectorAll('.fc-info');
      gsap.from(texts, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Subtle parallax on images (desktop only)
    if (window.innerWidth > 1024) {
      images.forEach((img, i) => {
        gsap.to(img, {
          y: i % 2 === 0 ? '5%' : '-5%',
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }
  }, { scope: sectionRef, dependencies: [loading, reducedMotion] });

  if (!loading && members.length === 0) return null;

  return (
    <section ref={sectionRef} className="fc-section" aria-label="Our Founders">
      <div className="fc-container">
        
        {/* Editorial Header */}
        <div className="fc-header">
          <div className="fc-eyebrow">
            <span>Leadership // 03</span>
          </div>
          <h2 className="fc-title">
            The Minds Behind <br />
            <span className="text-gw-olive">Growthway</span>
          </h2>
        </div>

        {loading ? (
          <div className="fc-grid">
            {[0, 1].map((i) => (
              <div key={i} className="fc-card">
                <div className="fc-img-wrap fc-placeholder" />
                <div className="fc-info">
                  <div className="fc-skel-name" />
                  <div className="fc-skel-role" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="fc-grid">
            {members.slice(0, 2).map((member, i) => {
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('');

              return (
                <div key={i} className={`fc-card fc-card-${i} group`}>
                  <div className="fc-img-wrap">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        loading="lazy"
                        className="fc-img"
                      />
                    ) : (
                      <div className="fc-placeholder" aria-label={`Portrait of ${member.name}`}>
                        <div className="fc-placeholder-grid" />
                        <div className="fc-monogram-circle">
                          <span>{initials}</span>
                        </div>
                        <div className="fc-placeholder-tag">
                          <span>PARTNER // 0{i + 1}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="fc-info">
                    <div className="fc-meta-row">
                      <span className="fc-num font-mono">0{i + 1}</span>
                      <span className="fc-status-pill">LEADERSHIP</span>
                    </div>
                    <h3 className="fc-name">{member.name}</h3>
                    <p className="fc-role">{member.role}</p>
                    {member.bio && <p className="fc-bio">{member.bio}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
