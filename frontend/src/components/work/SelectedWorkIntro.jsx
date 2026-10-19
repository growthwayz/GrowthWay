import React from 'react';

const SelectedWorkIntro = () => {
  return (
    <section className="hero theme-dark">
      {/* Side rotated text */}
      <div className="side-text">EST. 2026 // GLOBAL</div>
      
      {/* Giant faint background number */}
      <div className="hero-bg-number">01</div>
      
      {/* Main foreground content */}
      <div className="hero-content">
        <h1 className="hero-title">SELECTED<br/><span>WORK</span></h1>

        {/* Bottom Split: Left Editorial Content + Right Subtitle */}
        <div className="hero-bottom-bar">
          <div className="hero-bottom-left">
            <div className="hero-status-pill">
              <span className="hero-status-dot" />
              <span>COMMISSIONS OPEN // 2026</span>
            </div>

            <p className="hero-left-desc">
              High-conviction creative engineering. We partner with ambitious founders to build <strong>distinct brand identities</strong>, <strong>cinematic media</strong>, and scalable growth systems that turn attention into market dominance.
            </p>

            <div className="hero-disciplines-row">
              <span className="hero-discipline-tag">01 BRAND ARCHITECTURE</span>
              <span className="hero-discipline-tag">02 HIGH-RETENTION MEDIA</span>
              <span className="hero-discipline-tag">03 PERFORMANCE CAMPAIGNS</span>
            </div>
          </div>

          <div className="hero-bottom-right">
            <p className="hero-subtitle">
              Ideas to Impact. We build immersive visual systems and brand experiences that command attention in the digital era.
            </p>
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById('portfolio-filter') || document.querySelector('.filter-bar') || document.getElementById('work-showcase');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="hero-scroll-cue cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-gw-olive"
              style={{ background: 'none', border: 'none', padding: 0 }}
              aria-label="Scroll to case studies"
            >
              <span className="hero-cue-line" />
              <span>EXPLORE CASE STUDIES</span>
              <span className="hero-cue-arrow">↓</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectedWorkIntro;
