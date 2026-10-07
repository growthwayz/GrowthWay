import React, { useState, useEffect, useRef } from 'react';
import './Services.css';

const mockServicesData = [
  {
    id: '01',
    title: 'Brand Strategy',
    slug: 'brand-strategy',
    status: 'ONLINE',
    description: 'Positioning, audience insight, and a creative direction your entire team can rally behind to build meaningful market share.',
    capabilities: ['Market & Audience Research', 'Brand Positioning & Purpose', 'Go-to-Market Strategy', 'Voice & Messaging Architecture'],
    media: {
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
      tags: ['Positioning', 'Research', 'Architecture']
    }
  },
  {
    id: '02',
    title: 'Identity & Design',
    slug: 'identity-design',
    status: 'ACTIVE',
    description: 'Logos, comprehensive visual systems, and UI/UX design with a distinct point of view that stays consistent across all touchpoints.',
    capabilities: ['Logo & Visual Identity', 'Design Systems & Guidelines', 'Website UI/UX Design', 'Packaging & Print Graphics'],
    media: {
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
      tags: ['Visual System', 'UI/UX', 'Art Direction']
    }
  },
  {
    id: '03',
    title: 'Content & Social',
    slug: 'content-social',
    status: 'DEPLOYED',
    description: 'Scroll-stopping brand storytelling, video production, and social media calendars built natively for algorithmic reach and engagement.',
    capabilities: ['Video Production & Editing', 'Social Media Management', 'Editorial & Copywriting', 'Influencer & Creator Campaigns'],
    media: {
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
      tags: ['Production', 'Editorial', 'Social']
    }
  },
  {
    id: '04',
    title: 'Growth Campaigns',
    slug: 'growth-campaigns',
    status: 'SCALING',
    description: 'End-to-end execution from creative production to performance marketing and distribution, measured strictly against real business outcomes.',
    capabilities: ['Performance Marketing (Ads)', 'SEO & Organic Growth', 'Conversion Rate Optimization', 'Data Analytics & Reporting'],
    media: {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      tags: ['Performance', 'Analytics', 'Scale']
    }
  }
];

