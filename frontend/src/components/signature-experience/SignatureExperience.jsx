import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './SignatureExperience.css';

gsap.registerPlugin(ScrollTrigger);

export default function SignatureExperience() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. ELEMENT FLOATING ONLY (No Screen Swaying)
    gsap.utils.toArray('.sig-float').forEach((el) => {
      gsap.to(el, {
        y: "+=12",
        rotationZ: "+=1",
        duration: gsap.utils.random(2.5, 4.5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 2)
      });
    });

    // 2. STEPPED SCROLL TIMELINE (Smooth Z-Depth transitions)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",

        scrub: 0.5, // Reduced scrub delay so the animation doesn't lag behind the physical scroll when flicking the wheel
        onUpdate: (self) => {
          const p = self.progress;
          const bar = document.getElementById("sig-bar");
          if (bar) bar.style.transform = `scaleX(${p})`;
          
          const idx = Math.min(4, Math.floor(p * 5));
          document.querySelectorAll(".sig-rail i").forEach((dot, i) => {
            dot.classList.toggle("on", i === idx);
          });
        }
      }
    });

    const depths = [0, 2500, 5000, 7500, 10000];
    
    // We use strings for selectors because useGSAP scopes them perfectly
    const scene = ".sig-scene";

    tl.to(scene, { z: depths[0], duration: 1 })
      
      .to(scene, { z: depths[1], ease: "power2.inOut", duration: 1.5 })
      .to(".sig-phase-1", { autoAlpha: 0, duration: 0.5 }, "<0.5") 
      .to(".sig-phase-2", { autoAlpha: 1, duration: 0.5 }, "<0.5") 
      .to(scene, { z: depths[1], duration: 1 })
      
      .to(scene, { z: depths[2], ease: "power2.inOut", duration: 1.5 })
      .to(".sig-phase-2", { autoAlpha: 0, duration: 0.5 }, "<0.5")
      .to(".sig-phase-3", { autoAlpha: 1, duration: 0.5 }, "<0.5")
      .to(scene, { z: depths[2], duration: 1 })
      
      .to(scene, { z: depths[3], ease: "power2.inOut", duration: 1.5 })
      .to(".sig-phase-3", { autoAlpha: 0, duration: 0.5 }, "<0.5")
      .to(".sig-phase-4", { autoAlpha: 1, duration: 0.5 }, "<0.5")
      .to(scene, { z: depths[3], duration: 1 })
      
      .to(scene, { z: depths[4], ease: "power2.inOut", duration: 1.5 })
      .to(".sig-phase-4", { autoAlpha: 0, duration: 0.5 }, "<0.5")
      .to(".sig-phase-5", { autoAlpha: 1, duration: 0.5 }, "<0.5")
      .to(scene, { z: depths[4], duration: 3 }); // Ideal pause so it stays visible without feeling stuck

    // Refresh ScrollTrigger to ensure accurate layout after initial render (syncing dynamically loaded image heights)
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    setTimeout(refresh, 500);
    setTimeout(refresh, 1500);
    setTimeout(refresh, 3000);

    return () => {
      window.removeEventListener('load', refresh);
    };
  }, { scope: containerRef });

  return (
    <>
    <section className="signature-wrap" id="stage" ref={containerRef} style={{zIndex: 20, position: 'relative'}}>
      <div className="signature-pin">
        <div className="signature-grid"></div>
        <div className="sig-corner" style={{top: '2rem', left: '2rem'}}>Mumbai / India</div>
        <div className="sig-corner" style={{top: '2rem', right: '2rem'}}>Creative Sys 001</div>
        <div className="sig-corner" style={{bottom: '2rem', left: '2rem'}}>Vol. 2026</div>
        <div className="sig-corner" style={{bottom: '2rem', right: '2rem'}}>Depth: 1800</div>
        
        <nav className="sig-rail" aria-hidden="true">
          <i className="on"></i><i></i><i></i><i></i><i></i>
        </nav>
        <div className="sig-bar" id="sig-bar"></div>

        <div className="sig-scene">
          
          {/* PHASE 1: IDEAS */}
          <div className="sig-phase sig-phase-1">
            <h2 className="sig-bg-giant">01</h2>
            <div className="sig-blob" style={{width: '80vw', height: '80vw', left: '10%', top: '-10%', '--z': '-600px'}}></div>
            
            <h2 className="sig-giant" style={{'--z': '150px'}}>Ideas</h2>
            
            <div className="sig-note sig-float" style={{top: '12%', left: '8%', '--z': '100px'}}>
              <b>01 / Idea</b><small>Research • Insight • Possibility</small>
            </div>
            
            <div className="sig-wireframe sig-float sig-hide-mobile" style={{left: '10%', bottom: '15%', '--z': '120px', '--r': '-4deg'}}>
              <div className="sig-wire-box">Hero Img</div>
              <div className="sig-wire-line" style={{width: '80%'}}></div>
              <div className="sig-wire-line" style={{width: '60%'}}></div>
              <div className="sig-wire-line" style={{width: '90%'}}></div>
            </div>
            
            <div className="sig-card sig-float" style={{right: '10%', top: '15%', '--z': '180px', '--r': '6deg'}}>
              <div className="sig-tape" style={{rotate: '-4deg'}}></div>
              <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop') center/cover"}}></div>
              <em>Fig. 01 — Spark</em>
            </div>

            <div className="sig-sticky olive sig-float" style={{right: '12%', bottom: '16%', '--z': '220px', '--r': '-8deg'}}>Find the white space.</div>
            
            <div className="sig-ui-panel sig-float sig-hide-mobile" style={{left: '20%', top: '12%', width: 'auto', padding: '0.75rem 1.25rem', '--z': '130px', borderRadius: '99px'}}>
               <span style={{font: "600 0.7rem 'Space Grotesk', sans-serif", color: "var(--text-dark, #1F2915)"}}>LAT: 19.0760 / LON: 72.8777</span>
            </div>

            <div className="sig-crosshair" style={{left: '40%', top: '20%', '--z': '-100px'}}></div>
            <div className="sig-ring" style={{width: '150px', height: '150px', right: '35%', bottom: '15%', '--z': '-200px'}}></div>
          </div>

          {/* PHASE 2: STRATEGY */}
          <div className="sig-phase sig-phase-2" style={{'--pz': '-2500px'}}>
            <h2 className="sig-bg-giant">02</h2>
            <h2 className="sig-giant sig-type-outline" style={{'--z': '150px'}}>Strategy</h2>
            
            <div className="sig-note sig-float" style={{top: '12%', right: '8%', textAlign: 'right', '--z': '160px'}}>
              <b>02 / Strategy</b><small>Audience • Positioning • Direction</small>
            </div>
            
            <div className="sig-ui-panel sig-float" style={{left: '8%', top: '15%', '--z': '150px', '--r': '-4deg'}}>
              <div style={{font: "700 0.9rem 'Space Grotesk', sans-serif", marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem'}}>DEMOGRAPHICS</div>
              <div className="sig-ui-line dark"></div><div className="sig-ui-line"></div>
              <div className="sig-mini-chart">
                <div className="sig-mini-bar" style={{height: '40%', background: 'var(--muted, #5C7051)'}}></div>
                <div className="sig-mini-bar" style={{height: '70%', background: 'var(--accent, #C5D86D)'}}></div>
                <div className="sig-mini-bar" style={{height: '100%', background: 'var(--text-dark, #1F2915)'}}></div>
                <div className="sig-mini-bar" style={{height: '60%', background: 'var(--muted, #5C7051)'}}></div>
              </div>
            </div>

            <svg className="sig-float sig-hide-mobile" style={{left: '20%', bottom: '12%', width: '200px', height: '100px', overflow: 'visible', '--z': '120px', '--r': '10deg'}} viewBox="0 0 200 100">
               <path d="M10,50 Q100,0 190,50" fill="none" stroke="var(--text-dark, #1F2915)" strokeWidth="2" strokeDasharray="4 4"/>
               <circle cx="10" cy="50" r="8" fill="var(--accent, #C5D86D)" stroke="var(--text-dark, #1F2915)" strokeWidth="2"/>
               <circle cx="100" cy="25" r="8" fill="#FFFFFF" stroke="var(--text-dark, #1F2915)" strokeWidth="2"/>
               <circle cx="190" cy="50" r="8" fill="var(--text-dark, #1F2915)"/>
               <text x="90" y="8" fontFamily="'Inter', sans-serif" fontSize="11" fontWeight="700" fill="var(--muted, #5C7051)">NODE.02</text>
            </svg>

            <div className="sig-card sig-float" style={{right: '10%', bottom: '15%', '--ar': '1', '--z': '140px', '--r': '5deg'}}>
              <div className="sig-tape" style={{rotate: '2deg'}}></div>
              <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop') center/cover"}}></div>
              <em>Fig. 02 — Map</em>
            </div>

            <div className="sig-sticky sig-float sig-hide-mobile" style={{left: '8%', bottom: '15%', width: '180px', '--z': '220px', '--r': '-12deg'}}>
               <span style={{fontSize: '1.3rem'}}>Audience first. Always.</span>
            </div>

            <div className="sig-ring" style={{width: '250px', height: '250px', left: '40%', bottom: '20%', '--z': '-300px'}}></div>
          </div>

          {/* PHASE 3: CREATIVITY */}
          <div className="sig-phase sig-phase-3" style={{'--pz': '-5000px'}}>
            <h2 className="sig-bg-giant" style={{color: 'var(--accent, #C5D86D)', opacity: '0.1'}}>03</h2>
            <div className="sig-blob" style={{width: '60vw', height: '60vw', right: '5%', top: '20%', background: 'var(--accent, #C5D86D)', opacity: '0.15', '--z': '-400px'}}></div>
            
            <h2 className="sig-giant sig-type-glow" style={{'--z': '150px'}}>Creativity</h2>
            
            <div className="sig-note sig-float" style={{top: '12%', left: '8%', '--z': '150px'}}>
              <b>03 / Creativity</b><small>Identity • Content • Design</small>
            </div>
            
            <div className="sig-typo-spec sig-float sig-hide-mobile" style={{left: '8%', bottom: '16%', '--z': '180px', '--r': '-6deg'}}>
               <h4>Aa</h4>
               <p>Space Grotesk<br/>Bold 700</p>
            </div>
            
            <div className="sig-swatch-group sig-float" style={{right: '10%', top: '16%', '--z': '200px', '--r': '8deg'}}>
               <div className="sig-swatch" style={{background: 'var(--text-dark, #1F2915)'}}></div>
               <div className="sig-swatch" style={{background: 'var(--muted, #5C7051)'}}></div>
               <div className="sig-swatch" style={{background: 'var(--accent, #C5D86D)'}}></div>
               <div className="sig-swatch" style={{background: 'var(--blush, #E5F1DB)'}}></div>
            </div>

            <div className="sig-card sig-float" style={{right: '8%', bottom: '16%', '--z': '140px', '--r': '-10deg'}}>
              <div className="sig-tape" style={{rotate: '-5deg', background: 'rgba(197, 216, 109, 0.4)'}}></div>
              <div className="sig-art" style={{background: 'linear-gradient(135deg, var(--accent, #C5D86D), var(--bg-color, #F4F5F0), var(--text-dark, #1F2915))'}}></div>
              <em>Fig. 03 — Palette</em>
            </div>

            <div className="sig-sticky sig-float" style={{left: '8%', top: '28%', width: '190px', '--z': '220px', '--r': '12deg'}}>Make them feel something.</div>
            <div className="sig-crosshair" style={{right: '45%', bottom: '25%', '--z': '-50px'}}></div>
          </div>

          {/* PHASE 4: EXECUTION */}
          <div className="sig-phase sig-phase-4" style={{'--pz': '-7500px'}}>
            <h2 className="sig-bg-giant">04</h2>
            
            <h2 className="sig-giant sig-type-shadow" style={{'--z': '150px'}}>Execution</h2>
            
            <div className="sig-note sig-float" style={{bottom: '15%', right: '8%', textAlign: 'right', '--z': '150px'}}>
              <b>04 / Execution</b><small>Campaigns • Production • Ship</small>
            </div>
            
            <div className="sig-ui-panel sig-float" style={{left: '8%', top: '18%', width: '260px', '--z': '180px', '--r': '-4deg', background: 'var(--text-dark, #1F2915)', color: '#FFFFFF', borderColor: 'var(--muted, #5C7051)'}}>
               <div style={{font: "700 0.9rem 'Space Grotesk', sans-serif", marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between'}}>
                  <span>LAUNCH SEQ.</span><span style={{color: 'var(--accent, #C5D86D)'}}>92%</span>
               </div>
               <div style={{height: '10px', background: 'var(--muted, #5C7051)', borderRadius: '99px', overflow: 'hidden', marginBottom: '1.2rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'}}>
                 <div style={{height: '100%', width: '92%', background: 'var(--accent, #C5D86D)', borderRadius: '99px'}}></div>
               </div>
               <div style={{display: 'flex', gap: '10px', fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.65rem', color: 'var(--accent, #C5D86D)'}}>
                  <div style={{border: '1px solid var(--muted, #5C7051)', padding: '4px 8px', borderRadius: '4px'}}>CSS3D</div>
                  <div style={{border: '1px solid var(--muted, #5C7051)', padding: '4px 8px', borderRadius: '4px'}}>GSAP</div>
                  <div style={{border: '1px solid var(--muted, #5C7051)', padding: '4px 8px', borderRadius: '4px'}}>VITE</div>
               </div>
            </div>

            <div className="sig-ui-panel sig-float sig-hide-mobile" style={{left: '8%', bottom: '15%', width: '220px', padding: '1.2rem', '--z': '140px', '--r': '6deg'}}>
               <div style={{borderLeft: '2px solid var(--text-dark, #1F2915)', paddingLeft: '12px', marginLeft: '6px'}}>
                  <div style={{position: 'relative', marginBottom: '18px'}}>
                     <div style={{position: 'absolute', left: '-18px', top: '2px', width: '10px', height: '10px', background: 'var(--text-dark, #1F2915)', borderRadius: '50%', border: '2px solid #FFFFFF'}}></div>
                     <div style={{font: "700 0.8rem 'Space Grotesk', sans-serif", color: 'var(--text-dark, #1F2915)'}}>QA PASS</div>
                  </div>
                  <div style={{position: 'relative'}}>
                     <div style={{position: 'absolute', left: '-18px', top: '2px', width: '10px', height: '10px', background: 'var(--accent, #C5D86D)', borderRadius: '50%', border: '2px solid var(--text-dark, #1F2915)'}}></div>
                     <div style={{font: "700 0.8rem 'Space Grotesk', sans-serif", color: 'var(--text-dark, #1F2915)'}}>DEPLOY</div>
                  </div>
               </div>
            </div>

            <div className="sig-card sig-float" style={{right: '8%', top: '15%', '--ar': '16/9', '--z': '160px', '--r': '8deg'}}>
              <div className="sig-tape" style={{rotate: '4deg'}}></div>
              <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop') center/cover"}}></div>
              <em>Fig. 04 — Launch</em>
            </div>
          </div>

          {/* PHASE 5: IMPACT (EDITORIAL SCRAPBOOK FINALE) */}
          <div className="sig-phase sig-phase-5" style={{'--pz': '-10000px'}}>
            
            {/* Artistic Paint Splashes & Background Texture */}
            <div className="sig-blob sig-float" style={{width: '60vw', height: '60vw', left: '-10%', top: '20%', '--z': '-800px', opacity: '0.4', background: 'radial-gradient(circle at center, #E68AA1 0%, transparent 60%)', filter: 'blur(60px)'}}></div>
            <div className="sig-blob sig-float" style={{width: '50vw', height: '50vw', right: '-5%', bottom: '-10%', '--z': '-600px', opacity: '0.6', background: 'radial-gradient(circle at center, #5C7051 0%, transparent 60%)', filter: 'blur(50px)', animationDelay: '-2s'}}></div>
            
            <div className="sig-ring sig-float" style={{width: '70vw', height: '70vw', left: '50%', top: '50%', translate: '-50% -50%', '--z': '-400px', borderWidth: '1px', opacity: 0.1}}></div>
            
            {/* --- THE COLLAGE ELEMENTS (01 - 05) --- */}
            
            {/* 01 IDEAS */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', left: '6%', top: '12%', '--z': '120px', '--r': '-4deg', display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
              <div>
                <div style={{font: "normal 4.5rem/1 'Abril Fatface', serif", color: 'var(--text-dark, #1F2915)'}}>01</div>
                <div style={{font: "800 1rem 'Space Grotesk', sans-serif", letterSpacing: '0.1em'}}>IDEAS</div>
                <div style={{font: "600 0.55rem 'Inter', sans-serif", letterSpacing: '0.15em', color: 'var(--muted, #5C7051)', marginTop: '6px', lineHeight: '1.6'}}>RESEARCH<br/>INSIGHTS<br/>POSSIBILITIES</div>
              </div>
              <div className="sig-card" style={{width: '140px', padding: '6px 6px 20px', rotate: '6deg', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <div className="sig-tape" style={{rotate: '-4deg', scale: '0.7', top: '-12px'}}></div>
                <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=400&auto=format&fit=crop') center/cover", filter: 'grayscale(30%) contrast(1.2)'}}></div>
              </div>
            </div>

            {/* Handwritten Note Top Left */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', left: '10%', top: '6%', '--z': '80px', font: "600 1.6rem/1.2 'Caveat', cursive", rotate: '-10deg', width: '220px', color: 'var(--text-dark, #1F2915)'}}>
              A journey from ideas to meaningful impact.
            </div>

            {/* 02 STRATEGY */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', left: '10%', bottom: '15%', '--z': '200px', '--r': '3deg', display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
              <div style={{textAlign: 'right'}}>
                <div style={{font: "normal 4.5rem/1 'Abril Fatface', serif", color: 'var(--text-dark, #1F2915)'}}>02</div>
                <div style={{font: "800 1rem 'Space Grotesk', sans-serif", letterSpacing: '0.1em'}}>STRATEGY</div>
                <div style={{font: "600 0.55rem 'Inter', sans-serif", letterSpacing: '0.15em', color: 'var(--muted, #5C7051)', marginTop: '6px', lineHeight: '1.6'}}>AUDIENCE<br/>POSITIONING<br/>DIRECTION</div>
              </div>
              <div className="sig-card" style={{width: '160px', padding: '6px 6px 20px', rotate: '-5deg', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <div className="sig-tape" style={{rotate: '4deg', scale: '0.7', top: '-12px'}}></div>
                <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=400&auto=format&fit=crop') center/cover", filter: 'grayscale(50%) contrast(1.1)'}}></div>
                <div style={{position: 'absolute', bottom: '-20px', right: '-25px', background: '#FDF9D9', padding: '10px 15px', font: "600 1.1rem/1 'Caveat', cursive", rotate: '8deg', boxShadow: '2px 4px 10px rgba(0,0,0,0.1)', color: 'var(--text-dark, #1F2915)'}}>Strategy<br/>turns ideas<br/>into direction.</div>
              </div>
            </div>

            {/* 03 CREATIVITY */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', left: '42%', bottom: '6%', '--z': '150px', '--r': '-2deg', display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{font: "normal 4.5rem/1 'Abril Fatface', serif", color: 'var(--text-dark, #1F2915)'}}>03</div>
                <div style={{font: "800 1rem 'Space Grotesk', sans-serif", letterSpacing: '0.1em'}}>CREATIVITY</div>
                <div style={{font: "600 0.55rem 'Inter', sans-serif", letterSpacing: '0.15em', color: 'var(--muted, #5C7051)', marginTop: '6px', lineHeight: '1.6'}}>IDENTITY &bull; CONTENT &bull; DESIGN</div>
              </div>
              <div className="sig-card" style={{width: '150px', padding: '6px 6px 20px', rotate: '4deg', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginLeft: '10px'}}>
                <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=400&auto=format&fit=crop') center/cover", '--ar': '16/9', filter: 'grayscale(20%) contrast(1.2)'}}></div>
              </div>
            </div>

            {/* 04 EXECUTION */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', right: '12%', bottom: '20%', '--z': '250px', '--r': '5deg', display: 'flex', gap: '15px', alignItems: 'flex-start', flexDirection: 'row-reverse'}}>
              <div style={{textAlign: 'left'}}>
                <div style={{font: "normal 4.5rem/1 'Abril Fatface', serif", color: 'var(--text-dark, #1F2915)'}}>04</div>
                <div style={{font: "800 1rem 'Space Grotesk', sans-serif", letterSpacing: '0.1em'}}>EXECUTION</div>
                <div style={{font: "600 0.55rem 'Inter', sans-serif", letterSpacing: '0.15em', color: 'var(--muted, #5C7051)', marginTop: '6px', lineHeight: '1.6'}}>CAMPAIGNS<br/>PRODUCTION<br/>DISTRIBUTION</div>
              </div>
              <div className="sig-card" style={{width: '180px', padding: '6px 6px 20px', rotate: '-3deg', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <div className="sig-tape" style={{rotate: '-5deg', scale: '0.7', top: '-12px', right: '10px', left: 'auto'}}></div>
                <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=400&auto=format&fit=crop') center/cover", '--ar': '16/9', filter: 'grayscale(100%) contrast(1.3)'}}></div>
              </div>
            </div>

            {/* 05 IMPACT */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', right: '5%', top: '15%', '--z': '180px', '--r': '-6deg', display: 'flex', gap: '15px', alignItems: 'flex-start', flexDirection: 'row-reverse'}}>
              <div style={{textAlign: 'left'}}>
                <div style={{font: "normal 4.5rem/1 'Abril Fatface', serif", color: 'var(--text-dark, #1F2915)'}}>05</div>
                <div style={{font: "800 1rem 'Space Grotesk', sans-serif", letterSpacing: '0.1em'}}>IMPACT</div>
                <div style={{font: "600 0.55rem 'Inter', sans-serif", letterSpacing: '0.15em', color: 'var(--muted, #5C7051)', marginTop: '6px', lineHeight: '1.6'}}>GROWTH<br/>REACH<br/>RELEVANCE</div>
              </div>
              <div className="sig-card" style={{width: '160px', padding: '6px 6px 20px', rotate: '5deg', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
                <div className="sig-tape" style={{rotate: '2deg', scale: '0.7', top: '-12px'}}></div>
                <div className="sig-art" style={{background: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop') center/cover", filter: 'grayscale(60%) contrast(1.2)'}}></div>
              </div>
            </div>

            {/* Handwritten Note Right */}
            <div className="sig-float sig-hide-mobile" style={{position: 'absolute', right: '4%', top: '42%', '--z': '100px', font: "600 1.4rem/1.2 'Caveat', cursive", rotate: '6deg', background: '#FDF9D9', padding: '12px 18px', boxShadow: '2px 4px 10px rgba(0,0,0,0.1)', color: 'var(--text-dark, #1F2915)'}}>
              Real brands.<br/>Real impact.
            </div>

            {/* --- STATIC CENTER TYPOGRAPHY (Exactly like reference) --- */}
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', '--z': '0px', width: '100%', height: '100vh', pointerEvents: 'none'}}>
              
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%', marginTop: '-5vh'}}>
                
                {/* Massive "IDEAS" */}
                <h2 style={{font: "normal clamp(7rem, 22vw, 18rem)/0.75 'Abril Fatface', serif", margin: '0', color: '#263326', letterSpacing: '-0.02em', textTransform: 'uppercase', textShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 2}}>
                  IDEAS
                </h2>
                
                {/* Cursive "to" bridging the gap */}
                <div style={{font: "400 clamp(4rem, 12vw, 10rem)/0.5 'Caveat', cursive", color: '#263326', margin: '-2rem 0 -3rem 0', zIndex: 10, rotate: '-8deg', position: 'relative', left: '10%', textShadow: '2px 2px 0 rgba(244,245,240,0.8)'}}>
                  to
                </div>
                
                {/* Massive "IMPACT" */}
                <h2 style={{font: "normal clamp(7rem, 22vw, 18rem)/0.75 'Abril Fatface', serif", margin: '0', color: '#263326', letterSpacing: '-0.02em', textTransform: 'uppercase', textShadow: '0 20px 40px rgba(0,0,0,0.08)', zIndex: 2}}>
                  IMPACT<span style={{color: '#5C9E31'}}>.</span>
                </h2>

              </div>
              
            </div>
            
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
