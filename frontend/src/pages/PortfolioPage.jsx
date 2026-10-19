import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SelectedWorkIntro from '../components/work/SelectedWorkIntro';
import PortfolioFilter from '../components/work/PortfolioFilter';
import FeaturedProject from '../components/work/FeaturedProject';
import ProjectCollection from '../components/work/ProjectCollection';
import { usePublicCms, portfolioProject } from '../lib/publicCms';
import MicroInteractions from '../components/MicroInteractions';
import { clientLogos, projects as defaultProjects } from '../data/projects';

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
const TrustedBy = () => {
  const { data: clients } = usePublicCms('/api/clients');
  const activeLogos = clients && clients.length > 0
    ? clients.map(c => c.name)
    : clientLogos;

  return (
    <section className="bg-gw-canvas pb-2 md:pb-4">
      <div className="max-w-[1440px] mx-auto px-5 md:px-18">
        <div className="py-8 md:py-10 border-y border-gw-line/30 reveal">
          <p className="text-[9px] uppercase tracking-luxury text-gw-muted/40 text-center mb-6">Trusted by industry leaders</p>
          <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between items-center gap-6 md:gap-8 px-2">
            {activeLogos.map((logo, i) => (
              <span
                key={i}
                className="font-display text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider text-gw-ink/20 hover:text-gw-ink/60 transition-colors duration-500 interactive-hover whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── MAIN PAGE ── */
const PortfolioPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  const industryFilter = searchParams.get('industry');

  const isStandalone = location.pathname === '/work';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { data: records, loading, error } = usePublicCms('/api/projects');
  const { data: categoryRecords } = usePublicCms('/api/categories');
  const { data: services } = usePublicCms('/api/services');
  const cmsProjects = (records || []).map((record, index) => portfolioProject(record, index, categoryRecords || [], services || []));
  const projects = cmsProjects.length > 0 ? cmsProjects : defaultProjects;
  const categories = ['All', ...new Set(projects.flatMap(project => project.categories))];

  const filteredProjects = projects.filter(project => {
    if (activeCategory !== 'All' && !project.categories.includes(activeCategory)) {
      return false;
    }
    return true;
  });

  const featuredProject = filteredProjects.find(p => p.featured) || filteredProjects[0];
  const remainingProjects = filteredProjects.filter(p => p.id !== featuredProject?.id);

  return (
    <div className="gw-portfolio bg-gw-canvas min-h-screen text-gw-ink relative overflow-x-hidden">
      <MicroInteractions />

      {/* ── Standalone Return Navigation (/work only) ── */}
      {isStandalone && (
        <div className="bg-gw-black border-b border-gw-white/10 px-5 md:px-18 py-3.5 flex items-center justify-between relative z-30">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'}
            className="designer-back-btn group cursor-pointer"
            aria-label="Back to Previous Page"
          >
            <span className="back-icon-disc">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
            <span className="back-label">Back to Previous</span>
            <span className="back-tag">RETURN</span>
          </button>

          <Link
            to="/contact"
            className="cta-button font-medium flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D4A36]"
          >
            <span>START A PROJECT</span>
            <span className="cta-arrow-circle">
              <span className="cta-arrow">→</span>
            </span>
          </Link>
        </div>
      )}

      {/* ── HERO ── */}
      <SelectedWorkIntro />

      {/* ── MARQUEE TICKER ── */}
      <MarqueeTicker />

      {/* ── FILTER ── */}
      <PortfolioFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {industryFilter && (
        <div className="max-w-[1440px] mx-auto px-5 md:px-18 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 bg-gw-olive/10 text-gw-olive px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-gw-olive animate-pulse"></span>
            <span>SECTOR FOCUS: [{industryFilter.toUpperCase()}]</span>
          </div>
          <Link to="/work" onClick={() => setActiveCategory('All')} className="text-xs font-mono uppercase text-gw-muted hover:text-gw-ink underline">
            Clear Filter [Show All Work]
          </Link>
        </div>
      )}

      {loading && !projects.length && <p role="status" className="px-5 py-16 text-center text-gw-muted">Loading selected work…</p>}
      {error && !projects.length && <p role="alert" className="px-5 py-16 text-center text-gw-muted">{error}</p>}
      {!loading && !error && !filteredProjects.length && <p className="px-5 py-16 text-center text-gw-muted">{activeCategory === 'All' ? 'Selected work will appear here when published.' : 'No projects in this category yet.'}</p>}

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

      {/* ── FOOTER (Standalone /work page only) ── */}
      {isStandalone && (
        <footer className="footer-gradient text-gw-white py-32 md:py-48 px-6 md:px-18 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gw-olive/[0.05] blur-[180px] pointer-events-none"></div>

          <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
            <span className="text-[9px] uppercase tracking-luxury text-gw-white/20 mb-10 reveal">Let's create something extraordinary</span>

            <h2 className="font-display text-5xl md:text-7xl lg:text-[100px] uppercase tracking-[-0.04em] font-bold mb-6 leading-[0.9] reveal reveal-delay-1">
              Ready to<br /><span className="bg-gradient-to-r from-gw-blush-soft to-gw-olive bg-clip-text text-transparent">grow</span>?
            </h2>

            <p className="text-gw-white/30 text-lg max-w-lg mb-6 text-balance reveal reveal-delay-2">
              We partner with ambitious brands to create work that moves people, markets, and culture.
            </p>
            <p className="text-gw-white/15 text-sm max-w-md mb-16 reveal reveal-delay-2">
              Whether you're launching something new or reimagining what exists — we'd love to hear your story.
            </p>

            <Link
              to="/contact"
              className="btn-capsule btn-capsule-white group reveal reveal-delay-3"
            >
              <span>START A PROJECT</span>
              <span className="btn-capsule-circle">
                <span className="btn-capsule-arrow">→</span>
              </span>
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
                  <a href="https://www.instagram.com/growthwayyy?dlrf=M290YmR0NmY2N2Ri" target="_blank" rel="noopener noreferrer" className="interactive-hover hover:text-gw-white transition-colors">Instagram</a>
                  <a href="https://youtube.com/@growthwayxmedia?si=7bT6RQDyDz15t71o" target="_blank" rel="noopener noreferrer" className="interactive-hover hover:text-gw-white transition-colors">YouTube</a>
                  <a href="mailto:growthway75@gmail.com" className="interactive-hover hover:text-gw-white transition-colors">Email</a>
                  <a href="https://wa.me/917607012896" target="_blank" rel="noopener noreferrer" className="interactive-hover hover:text-gw-white transition-colors">WhatsApp</a>
                </div>

                <span className="text-[9px] uppercase tracking-luxury text-gw-white/15">
                  © 2026 All rights reserved
                </span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PortfolioPage;

