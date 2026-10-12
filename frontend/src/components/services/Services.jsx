import React, { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import './Services.css';

const mockServicesData = [
  {
    id: '01',
    title: 'Social Media Strategy & Management',
    slug: 'social-media-strategy-management',
    status: 'ACTIVE',
    description: 'Strategy, planning, content direction, and ongoing social media management built for organic engagement and brand presence.',
    capabilities: ['Content Strategy & Calendar', 'Community Engagement', 'Trend Analysis & Ideation', 'Performance Reporting'],
    media: {
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
      tags: ['Strategy', 'Distribution', 'Social']
    }
  },
  {
    id: '02',
    title: 'Content Creation & Reels',
    slug: 'content-creation-reels',
    status: 'DEPLOYED',
    description: 'Creative content, short-form videos, reels, and platform-focused visual storytelling engineered to stop the scroll.',
    capabilities: ['Short-Form Video & Reels', 'Creative Direction', 'Platform Native Visuals', 'Post-Production & Editing'],
    media: {
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
      tags: ['Reels', 'Visual Storytelling', 'Production']
    }
  },
  {
    id: '03',
    title: 'Branding & Design',
    slug: 'branding-design',
    status: 'ACTIVE',
    description: 'Brand identity, visual direction, design systems, and creative assets that establish a distinctive and memorable presence.',
    capabilities: ['Brand Identity & Systems', 'Visual Direction', 'Typography & Guidelines', 'Collateral & Digital Assets'],
    media: {
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop',
      tags: ['Identity', 'Design Systems', 'Art Direction']
    }
  },
  {
    id: '04',
    title: 'Digital Marketing / Meta Ads',
    slug: 'digital-marketing-meta-ads',
    status: 'SCALING',
    description: 'Paid campaigns and digital marketing focused on reaching the right audience and driving measurable business growth.',
    capabilities: ['Meta Paid Campaigns', 'Target Audience Segmentation', 'Ad Creative Iteration', 'Funnel Optimization'],
    media: {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      tags: ['Paid Media', 'Meta Ads', 'Growth']
    }
  },
  {
    id: '05',
    title: 'Website Development',
    slug: 'website-development',
    status: 'ONLINE',
    description: 'Modern, responsive websites designed around brand positioning, flawless usability, and high-conversion UX.',
    capabilities: ['Responsive Architecture', 'Interactive Web Experiences', 'Performance & SEO', 'CMS & Growth Integrations'],
    media: {
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
      tags: ['Web Design', 'Development', 'Conversion']
    }
  },
  {
    id: '06',
    title: 'Brand & Product Shoots',
    slug: 'brand-product-shoots',
    status: 'ACTIVE',
    description: 'Professional photography and video content for products, brands, and campaigns that look extraordinary.',
    capabilities: ['Product Photography', 'Brand Campaign Shoots', 'Lifestyle & Lookbook', 'Video Content for Campaigns'],
    media: {
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
      tags: ['Photography', 'Campaign Shoots', 'Art Direction']
    }
  },
  {
    id: '07',
    title: 'Event & Campaign Content',
    slug: 'event-campaign-content',
    status: 'DEPLOYED',
    description: 'On-ground event coverage and campaign content designed for rapid digital distribution and maximum reach.',
    capabilities: ['Event Photography & Videography', 'Live Coverage & Reels', 'Campaign Content Production', 'Multi-Platform Distribution'],
    media: {
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
      tags: ['Event Coverage', 'Live Reels', 'Distribution']
    }
  },
  {
    id: '08',
    title: 'Personal Brand Growth',
    slug: 'personal-brand-growth',
    status: 'ACTIVE',
    description: 'Content, positioning, and digital strategy for founders, creators, and professionals building their personal brand.',
    capabilities: ['Personal Brand Strategy', 'Content Direction & Creation', 'Social Media Presence', 'Thought Leadership Content'],
    media: {
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop',
      tags: ['Personal Brand', 'Founders', 'Strategy']
    }
  }
];

export default function Services() {
  const [servicesData, setServicesData] = useState(mockServicesData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModalId, setActiveModalId] = useState(null);
  
  const stageRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const data = await api.get('/api/services');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const merged = data.map((item, index) => {
            const fallback = mockServicesData[index] || mockServicesData[0];
            return {
              id: String(item.order || index + 1).padStart(2, '0'),
              title: item.title,
              slug: item.slug,
              status: fallback.status || 'ACTIVE',
              description: item.description || fallback.description,
              capabilities: item.capabilities?.length ? item.capabilities : fallback.capabilities,
              media: fallback.media,
            };
          });
          setServicesData(merged);
        }
      } catch (err) {
        // Graceful fallback to verified 8 services
      }
    };
    fetchServices();
    return () => { isMounted = false; };
  }, []);

  // Micro-parallax on stage for desktop — CPU optimized via requestAnimationFrame
  useEffect(() => {
    let animId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMoving = false;

    const handleMouseMove = (e) => {
      if (window.innerWidth <= 1024) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 8;
      targetY = (e.clientY / window.innerHeight - 0.5) * -8;
      if (!isMoving) {
        isMoving = true;
        animId = requestAnimationFrame(updateParallax);
      }
    };

    const updateParallax = () => {
      // Smooth lerp (linear interpolation) for silky motion without CPU event flooding
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (stageRef.current) {
        stageRef.current.style.transform = `rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;
      }

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        animId = requestAnimationFrame(updateParallax);
      } else {
        isMoving = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Handle body overflow and Escape key when modal is open
  useEffect(() => {
    if (activeModalId !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveModalId(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
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
    <div className="services-wrapper" id="services-section">
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
                {servicesData.map((service, index) => {
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
                    })}
              </div>
           </div>

           {/* RIGHT COLUMN (3D COLLAGE) */}
           <div className="services-media-viewport hide-mobile">
              <div className="media-stage" id="services-media-container" ref={stageRef}>
                 {servicesData.map((service, index) => {
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
                            <div className="w-bar"><div className="w-fill" style={{ width: `${60 + ((index * 8) % 35)}%` }}></div></div>
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
           <button className="modal-close cursor-hover" onClick={closeModal} aria-label="Close service details">CLOSE SYSTEM</button>
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
                      <a
                        href="/contact"
                        className="btn-explore cursor-hover"
                        style={{
                          marginTop: '2rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'var(--accent)',
                          color: '#ffffff',
                          textDecoration: 'none',
                          padding: '12px 28px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          letterSpacing: '0.05em'
                        }}
                      >
                        DISCUSS YOUR PROJECT →
                      </a>
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
