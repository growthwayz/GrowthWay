import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import SelectedWorkIntro from '../components/work/SelectedWorkIntro';
import PortfolioFilter from '../components/work/PortfolioFilter';
import FeaturedProject from '../components/work/FeaturedProject';
import ProjectCollection from '../components/work/ProjectCollection';
import Navbar from '../components/navigation/Navbar';
import MicroInteractions from '../components/MicroInteractions';
import { projects, categories, stats, clientLogos } from '../data/projects';

/* ── Luxury Stats Bar ── */
const StatsBar = () => (
  <section className="bg-gw-black text-gw-white py-16 md:py-20 border-t border-gw-white/[0.04]">
    <div className="max-w-[1440px] mx-auto px-5 md:px-18">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, i) => (
          <div key={i} className={`text-center reveal reveal-delay-${i + 1}`}>
            <span className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-gw-white to-gw-white/50 bg-clip-text text-transparent">
              {stat.number}
            </span>
            <p className="text-[9px] uppercase tracking-luxury text-gw-white/25 mt-3">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Marquee Ticker ── */
const MarqueeTicker = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {/* Original Set */}
        <span>PERFORMANCE</span><span>•</span>
        <span>BRANDING</span><span>•</span>
        <span>CONTENT CREATION</span><span>•</span>
        <span>SOCIAL MEDIA</span><span>•</span>
        <span>DIGITAL CAMPAIGNS</span><span>•</span>
        
        {/* Duplicated Set for Seamless Infinite Loop */}
        <span>PERFORMANCE</span><span>•</span>
        <span>BRANDING</span><span>•</span>
        <span>CONTENT CREATION</span><span>•</span>
        <span>SOCIAL MEDIA</span><span>•</span>
        <span>DIGITAL CAMPAIGNS</span><span>•</span>
      </div>
    </div>
  );
};

/* ── Trusted By Section ── */
const TrustedBy = () => (
  <section className="bg-gw-canvas pb-8 md:pb-12">
    <div className="max-w-[1440px] mx-auto px-5 md:px-18">
      <div className="py-12 md:py-16 border-y border-gw-line/30 reveal">
        <p className="text-[9px] uppercase tracking-luxury text-gw-muted/30 text-center mb-10">Trusted by industry leaders</p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {clientLogos.map((logo, i) => (
            <span 
              key={i} 
              className="font-display text-lg md:text-xl font-bold text-gw-ink/[0.08] hover:text-gw-ink/20 transition-colors duration-500 interactive-hover"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── MAIN PAGE ── */
const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = projects.filter(project => {
    if (activeCategory === 'All') return true;
    return project.categories.includes(activeCategory);
  });

  const featuredProject = filteredProjects.find(p => p.featured) || filteredProjects[0];
  const remainingProjects = filteredProjects.filter(p => p.id !== featuredProject?.id);

  return (
    <div className="bg-gw-canvas min-h-screen text-gw-ink relative overflow-x-hidden">
      <MicroInteractions />

      {/* ── HERO ── */}
      <SelectedWorkIntro />

      {/* ── STATS BAR ── */}
      <StatsBar />

      {/* ── MARQUEE TICKER ── */}
      <MarqueeTicker />

      {/* ── FILTER ── */}
      <PortfolioFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
      />

      {/* ── FEATURED PROJECT ── */}
      {featuredProject && (
        <FeaturedProject project={featuredProject} />
      )}

      {/* ── PROJECT COLLECTION ── */}
      {remainingProjects.length > 0 && (
        <ProjectCollection projects={remainingProjects} />
      )}

      {/* ── TRUSTED BY ── */}
      <TrustedBy />
      
      {/* ── FOOTER ── */}
      <footer className="footer-gradient text-gw-white py-32 md:py-48 px-6 md:px-18 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gw-pink/[0.05] blur-[180px] pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-[9px] uppercase tracking-luxury text-gw-white/20 mb-10 reveal">Let's create something extraordinary</span>
          
          <h2 className="font-display text-5xl md:text-7xl lg:text-[100px] uppercase tracking-[-0.04em] font-bold mb-6 leading-[0.9] reveal reveal-delay-1">
            Ready to<br/><span className="bg-gradient-to-r from-gw-blush-soft to-gw-pink bg-clip-text text-transparent">grow</span>?
          </h2>
          
          <p className="text-gw-white/30 text-lg max-w-lg mb-6 text-balance reveal reveal-delay-2">
            We partner with ambitious brands to create work that moves people, markets, and culture.
          </p>
          <p className="text-gw-white/15 text-sm max-w-md mb-16 reveal reveal-delay-2">
            Whether you're launching something new or reimagining what exists — we'd love to hear your story.
          </p>

          <button className="group btn-shimmer text-white px-12 py-5 rounded-full uppercase font-semibold text-sm tracking-editorial interactive-hover reveal reveal-delay-3 flex items-center gap-3 hover:scale-105 transition-transform duration-400 shadow-[0_20px_60px_rgba(233,91,159,0.3)]">
            Start a Project
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Footer meta */}
          <div className="mt-28 md:mt-36 w-full">
            <div className="luxury-rule mb-10"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <span className="font-display font-bold text-xl tracking-tight interactive-hover">
                Growthway<span className="text-gw-pink">.</span>
              </span>

              <div className="flex gap-8 text-[10px] uppercase tracking-luxury text-gw-white/15">
                <span className="interactive-hover hover:text-gw-white/40 transition-colors">Instagram</span>
                <span className="interactive-hover hover:text-gw-white/40 transition-colors">LinkedIn</span>
                <span className="interactive-hover hover:text-gw-white/40 transition-colors">Behance</span>
                <span className="interactive-hover hover:text-gw-white/40 transition-colors">Dribbble</span>
              </div>

              <span className="text-[9px] uppercase tracking-luxury text-gw-white/15">
                © 2026 All rights reserved
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPage;
