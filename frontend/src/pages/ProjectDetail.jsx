import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { videoUrl } from '../lib/media';
import { usePublicCms, portfolioProject } from '../lib/publicCms';
import { allProjects, projects as defaultProjects, industryProjects, serviceProjects } from '../data/projects';
import { ArrowLeft, ArrowRight, CheckCircle2, Quote } from 'lucide-react';
import MicroInteractions from '../components/MicroInteractions';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const bottomSectionRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Scroll to top instantly upon landing or switching projects
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const { data: record, loading } = usePublicCms(`/api/projects/${encodeURIComponent(slug)}`);
  const { data: categories } = usePublicCms('/api/categories');
  const { data: services } = usePublicCms('/api/services');

  // Sector / Service detection
  const isIndustry = industryProjects.some(p => p.slug === slug || p.id === slug) || location.state?.from === 'industries';
  const isService = serviceProjects.some(p => p.slug === slug || p.id === slug) || location.state?.from === 'services';

  // Strict separation of active project pool — DO NOT integrate between Selected Work, Industries, and Services
  const activePool = isIndustry 
    ? industryProjects 
    : isService 
    ? serviceProjects 
    : defaultProjects;

  const fallbackProject = activePool.find(p => p.slug === slug || p.id === slug) ||
    allProjects.find(p => p.slug === slug || p.id === slug);

  const project = record ? portfolioProject(record, 0, categories || [], services || []) : fallbackProject;

  // Observe when the user scrolls down to the bottom actions region
  useEffect(() => {
    const el = bottomSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '40px 0px 0px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // When bottom section is in view, hide the fixed floating main navbar too
  useEffect(() => {
    if (isAtBottom) {
      document.body.classList.add('hide-top-nav-at-bottom');
    } else {
      document.body.classList.remove('hide-top-nav-at-bottom');
    }
    return () => {
      document.body.classList.remove('hide-top-nav-at-bottom');
    };
  }, [isAtBottom]);

  const backLabel = location.state?.returnLabel || (
    isIndustry ? 'Back to Who We Work With' :
    isService ? 'Back to Services' :
    'Back to Selected Work'
  );

  const backTag = isIndustry ? 'SECTORS' : isService ? 'SYSTEMS' : 'RETURN';

  const handleBack = () => {
    const returnTarget = location.state?.returnTarget || (
      isIndustry ? `industry-row-${project?.slug}` : `project-${project?.slug}`
    );
    const returnScrollY = location.state?.returnScrollY ?? (
      sessionStorage.getItem('gw_return_scroll') ? Number(sessionStorage.getItem('gw_return_scroll')) : null
    );
    const returnTo = location.state?.returnTo || (
      isIndustry ? '/#industries' : isService ? '/#services' : '/#work'
    );

    if (returnTarget) {
      sessionStorage.setItem('gw_scroll_restore_target', returnTarget);
    }
    if (typeof returnScrollY === 'number' && returnScrollY > 0) {
      sessionStorage.setItem('gw_scroll_restore_y', String(returnScrollY));
    }
    sessionStorage.setItem('gw_is_restoring', '1');

    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(returnTo);
    }
  };

  // Find adjacent projects strictly inside activePool (no crossover between Work and Industries)
  const currentIndex = activePool.findIndex(p => p.slug === project?.slug || p.id === project?.id);
  const prevProject = currentIndex > 0 ? activePool[currentIndex - 1] : activePool[activePool.length - 1];
  const nextProject = currentIndex >= 0 && currentIndex < activePool.length - 1 ? activePool[currentIndex + 1] : activePool[0];

  if (!project) {
    return (
      <div className="min-h-screen bg-gw-canvas flex flex-col items-center justify-center p-6 text-center">
        <MicroInteractions />
        <span className="text-xs uppercase tracking-luxury text-gw-olive font-semibold mb-3">Protocol 404</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
          {loading ? 'Loading Case Study…' : 'Case Study Not Found'}
        </h1>
        <p className="text-gw-muted max-w-md mb-8">
          The requested portfolio commission could not be located in our archive.
        </p>
        <button
          type="button"
          onClick={handleBack}
          className="designer-back-btn group cursor-pointer relative z-50 pointer-events-auto"
        >
          <span className="back-icon-disc">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </span>
          <span className="back-label">{backLabel}</span>
          <span className="back-tag">{backTag}</span>
        </button>
      </div>
    );
  }

  const metadata = project.metadata || {};
  const gallery = project.gallery || [];
  const galleryCaptions = project.galleryCaptions || [];
  const galleryAlts = project.galleryAlts || [];
  const testimonial = project.testimonial;

  return (
    <div className="gw-project-detail bg-gw-canvas min-h-screen text-gw-ink selection:bg-gw-olive selection:text-white">
      <MicroInteractions />

      {/* ── STICKY NAVIGATION BAR (Slides up cleanly when scrolled to bottom) ── */}
      <nav
        className={`h-20 border-b border-gw-line/40 flex items-center justify-between px-5 md:px-18 bg-gw-canvas/90 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 ease-out ${
          isAtBottom ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <button
          type="button"
          onClick={handleBack}
          className="designer-back-btn group cursor-pointer relative z-50 pointer-events-auto"
          aria-label="Back to previous page"
        >
          <span className="back-icon-disc">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </span>
          <span className="back-label">{backLabel}</span>
          <span className="back-tag">{backTag}</span>
        </button>

        <div className="hidden md:flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-gw-olive animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gw-muted">
            {isIndustry ? 'SECTOR ARCHIVE // WHO WE WORK WITH' : isService ? 'CAPABILITY ARCHIVE // OUR SERVICES' : `COMMISSION ARCHIVE // ${metadata.year || '2025-2026'}`}
          </span>
        </div>

        <Link
          to="/contact"
          className="cta-button font-medium flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#3D4A36]"
        >
          <span>START A PROJECT</span>
          <span className="cta-arrow-circle">
            <span className="cta-arrow">→</span>
          </span>
        </Link>
      </nav>

      <main className="max-w-[1280px] mx-auto px-5 md:px-12 py-16 md:py-24">
        
        {/* ── CASE STUDY HEADER ── */}
        <header className="mb-14 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-display font-bold text-3xl md:text-4xl text-gw-olive leading-none">
              {project.id}
            </span>
            <span className="text-gw-line text-2xl font-light">/</span>
            <span className="text-xs uppercase tracking-luxury text-gw-olive font-semibold">
              {metadata.sector || metadata.client || 'COMMISSION ARCHIVE'}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight text-gw-ink mb-8 leading-[0.95]">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2.5 mb-8">
            {project.categories?.map((cat) => (
              <span
                key={cat}
                className="text-xs font-medium border border-gw-line/80 px-4 py-1.5 rounded-full uppercase tracking-wider text-gw-charcoal bg-gw-canvas/50"
              >
                {cat}
              </span>
            ))}
          </div>

          <p className="text-lg md:text-2xl text-gw-charcoal/90 font-light max-w-4xl leading-relaxed">
            {project.longDescription || project.description}
          </p>
        </header>

        {/* ── CINEMATIC MAIN VISUAL ── */}
        <section className="mb-16 md:mb-24 rounded-2xl overflow-hidden border border-gw-line/60 shadow-xl bg-gw-black relative group">
          <div className="aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden">
            <img
              src={project.image}
              alt={project.imageAlt || project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-wrap items-end justify-between gap-4 text-white">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gw-olive">CLIENT SPECIFICATION</p>
              <p className="text-lg md:text-xl font-display font-bold uppercase">{metadata.client || project.title}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">STRATEGIC ROLE</p>
              <p className="text-sm font-medium text-white/90">{metadata.role || 'Brand Architecture & Content'}</p>
            </div>
          </div>
        </section>

        {/* ── PROJECT METADATA GRID ── */}
        <section className="mb-20 md:mb-28 p-8 md:p-12 rounded-2xl bg-white/70 border border-gw-line/40 shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-gw-muted mb-2">Client</span>
              <span className="font-display text-base md:text-lg font-bold text-gw-ink uppercase">{metadata.client || project.title}</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-gw-muted mb-2">Sector // Focus</span>
              <span className="font-display text-base md:text-lg font-bold text-gw-ink uppercase">{metadata.sector || 'Growth Commission'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-gw-muted mb-2">Location & Year</span>
              <span className="font-display text-base md:text-lg font-bold text-gw-ink uppercase">{metadata.location || 'Global'} · {metadata.year || '2025'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-gw-muted mb-2">Execution Timeline</span>
              <span className="font-display text-base md:text-lg font-bold text-gw-ink uppercase">{metadata.timeline || 'Sprint Cycle'}</span>
            </div>
          </div>
        </section>

        {/* ── 4-PART EDITORIAL NARRATIVE BREAKDOWN ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 md:mb-32">
          
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-14 md:gap-18">
            
            {/* 01: The Challenge */}
            <div className="relative pl-6 md:pl-8 border-l-2 border-gw-line/80">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gw-olive block mb-3 font-semibold">
                01 // THE CHALLENGE & MARKET CONTEXT
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-gw-ink mb-6">
                Redefining The Standard.
              </h2>
              <p className="text-base md:text-lg text-gw-charcoal leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* 02: Our Strategic Approach */}
            {project.strategy && (
              <div className="relative pl-6 md:pl-8 border-l-2 border-gw-olive">
                <span className="text-[11px] font-mono uppercase tracking-widest text-gw-olive block mb-3 font-semibold">
                  02 // STRATEGIC DIRECTION & CREATIVE ARCHITECTURE
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-gw-ink mb-6">
                  Precision Before Production.
                </h2>
                <p className="text-base md:text-lg text-gw-charcoal leading-relaxed whitespace-pre-line">
                  {project.strategy}
                </p>
              </div>
            )}

            {/* 03: Execution & Production */}
            {project.execution && (
              <div className="relative pl-6 md:pl-8 border-l-2 border-gw-ink/30">
                <span className="text-[11px] font-mono uppercase tracking-widest text-gw-olive block mb-3 font-semibold">
                  03 // EXECUTION & CAMPAIGN ROLLOUT
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-gw-ink mb-6">
                  Engineered For High Retention.
                </h2>
                <p className="text-base md:text-lg text-gw-charcoal leading-relaxed whitespace-pre-line">
                  {project.execution}
                </p>
              </div>
            )}

            {/* 04: Measured Outcomes */}
            {project.results && (
              <div className="relative pl-6 md:pl-8 border-l-2 border-gw-olive/40 bg-gw-olive/[0.03] p-6 md:p-8 rounded-r-2xl">
                <span className="text-[11px] font-mono uppercase tracking-widest text-gw-olive block mb-3 font-semibold">
                  04 // VERIFIED MARKET IMPACT & GROWTH
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-gw-ink mb-4">
                  Tangible Business Resonance.
                </h2>
                <p className="text-base md:text-lg text-gw-charcoal leading-relaxed font-medium">
                  {project.results}
                </p>
              </div>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Deliverables Checklist Card */}
            <div className="bg-white p-7 md:p-8 rounded-2xl border border-gw-line/40 shadow-sm">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-5 pb-3 border-b border-gw-line/40">
                Scope & Deliverables
              </h3>
              <ul className="flex flex-col gap-3.5 text-sm text-gw-charcoal">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gw-olive mt-0.5 flex-none" />
                  <span>Strategic Brand Architecture</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gw-olive mt-0.5 flex-none" />
                  <span>High-Retention Content Direction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gw-olive mt-0.5 flex-none" />
                  <span>Integrated Digital Campaign Assets</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gw-olive mt-0.5 flex-none" />
                  <span>Multi-Platform Performance Rollout</span>
                </li>
              </ul>
            </div>

            {/* Testimonial Quote Block */}
            {testimonial && (
              <div className="bg-gw-ink text-white p-7 md:p-8 rounded-2xl relative overflow-hidden shadow-lg">
                <Quote className="w-10 h-10 text-gw-olive/25 absolute -top-1 -right-1" />
                <p className="text-base md:text-lg text-gw-white/90 leading-relaxed italic mb-6 relative z-10">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-display font-bold text-sm uppercase text-gw-olive">{testimonial.author}</p>
                  <p className="text-xs text-white/50">{testimonial.title}</p>
                </div>
              </div>
            )}

            {/* Direct Consultation Card */}
            <div className="bg-gw-canvas p-7 md:p-8 rounded-2xl border border-gw-olive/30 shadow-sm text-center flex flex-col items-center">
              <p className="text-xs uppercase tracking-luxury text-gw-muted mb-2">
                {isIndustry ? 'Sector Collaboration' : 'Commission Intake'}
              </p>
              <h4 className="font-display text-xl font-bold uppercase mb-4">
                {isIndustry ? `Partner in ${project.title}` : 'Want Similar Results?'}
              </h4>
              <p className="text-xs text-gw-charcoal/70 mb-6 leading-relaxed">
                {isIndustry
                  ? `We build brand velocity, high-retention media systems, and category authority tailored specifically for ${project.title}.`
                  : 'We partner with ambitious leaders ready to transform vision into high-conviction market leadership.'}
              </p>
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-between py-2.5 px-6 rounded-full bg-gw-olive hover:bg-[#4E8A28] text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg group"
              >
                <span>{isIndustry ? `Inquire For ${project.title}` : 'Inquire For Commission'}</span>
                <span className="w-8 h-8 rounded-full bg-[#0E1309] flex items-center justify-center text-gw-olive group-hover:scale-105 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                  →
                </span>
              </Link>
            </div>

          </div>

        </section>

        {/* ── VIDEO SHOWCASE (IF AVAILABLE) ── */}
        {project.videoUrl && (
          <section className="mb-24 md:mb-32">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[1.5px] bg-gw-olive" />
              <span className="text-xs font-mono uppercase tracking-widest text-gw-muted">
                {isIndustry ? 'SECTOR ANTHEM FILM' : 'CINEMATIC COMMISSION FILM'}
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gw-line/60 bg-gw-black shadow-xl">
              <video
                key={project.videoUrl}
                src={videoUrl(project.videoUrl)}
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto bg-gw-black"
                aria-label={`${project.title} project video`}
              />
            </div>
          </section>
        )}

        {/* ── VISUAL GALLERY SHOWCASE ── */}
        {gallery.length > 0 && (
          <section className="mb-24 md:mb-36">
            <div className="flex items-center justify-between gap-4 mb-10 pb-4 border-b border-gw-line/40">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-gw-olive" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-gw-muted">
                  {isIndustry ? 'SECTOR GALLERY // VISUAL ARTIFACTS' : isService ? 'SYSTEM GALLERY // CAPABILITY ARTIFACTS' : 'COMMISSION GALLERY // VISUAL ARTIFACTS'}
                </h3>
              </div>
              <span className="text-xs font-mono text-gw-olive">[{gallery.length} PLATES]</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {gallery.map((url, index) => (
                <figure key={`${index}-${url}`} className="group flex flex-col">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gw-black/5 border border-gw-line/40 shadow-sm relative">
                    <img
                      src={url}
                      alt={galleryAlts[index] || `${project.title} visual asset ${index + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        if (project.image && e.currentTarget.src !== project.image) {
                          e.currentTarget.src = project.image;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  {galleryCaptions[index] && (
                    <figcaption className="text-xs text-gw-muted mt-3.5 flex items-center gap-2 font-mono uppercase tracking-wide">
                      <span className="text-gw-olive">FIG.{index + 1} //</span>
                      <span>{galleryCaptions[index]}</span>
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTOM CASE STUDY ACTION REGION (Triggers top bars hide) ── */}
        <div ref={bottomSectionRef} id="case-study-bottom-actions">
          {/* ── PREVIOUS / NEXT CASE STUDY SWITCHER ── */}
          <section className="border-t border-b border-gw-line/40 py-12 mb-20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              to={`/work/${prevProject.slug}`}
              state={{
                from: isIndustry ? 'industries' : isService ? 'services' : 'work',
                returnTo: location.state?.returnTo || (isIndustry ? '/#industries' : isService ? '/#services' : '/#work'),
                returnTarget: isIndustry ? `industry-row-${prevProject.slug}` : `project-${prevProject.slug}`,
                returnLabel: backLabel,
              }}
              className="flex items-center gap-4 group text-left hover:text-gw-olive transition-colors"
            >
              <span className="w-10 h-10 rounded-full border border-gw-line flex items-center justify-center group-hover:border-gw-olive group-hover:bg-gw-olive group-hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gw-muted block">
                  {isIndustry ? 'PREVIOUS SECTOR' : isService ? 'PREVIOUS CAPABILITY' : 'PREVIOUS COMMISSION'}
                </span>
                <span className="font-display font-bold text-lg uppercase">{prevProject.title}</span>
              </div>
            </Link>

            <Link
              to={isIndustry ? '/#industries' : isService ? '/#services' : (location.state?.returnTo || '/#work')}
              onClick={() => {
                sessionStorage.setItem('gw_scroll_restore_target', isIndustry ? `industry-row-${project.slug}` : `project-${project.slug}`);
                sessionStorage.setItem('gw_is_restoring', '1');
              }}
              className="text-xs uppercase font-bold tracking-widest text-gw-ink hover:text-white hover:bg-gw-ink transition-all px-6 py-3 border border-gw-line/80 hover:border-gw-ink rounded-full shadow-sm bg-white/60"
            >
              {isIndustry ? 'VIEW ALL SECTORS' : isService ? 'VIEW ALL SERVICES' : 'VIEW ALL WORK'}
            </Link>

            <Link
              to={`/work/${nextProject.slug}`}
              state={{
                from: isIndustry ? 'industries' : isService ? 'services' : 'work',
                returnTo: location.state?.returnTo || (isIndustry ? '/#industries' : isService ? '/#services' : '/#work'),
                returnTarget: isIndustry ? `industry-row-${nextProject.slug}` : `project-${nextProject.slug}`,
                returnLabel: backLabel,
              }}
              className="flex items-center gap-4 group text-right hover:text-gw-olive transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gw-muted block">
                  {isIndustry ? 'NEXT SECTOR' : isService ? 'NEXT CAPABILITY' : 'NEXT COMMISSION'}
                </span>
                <span className="font-display font-bold text-lg uppercase">{nextProject.title}</span>
              </div>
              <span className="w-10 h-10 rounded-full border border-gw-line flex items-center justify-center group-hover:border-gw-olive group-hover:bg-gw-olive group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </section>

          {/* ── BOTTOM RETURN & CONVERSION ACTION BAR ── */}
          <div className="pt-6 flex items-center justify-between flex-wrap gap-6">
            <button
              type="button"
              onClick={handleBack}
              className="designer-back-btn group cursor-pointer relative z-50 pointer-events-auto"
              aria-label="Back to previous page"
            >
              <span className="back-icon-disc">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              <span className="back-label">{backLabel}</span>
              <span className="back-tag">{backTag}</span>
            </button>

            <Link
              to="/contact"
              className="hero-pill-btn hero-pill-primary group"
            >
              <span>START A PROJECT</span>
              <span className="hero-pill-circle">
                <span className="hero-pill-arrow">→</span>
              </span>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProjectDetail;
