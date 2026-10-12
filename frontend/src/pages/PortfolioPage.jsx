import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SelectedWorkIntro from '../components/work/SelectedWorkIntro';
import PortfolioFilter from '../components/work/PortfolioFilter';
import FeaturedProject from '../components/work/FeaturedProject';
import ProjectCollection from '../components/work/ProjectCollection';
import { usePublicCms, portfolioProject } from '../lib/publicCms';
import MicroInteractions from '../components/MicroInteractions';

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

/* ── MAIN PAGE ── */
const PortfolioPage = ({ standalone = false }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: records, loading, error } = usePublicCms('/api/projects');
  const { data: categoryRecords } = usePublicCms('/api/categories');
  const { data: services } = usePublicCms('/api/services');
  const projects = (records || []).map((record, index) => portfolioProject(record, index, categoryRecords || [], services || []));
  const categories = ['All', ...new Set(projects.flatMap(project => project.categories))];

  const filteredProjects = projects.filter(project => {
    if (activeCategory === 'All') return true;
    return project.categories.includes(activeCategory);
  });

  const featuredProject = filteredProjects.find(p => p.featured) || filteredProjects[0];
  const remainingProjects = filteredProjects.filter(p => p.id !== featuredProject?.id);
  const showFallback = !loading && projects.length === 0;
  const isUnavailable = showFallback && Boolean(error);

  return (
    <div className={`gw-portfolio bg-gw-canvas min-h-screen text-gw-ink relative overflow-x-hidden ${!projects.length ? 'gw-portfolio-empty' : ''}`}>
      <MicroInteractions />

      {/* ── HERO ── */}
      <SelectedWorkIntro empty={showFallback} unavailable={isUnavailable} />

      {/* ── MARQUEE TICKER ── */}
      <MarqueeTicker />

      {/* ── FILTER ── */}
      {projects.length > 0 && (
        <PortfolioFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

      {loading && <p role="status" className="px-5 py-16 text-center text-gw-muted">Loading selected work…</p>}
      {error && projects.length > 0 && <p role="alert" className="px-5 py-16 text-center text-gw-muted">{error}</p>}
      {showFallback && (
        <section className="gw-work-empty" aria-labelledby="gw-work-empty-title">
          <div className="gw-work-empty-topline">
            <span>THE COLLECTION</span>
            <span>IDEAS → IMPACT</span>
          </div>
          <div className="gw-work-empty-content">
            <div className="gw-work-empty-art" aria-hidden="true">
              <span>G</span><span>W</span>
              <div className="gw-work-empty-art-caption">CREATE / CONNECT / GROW</div>
            </div>
            <div className="gw-work-empty-copy">
              <span className="gw-work-empty-kicker">SELECTED WORK / {isUnavailable ? 'UNAVAILABLE' : 'COMING SOON'}</span>
              <h2 id="gw-work-empty-title">{isUnavailable ? <>Work is<br /><em>out of view.</em></> : <>The work is<br /><em>taking shape.</em></>}</h2>
              <p role={isUnavailable ? 'alert' : undefined}>{isUnavailable
                ? 'We could not load our projects right now. Please check back shortly, or explore our services and get in touch.'
                : 'Our project collection is being prepared. Until it is ready, explore what we do or tell us what you are building.'}</p>
              <div className="gw-work-empty-actions">
                <a href="/#services" className="gw-work-empty-primary">Explore our services <ArrowUpRight size={18} aria-hidden="true" /></a>
                <Link to="/contact" className="gw-work-empty-secondary">Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>
      )}
      {!loading && !error && projects.length > 0 && !filteredProjects.length && <p className="px-5 py-16 text-center text-gw-muted">No projects in this category yet.</p>}

      {/* ── FEATURED PROJECT ── */}
      {featuredProject && (
        <FeaturedProject project={featuredProject} />
      )}

      {/* ── PROJECT COLLECTION ── */}
      {remainingProjects.length > 0 && (
        <ProjectCollection projects={remainingProjects} />
      )}

      {/* ── FOOTER ── */}
      {standalone && <footer className="footer-gradient text-gw-white py-32 md:py-48 px-6 md:px-18 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gw-olive/[0.05] blur-[180px] pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-[9px] uppercase tracking-luxury text-gw-white/20 mb-10 reveal">Let's create something extraordinary</span>
          
          <h2 className="font-display text-5xl md:text-7xl lg:text-[100px] uppercase tracking-[-0.04em] font-bold mb-6 leading-[0.9] reveal reveal-delay-1">
            Ready to<br/><span className="bg-gradient-to-r from-gw-blush-soft to-gw-olive bg-clip-text text-transparent">grow</span>?
          </h2>
          
          <p className="text-gw-white/30 text-lg max-w-lg mb-6 text-balance reveal reveal-delay-2">
            We partner with ambitious brands to create work that moves people, markets, and culture.
          </p>
          <p className="text-gw-white/15 text-sm max-w-md mb-16 reveal reveal-delay-2">
            Whether you're launching something new or reimagining what exists — we'd love to hear your story.
          </p>

          <Link to="/contact" className="group btn-shimmer text-white px-12 py-5 rounded-full uppercase font-semibold text-sm tracking-editorial interactive-hover reveal reveal-delay-3 flex items-center gap-3 hover:scale-105 transition-transform duration-400 shadow-[0_20px_60px_rgba(233,91,159,0.3)]">
            Start a Project
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Footer meta */}
          <div className="mt-28 md:mt-36 w-full">
            <div className="luxury-rule mb-10"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2.5">
                <img src="/logo-icon.png" alt="Growth Way" className="w-6 h-6 rounded-[5px] object-cover" />
                <span className="font-display font-bold text-xl tracking-tight interactive-hover">
                  Growth<span className="text-gw-olive">Way</span>
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-luxury text-gw-white/40">
                <Link to="/" className="hover:text-gw-white transition-colors">Home</Link>
                <a href="/#services" className="hover:text-gw-white transition-colors">Services</a>
                <Link to="/contact" className="hover:text-gw-white transition-colors">Contact</Link>
              </div>

              <span className="text-[9px] uppercase tracking-luxury text-gw-white/15">
                © 2026 All rights reserved
              </span>
            </div>
          </div>
        </div>
      </footer>}
    </div>
  );
};

export default PortfolioPage;

