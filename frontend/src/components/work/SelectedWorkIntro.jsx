import React from 'react';

const SelectedWorkIntro = ({ empty = false, unavailable = false }) => {
  return (
    <section className="hero theme-dark">
      {/* Side rotated text */}
      <div className="side-text">GROWTHWAY // PORTFOLIO</div>
      
      {/* Giant faint background number */}
      <div className="hero-bg-number">01</div>
      
      {/* Main foreground content */}
      <div className="hero-content">
        <h1 className="hero-title">SELECTED<br/><span>WORK</span></h1>
        <p className="hero-subtitle">{unavailable
          ? 'Our selected work is temporarily unavailable. You can still explore what we do.'
          : empty
            ? 'Ideas to impact. Explore what we create while our project collection takes shape.'
            : 'Ideas to Impact. We build immersive visual systems and brand experiences that command attention in the digital era.'}</p>
      </div>
    </section>
  );
};

export default SelectedWorkIntro;