export default function Services() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModalId, setActiveModalId] = useState(null);
  
  const stageRef = useRef(null);

  useEffect(() => {
    // Simulate API Fetch to /api/services
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 400));
        setServicesData(mockServicesData);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Micro-parallax on stage for desktop
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth > 1024 && stageRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 8; 
        const y = (e.clientY / window.innerHeight - 0.5) * -8;
        stageRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle body overflow when modal is open
  useEffect(() => {
    if (activeModalId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalId]);

  const toggleAccordion = (index, e) => {
    if (e.target.closest('.trigger-modal')) return;
    if (window.innerWidth <= 1024) {
      setActiveIndex(activeIndex === index ? -1 : index);
    } else {
      setActiveIndex(index);
    }
  };

  const openModal = (id, e) => {
    e.stopPropagation();
    setActiveModalId(id);
  };

  const closeModal = () => {
    setActiveModalId(null);
  };

  const activeServiceModalData = servicesData.find(s => s.id === activeModalId);

  return (
    <div className="services-wrapper cursor-none" id="services-section">
      <div className="grain"></div>

      {/* Sticky HUD Container (Acts like fixed but only inside Services) */}
      <div className="services-sticky-hud">
        {/* Maximalist Background & HUD */}
        <div className="master-grid"></div>
        <div className="bg-watermark">CREATIVE SYSTEM 001</div>
        <div className="vertical-rule vr-1"></div>
        <div className="vertical-rule vr-2"></div>
        <div className="vertical-rule vr-3"></div>

        <div className="hud-element hud-tl">
          <span>GROWTHWAY.AGENCY</span>
          <span style={{ color: 'var(--accent)' }}>LAT: 19.0760 / LON: 72.8777</span>
        </div>
        <div className="hud-element hud-tr">SYS.REV.04</div>
        <div className="hud-element hud-bl">SCROLL TO EXPLORE ↓</div>
        <div className="hud-element hud-br"><i></i> SYSTEM ONLINE</div>
      </div>

      <section className="services-section">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>

        <div className="services-grid">
           {/* LEFT COLUMN */}
           <div className="left-column">
              <div className="services-header">
                 <div>
                   <p>Growthway Capabilities</p>
                   <h2>Services.</h2>
                 </div>
              </div>
              
              <div className="services-list" id="services-list-container">
                 {loading ? (
                    <div className="loading-state">ESTABLISHING SECURE CONNECTION...</div>
                 ) : error ? (
                    <div className="loading-state" style={{ color: '#E87A7A' }}>[CRITICAL ERROR] UNABLE TO FETCH ASSETS.</div>
                 ) : (
                    servicesData.map((service, index) => {
                      const isActive = activeIndex === index;
                      return (
                        <div 
                          key={service.id}
                          className={`svc-item cursor-hover ${isActive ? 'active' : ''}`} 
                          data-num={service.id}
                          onMouseEnter={() => window.innerWidth > 1024 && setActiveIndex(index)}
                          onClick={(e) => toggleAccordion(index, e)}
                        >
                           <div className="svc-tracker"></div>
                           <div className="svc-meta">
                              <span className="svc-num">SYS.{service.id}</span>
                              <span className="svc-status">[ {service.status} ]</span>
                           </div>
                           <h3 className="svc-title trigger-modal cursor-hover" onClick={(e) => openModal(service.id, e)}>
                             <i>→</i> {service.title}
                           </h3>
                           
                           {/* MOBILE ACCORDION */}
                           <div className={`mobile-content ${isActive ? 'expanded' : ''}`}>
                              <div className="mobile-inner">
                                 <div className="mobile-img-wrap float-element">
                                    <div className="tape"></div>
                                    <img src={service.media.image} alt={service.title} />
                                 </div>
                                 <div className="tags" style={{ marginBottom: '1.5rem' }}>
                                    {service.media.tags.map(t => (
                                      <span key={t} className="tag outline">{t}</span>
                                    ))}
                                 </div>
                                 <p>{service.description}</p>
                                 <button 
                                   className="btn-explore trigger-modal cursor-hover" 
                                   onClick={(e) => openModal(service.id, e)} 
                                   style={{ width: '100%', justifyContent: 'center' }}
                                 >
                                   View Capabilities
                                 </button>
                              </div>
                           </div>
                        </div>
                      );
                    })
                 )}
              </div>
           </div>

           {/* RIGHT COLUMN (3D COLLAGE) */}
           <div className="services-media-viewport hide-mobile">
              <div className="media-stage" id="services-media-container" ref={stageRef}>
                 {!loading && !error && servicesData.map((service, index) => {
                    const isActive = activeIndex === index;
                    return (
                      <div key={service.id} className={`media-group ${isActive ? 'active' : ''}`}>
                         <div className="media-bg-num">{service.id}</div>
                         <div className="decor hollow-ring"></div>
                         
                         <div className="media-polaroid float-element">
                            <div className="tape"></div>
                            <div className="art" style={{ backgroundImage: `url('${service.media.image}')` }}></div>
                            <em>Fig. {service.id} // {service.title}</em>
                         </div>

                         <div className="media-glass float-element">
                            <div className="tags">
                              {service.media.tags.map(t => (
                                <span key={t} className="tag">{t}</span>
                              ))}
                            </div>
                            <p>{service.description}</p>
                            <button className="btn-explore trigger-modal cursor-hover" onClick={(e) => openModal(service.id, e)}>
                              Access Sub-System
                            </button>
                         </div>

                         {/* Dense Decorative Floating Elements */}
                         <div className="decor widget-spec float-element">
                            <span className="w-title">SYS LOAD // {service.id}</span>
                            <div className="w-bar"><div className="w-fill" style={{ width: `${Math.floor(Math.random() * 40 + 50)}%` }}></div></div>
                            <span className="w-title">OPTIMAL</span>
                         </div>
                         
                         <div className="decor widget-grid float-element"></div>
                         <div className="decor crosshair float-element"></div>

                         <div className="decor ui-node float-element">
                            <div className="ui-node-left"><i></i><span>SYNC</span></div>
                            <div className="chart"><div></div><div></div><div></div></div>
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </section>

      {/* FULL SCREEN SERVICE DETAIL MODAL */}
      <div className={`modal-overlay ${activeModalId ? 'is-open' : ''}`} id="service-modal">
        <div className="modal-header-bar">
           <div style={{ fontFamily: 'var(--sp)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--bg)' }}>Growthway.</div>
           <button className="modal-close cursor-hover" onClick={closeModal}>CLOSE SYSTEM</button>
        </div>
        <div className="modal-container" id="modal-content">
           {activeServiceModalData && (
             <>
                <span className="modal-sys-id"><i></i> SYSTEM {activeServiceModalData.id} ACTIVATE</span>
                <h2 className="modal-hero-title">{activeServiceModalData.title}</h2>
                
                <div className="tags" style={{ marginBottom: '3rem' }}>
                  {activeServiceModalData.media.tags.map(t => (
                    <span key={t} className="tag outline" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>{t}</span>
                  ))}
                </div>

                <img src={activeServiceModalData.media.image} alt={activeServiceModalData.title} className="modal-hero-img float-element" />

                <div className="modal-body-grid">
                   <div>
                      <div style={{ width: '40px', height: '4px', background: 'var(--accent)', marginBottom: '2rem' }}></div>
                      <p className="modal-desc-large">{activeServiceModalData.description}</p>
                      <button className="btn-explore cursor-hover" style={{ marginTop: '2rem', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                        INITIALIZE PROJECT
                      </button>
                   </div>
                   <div>
                      <h3 style={{ fontFamily: 'var(--mono)', fontSize: '1rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        System Capabilities
                      </h3>
                      <ul className="modal-caps-list">
                         {activeServiceModalData.capabilities.map(cap => (
                           <li key={cap}>{cap}</li>
                         ))}
                      </ul>
                   </div>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
