/**
 * ClientLogos — Item 22
 * Grayscale logo strip on light canvas, color on hover.
 * Hides entirely if API returns no clients.
 * Lazy-loads images, fixed aspect boxes to avoid layout shift.
 */

import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../../lib/api';
import useReducedMotion from '../../hooks/useReducedMotion';
import './ClientLogos.css';

gsap.registerPlugin(ScrollTrigger);

export default function ClientLogos() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await api.get('/api/clients');
        setClients(data);
      } catch {
        // Silently hide
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  useGSAP(() => {
    if (loading || !sectionRef.current || reducedMotion) return;
    const items = sectionRef.current.querySelectorAll('.cl-item');
    if (!items.length) return;

    gsap.from(items, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef, dependencies: [loading, reducedMotion] });

  if (!loading && clients.length === 0) return null;

  return (
    <section ref={sectionRef} className="cl-section" aria-label="Trusted by">
      <div className="cl-container">
        <p className="cl-label">Trusted by</p>

        {loading ? (
          <div className="cl-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cl-skeleton-box" />
            ))}
          </div>
        ) : (
          <div className="cl-grid">
            {clients.map((client, i) => (
              <div key={i} className="cl-item" title={client.name}>
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    width="160"
                    height="80"
                    className="cl-logo"
                  />
                ) : (
                  <span className="cl-placeholder">{client.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
