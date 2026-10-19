import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';

/* ── Helper for exact return targeting ── */
const createProjectLinkProps = (slug) => ({
  to: `/work/${slug}`,
  onClick: () => {
    sessionStorage.setItem('gw_return_scroll', String(window.scrollY));
    sessionStorage.setItem('gw_return_target', `project-${slug}`);
  },
  state: {
    from: 'work',
    returnTo: typeof window !== 'undefined' && window.location.pathname === '/work' ? '/work' : '/#work',
    returnTarget: `project-${slug}`,
    returnScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    returnLabel: 'Back to Selected Work',
  },
});

/* ─────────────────────────────────────────
   LAYOUT 1: Split (Text left, Image right — alternating)
   ───────────────────────────────────────── */
const SplitProject = ({ project, index }) => (
  <div id={`project-${project.slug}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-center py-12 md:py-16 border-b border-gw-line/40 scroll-mt-28">
    <div className={`flex flex-col items-start ${index % 2 === 0 ? 'order-2 md:order-1 md:pr-16' : 'order-2 md:order-2 md:pl-16'}`}>
      
      {/* Project number & location */}
      <div className="flex items-center gap-4 mb-4 reveal">
        <span className="text-gw-olive font-display font-bold text-7xl md:text-8xl">{project.id}</span>
        <span className="text-xs uppercase tracking-luxury text-gw-olive/80">{project.metadata.location}</span>
      </div>

      <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-4 tracking-[-0.04em] interactive-hover reveal reveal-delay-1">{project.title}</h3>
      <p className="text-sm uppercase tracking-editorial text-gw-muted/80 mb-6 reveal reveal-delay-1">{project.categories.join(' · ')}</p>
      
      <p className="text-base md:text-lg text-gw-charcoal/80 leading-relaxed mb-4 max-w-sm reveal reveal-delay-2">{project.description}</p>
      <p className="text-sm md:text-base text-gw-charcoal/60 leading-relaxed mb-10 max-w-sm reveal reveal-delay-2">{project.longDescription}</p>

      <Link 
        {...createProjectLinkProps(project.slug)}
        className="case-study-pill-btn group reveal reveal-delay-3"
      >
        <span>VIEW CASE STUDY</span>
        <span className="case-study-disc">
          <ArrowRight className="w-4 h-4 case-study-arrow" />
        </span>
      </Link>
    </div>
    <div className={`${index % 2 === 0 ? 'order-1 md:order-2' : 'order-1 md:order-1'} reveal-scale`}>
      <TiltCard>
        <Link 
          {...createProjectLinkProps(project.slug)}
          className="block aspect-[4/5] bg-gw-black"
        >
          <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" className="w-full h-full object-cover" />
        </Link>
      </TiltCard>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   LAYOUT 2: Portrait (Centered image + editorial text)
   ───────────────────────────────────────── */
const PortraitProject = ({ project }) => (
  <div id={`project-${project.slug}`} className="py-12 md:py-16 border-b border-gw-line/40 flex flex-col md:flex-row gap-12 md:gap-28 justify-center items-center scroll-mt-28">
    <div className="w-full md:w-5/12 reveal-scale">
      <TiltCard>
        <Link 
          {...createProjectLinkProps(project.slug)}
          className="block aspect-[3/4] bg-gw-black"
        >
          <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" className="w-full h-full object-cover" />
        </Link>
      </TiltCard>
    </div>
    <div className="w-full md:w-5/12 flex flex-col items-start">
       <div className="flex items-center gap-3 mb-4 reveal">
         <span className="text-gw-olive font-display font-bold text-7xl md:text-8xl">{project.id}</span>
         <span className="text-gw-muted/30">—</span>
         <span className="text-xs uppercase tracking-luxury text-gw-olive/80">{project.metadata.location}</span>
       </div>

       <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-4 leading-tight tracking-[-0.04em] interactive-hover reveal reveal-delay-1">{project.title}</h3>
       
       <p className="text-base md:text-lg text-gw-charcoal/80 leading-relaxed mb-4 max-w-sm reveal reveal-delay-2">{project.description}</p>
       <p className="text-sm md:text-base text-gw-charcoal/60 leading-relaxed mb-10 max-w-sm reveal reveal-delay-2">{project.longDescription}</p>
       
       <div className="flex flex-wrap gap-3 mb-10 reveal reveal-delay-2">
         {project.categories.map(cat => (
           <span key={cat} className="text-xs border border-gw-line/60 px-4 py-1.5 uppercase tracking-editorial text-gw-muted/80 hover:border-gw-olive hover:text-gw-olive transition-colors duration-300">{cat}</span>
         ))}
       </div>

       <Link 
         {...createProjectLinkProps(project.slug)}
         className="case-study-pill-btn group reveal reveal-delay-3"
       >
         <span>VIEW CASE STUDY</span>
         <span className="case-study-disc">
           <ArrowRight className="w-4 h-4 case-study-arrow" />
         </span>
       </Link>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   LAYOUT 3: Dark (Full-width band with testimonial)
   ───────────────────────────────────────── */
const DarkProject = ({ project }) => (
  <div id={`project-${project.slug}`} className="py-14 md:py-18 bg-gw-black text-gw-white -mx-5 md:-mx-18 px-5 md:px-18 relative overflow-hidden scroll-mt-28">
    {/* Ambient glow */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gw-olive/[0.03] blur-[120px] pointer-events-none"></div>

    <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10">
      <div className="lg:col-span-5 flex flex-col items-start">
        <div className="flex items-center gap-4 mb-4 reveal">
          <span className="text-gw-olive font-display font-bold text-7xl md:text-8xl">{project.id}</span>
          <span className="text-xs uppercase tracking-luxury text-gw-white/60">{project.metadata.location}</span>
        </div>

        <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-4 tracking-[-0.04em] text-gw-white interactive-hover reveal reveal-delay-1">{project.title}</h3>
        <p className="text-sm uppercase tracking-editorial text-gw-white/60 mb-8 reveal reveal-delay-1">{project.categories.join(' · ')}</p>
        <p className="text-base md:text-lg text-gw-white/80 leading-relaxed mb-4 max-w-md reveal reveal-delay-2">{project.description}</p>
        <p className="text-sm md:text-base text-gw-white/60 leading-relaxed mb-10 max-w-md reveal reveal-delay-2">{project.longDescription}</p>

        <Link 
          {...createProjectLinkProps(project.slug)}
          className="case-study-pill-btn case-study-pill-light group reveal reveal-delay-3"
        >
          <span>VIEW CASE STUDY</span>
          <span className="case-study-disc">
            <ArrowUpRight className="w-4 h-4 case-study-arrow" />
          </span>
        </Link>
      </div>
      <div className="lg:col-span-7 reveal-scale">
        <TiltCard>
          <Link 
            {...createProjectLinkProps(project.slug)}
            className="block aspect-video bg-gw-charcoal"
          >
            <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" className="w-full h-full object-cover" />
          </Link>
        </TiltCard>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   LAYOUT 4: Typography (Big title + wide image)
   ───────────────────────────────────────── */
const TypographyProject = ({ project }) => (
  <div id={`project-${project.slug}`} className="py-14 md:py-18 border-b border-gw-line/40 relative group scroll-mt-28">
    <Link 
      {...createProjectLinkProps(project.slug)}
      className="block absolute inset-0 z-10"
    ></Link>
    
    {/* Editorial label above */}
    <div className="text-center mb-4 relative z-20 pointer-events-none reveal">
      <span className="text-xs uppercase tracking-luxury text-gw-muted/60">{project.metadata.location} · {project.metadata.year}</span>
    </div>

    <div className="text-center mb-10 md:mb-16 relative z-20 pointer-events-none reveal reveal-delay-1">
      <h3 className="font-display text-6xl md:text-[90px] lg:text-[110px] font-bold uppercase tracking-[-0.05em] leading-none text-gw-ink group-hover:text-gw-olive transition-colors duration-700 interactive-hover pointer-events-auto inline-block">{project.title}</h3>
    </div>
    
    <div className="w-full max-w-5xl mx-auto z-0 relative reveal-scale">
      <TiltCard>
        <div className="aspect-[21/9] bg-gw-black">
          <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </TiltCard>
    </div>

    {/* Description below image */}
    <div className="max-w-5xl mx-auto mt-10 md:mt-14 relative z-20 pointer-events-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 reveal reveal-delay-2">
        <div className="max-w-md">
          <p className="text-base text-gw-charcoal/80 leading-relaxed">{project.longDescription || project.description}</p>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-sm uppercase tracking-editorial text-gw-muted/80">{project.categories.join(' · ')}</p>
          <Link {...createProjectLinkProps(project.slug)} className="case-study-pill-btn group pointer-events-auto">
            <span>VIEW CASE STUDY</span>
            <span className="case-study-disc">
              <ArrowUpRight className="w-3.5 h-3.5 case-study-arrow" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   COLLECTION WRAPPER
   ───────────────────────────────────────── */
const ProjectCollection = ({ projects }) => {
  return (
    <section className="bg-gw-canvas">
      <div className="max-w-[1440px] mx-auto px-5 md:px-18">
        <div className="flex flex-col">
          {projects.map((project, index) => {
            switch (project.composition) {
              case 'split':
                return <SplitProject key={project.id} project={project} index={index} />;
              case 'portrait':
                return <PortraitProject key={project.id} project={project} />;
              case 'dark':
                return <DarkProject key={project.id} project={project} />;
              case 'typography':
                return <TypographyProject key={project.id} project={project} />;
              default:
                return <SplitProject key={project.id} project={project} index={index} />;
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectCollection;

