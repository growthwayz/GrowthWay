import React, { useEffect, useRef } from 'react';
import './Footer.css';

export default function Footer() {
  const ribbonTextRef = useRef(null);
  const parallaxZoneRef = useRef(null);
  const parallaxElsRef = useRef([]);

  // Ribbon Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !ribbonTextRef.current) return;

    const rt = ribbonTextRef.current;
    const unit = '✨ BRANDING \u00A0\u00A0\u00A0 🚀 CONTENT CREATION \u00A0\u00A0\u00A0 📱 SOCIAL MEDIA \u00A0\u00A0\u00A0 📈 DIGITAL CAMPAIGNS \u00A0\u00A0\u00A0 📸 BRAND SHOOTS \u00A0\u00A0\u00A0 ';
    rt.textContent = unit.repeat(4);

    // We need to wait a tick for getComputedTextLength to work in some browsers
    let animationFrameId;
    let off = 0;

    const startAnimation = () => {
      try {
        const unitLen = rt.getComputedTextLength() / 4;
        const tick = () => {
          off -= 0.6;
          if (off <= -unitLen) off += unitLen;
          rt.setAttribute('startOffset', off);
          animationFrameId = requestAnimationFrame(tick);
        };
        tick();
      } catch (e) {
        // Fallback or ignore if getComputedTextLength fails
      }
    };

    // Small timeout to ensure SVG text is rendered before measuring
    setTimeout(startAnimation, 100);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !parallaxZoneRef.current) return;

    let frameId;
    const handleMouseMove = (e) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        // Highly optimized: Use window center instead of forcing layout reflows with getBoundingClientRect
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (e.clientX - centerX) / 45;
        const moveY = (e.clientY - centerY) / 45;

        parallaxElsRef.current.forEach((el) => {
          if (!el) return;
          const speed = parseFloat(el.getAttribute('data-speed') || '0');
          el.style.translate = `${moveX * speed}px ${moveY * speed}px`;
        });
      });
    };

    const handleMouseLeave = () => {
      parallaxElsRef.current.forEach((el) => {
        if (!el) return;
        el.style.translate = '0px 0px';
      });
    };

    const zone = parallaxZoneRef.current;
    zone.addEventListener('mousemove', handleMouseMove);
    zone.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      zone.removeEventListener('mousemove', handleMouseMove);
      zone.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 3D Magnetic Card Hover
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.magnetic-card');

    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      // getBoundingClientRect is fast here since transform doesn't invalidate layout
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      // Decouple DOM writes
      requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    };

    const handleMouseLeave = (e) => {
      const card = e.currentTarget;
      requestAnimationFrame(() => {
        card.style.transform = '';
      });
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const addParallaxRef = (el) => {
    if (el && !parallaxElsRef.current.includes(el)) {
      parallaxElsRef.current.push(el);
    }
  };

  return (
    <footer className="footer-wrapper">
      {/* Wave Ribbon */}
      <div className="ribbon-container">
        <svg className="ribbon-svg" viewBox="0 0 1440 120" preserveAspectRatio="xMidYMin slice">
          <defs>
            <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#263326" />
              <stop offset="50%" stopColor="#3D4A36" />
              <stop offset="100%" stopColor="#263326" />
            </linearGradient>
            <path id="text-path" d="M-100,50 Q360,10 720,50 T1540,50" fill="none" />
          </defs>
          <path d="M-100,50 Q360,10 720,50 T1540,50" fill="none" stroke="url(#ribbonGrad)" strokeWidth="44" strokeLinecap="round" />
          <text fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="13" fill="#ffffff" letterSpacing="3" dy="5">
            <textPath ref={ribbonTextRef} href="#text-path" startOffset="0"></textPath>
          </text>
        </svg>
      </div>

      <div ref={parallaxZoneRef} className="main-grid parallax-zone">

        {/* LEFT SIDE */}
        <div className="left-zone">
          <div ref={addParallaxRef} className="center-g parallax-el" data-speed="0.02">G</div>

          {/* Map Coordinates */}
          <div className="map-info">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div>MUMBAI, INDIA<br />19.0760° N<br />72.8777° E &rarr;</div>
          </div>

          {/* Process Nodes */}
          <div ref={addParallaxRef} className="process-node node-1 cursor-hover parallax-el" data-speed="-0.04">
            <div className="node-icon-wrapper icon-idea">
              <svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2 1 3.9 2.5 5.1C8.8 15.2 9 16.5 9 18v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1c0-1.5.2-2.8 1.5-3.9C18 12.9 19 11 19 9a7 7 0 0 0-7-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="node-text-wrapper">
              <div className="top-line"><span className="num">01</span><span className="title">IDEA</span></div>
              <div className="desc">Research • Trends</div>
            </div>
          </div>

          <div ref={addParallaxRef} className="process-node node-2 cursor-hover parallax-el" data-speed="0.05">
            <div className="node-icon-wrapper icon-strategy">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>
            </div>
            <div className="node-text-wrapper">
              <div className="top-line"><span className="num">02</span><span className="title">STRATEGY</span></div>
              <div className="desc">Planning • Audience</div>
            </div>
          </div>

          <div ref={addParallaxRef} className="process-node node-3 cursor-hover parallax-el" data-speed="0.06">
            <div className="node-icon-wrapper icon-creative">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="node-text-wrapper">
              <div className="top-line"><span className="num">03</span><span className="title">CREATIVE</span></div>
              <div className="desc">Branding • Design</div>
            </div>
          </div>

          <div ref={addParallaxRef} className="process-node node-4 cursor-hover parallax-el" data-speed="-0.05">
            <div className="node-icon-wrapper icon-execution">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /></svg>
            </div>
            <div className="node-text-wrapper">
              <div className="top-line"><span className="num">04</span><span className="title">EXECUTION</span></div>
              <div className="desc">Production • Campaigns</div>
            </div>
          </div>

          <div ref={addParallaxRef} className="process-node node-5 cursor-hover parallax-el" data-speed="0.04">
            <div className="node-icon-wrapper icon-impact">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"></polyline></svg>
            </div>
            <div className="node-text-wrapper">
              <div className="top-line"><span className="num">05</span><span className="title" style={{ color: 'var(--text-dark)' }}>IMPACT</span></div>
              <div className="desc">Growth • Results</div>
            </div>
          </div>

          {/* Polaroids */}
          <div ref={addParallaxRef} className="polaroid polaroid-1 cursor-hover parallax-el" data-speed="0.07" data-cap="BRANDING">
            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=500&fit=crop" alt="Photography" loading="lazy" decoding="async" />
          </div>

          <div ref={addParallaxRef} className="polaroid polaroid-2 cursor-hover parallax-el" data-speed="0.04" data-cap="DIGITAL">
            <div style={{ width: '100%', height: '100%', background: '#111', borderRadius: '2px' }}></div>
          </div>

          <div ref={addParallaxRef} className="polaroid polaroid-3 cursor-hover parallax-el" data-speed="-0.06" data-cap="CAMPAIGNS">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop" alt="Production" loading="lazy" decoding="async" />
          </div>

          {/* Brands Box */}
          <div ref={addParallaxRef} className="brands-box cursor-hover parallax-el" data-speed="0.08">
            GOOD<br />BRANDS<br />GROW<br />PEOPLE.
            <div className="heart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <div className="mini-chart"><span></span><span></span><span></span></div>
          </div>

          {/* Sticky Note & Hand-drawn elements */}
          <div ref={addParallaxRef} className="sticky-note cursor-hover parallax-el" data-speed="-0.05">
            <svg className="hand-arrow" viewBox="0 0 50 20"><path d="M50,10 Q25,0 0,10 M10,0 L0,10 L10,20" strokeLinecap="round" /></svg>
            Creative<br />Ideas<br />Real<br />Growth.
          </div>

          <div ref={addParallaxRef} className="hand-text hand-1 parallax-el" data-speed="-0.07">
            From Ideas<br />to Impact.
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-zone">
          <div className="glass-backdrop"></div>

          <div ref={addParallaxRef} className="hand-text right-hand-1 parallax-el" data-speed="0.06">Let's build something! ➔</div>
          <div ref={addParallaxRef} className="hand-text right-hand-2 parallax-el" data-speed="-0.04">Good<br />Brands<br />Grow<br />People.</div>

          <div className="cards-container">
            {/* Column 1: Explore */}
            <div className="right-glass magnetic-card col-r1">
              <h4 className="card-heading">EXPLORE</h4>
              <ul className="link-list">
                <li><a href="#work" className="cursor-hover"><span className="link-num">01</span> WORK</a></li>
                <li><a href="#services" className="cursor-hover"><span className="link-num">02</span> SERVICES</a></li>
                <li><a href="#about" className="cursor-hover"><span className="link-num">03</span> ABOUT</a></li>
                <li><a href="#culture" className="cursor-hover"><span className="link-num">04</span> CULTURE</a></li>
                <li><a href="#contact" className="cursor-hover"><span className="link-num">05</span> CONTACT</a></li>
              </ul>
            </div>

            {/* Column 2: Services */}
            <div className="right-glass magnetic-card col-r2">
              <h4 className="card-heading">OUR SERVICES</h4>
              <ul className="link-list">
                <li><a href="#services" className="cursor-hover">Branding & Identity</a></li>
                <li><a href="#services" className="cursor-hover">Content Creation</a></li>
                <li><a href="#services" className="cursor-hover">Social Media Mgmt</a></li>
                <li><a href="#services" className="cursor-hover">Digital Campaigns</a></li>
                <li><a href="#services" className="cursor-hover">Brand Shoots</a></li>
                <li><a href="#services" className="cursor-hover">Web Development</a></li>
              </ul>
            </div>

            {/* Column 3: Let's Talk */}
            <div className="right-glass magnetic-card col-r3">
              <h4 className="card-heading">LET'S TALK</h4>
              <div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <span>hello@growthway.in</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <a href="#start-project" className="btn-whatsapp cursor-hover">
                <div className="text">
                  <span>CHAT ON</span>
                  <span>WHATSAPP</span>
                </div>
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              </a>
            </div>

            {/* Column 4: Follow Us */}
            <div className="right-glass magnetic-card col-r4">
              <div className="dark-polaroid-frame"></div>
              <h4 className="card-heading">FOLLOW US</h4>
              <ul className="link-list">
                <li><a href="#" className="cursor-hover">
                  <div className="social-icon-box"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></div>
                  Instagram
                </a></li>
                <li><a href="#" className="cursor-hover">
                  <div className="social-icon-box"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></div>
                  LinkedIn
                </a></li>
                <li><a href="#" className="cursor-hover">
                  <div className="social-icon-box"><svg viewBox="0 0 24 24" className="fill-icon"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff" /></svg></div>
                  YouTube
                </a></li>
                <li><a href="#" className="cursor-hover">
                  <div className="social-icon-box"><svg viewBox="0 0 24 24" className="fill-icon"><path d="M8.22 10.97c1.33 0 2.22-.88 2.22-2.12 0-1.12-.8-1.95-2.03-1.95H4.27v4.07h3.95zm-.76 5.51c1.55 0 2.52-.96 2.52-2.3 0-1.42-1.05-2.26-2.52-2.26H4.27v4.56h3.19zM0 22h24V2H0v20zm12.3-9.98c0 1.76.54 3.03 1.55 3.84 1 .8 2.45 1.15 4.18 1.15 1.57 0 2.87-.27 3.86-.78V13.8c-.8.5-1.93.8-3.1.8-2.05 0-3.1-1.07-3.15-3.08h6.42v-.64c0-3.3-1.6-5.07-4.66-5.07-3.1 0-5.1 2.05-5.1 5.21zm2.34-11h4.94v1.85h-4.94V1.02zm5.06 6.94c0 1.25-.8 2.05-2.34 2.05h-2.3v-3.95c1.45 0 2.28.62 2.28 1.9z" /></svg></div>
                  Behance
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="legal-bar">
        <div>&copy; 2026 GROWTHWAY. ALL RIGHTS RESERVED.</div>
        <div className="legal-links">
          <a href="#" className="cursor-hover">PRIVACY POLICY</a>
          <a href="#" className="cursor-hover">TERMS OF SERVICE</a>
        </div>
        <div className="intent-text">DESIGNED WITH INTENT. BUILT FOR IMPACT.</div>
      </div>
    </footer>
  );
}
