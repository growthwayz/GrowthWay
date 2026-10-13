import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';

const FeaturedProject = ({ project }) => {
  return (
    <section className="pt-10 md:pt-14 pb-12 md:pb-16 border-b border-gw-line/40 bg-gw-canvas">
      <div className="max-w-[1440px] mx-auto px-5 md:px-18">
        
        {/* Intro Meta */}
        <div className="flex items-center gap-4 mb-12 md:mb-16 reveal">
          <span className="text-xs uppercase tracking-luxury text-gw-olive font-semibold">Featured Project</span>
          <div className="h-px bg-gw-olive/30 flex-grow max-w-40"></div>
          <span className="text-xs uppercase tracking-editorial text-gw-muted/60 hidden md:block">{project.metadata.year}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left: Project Details */}
          <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1">
            <span className="font-display text-7xl md:text-8xl lg:text-9xl text-gw-olive font-bold leading-none -ml-2 select-none reveal reveal-delay-1">
              {project.id}
            </span>
            
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gw-ink mt-4 mb-4 uppercase tracking-[-0.04em] interactive-hover reveal reveal-delay-2">
              {project.title}
            </h2>

            <p className="text-sm uppercase tracking-editorial text-gw-muted/80 mb-4 reveal reveal-delay-2">
              {project.categories.join(' · ')}
            </p>

            {/* Location & role */}
            <p className="text-xs uppercase tracking-luxury text-gw-olive/80 mb-10 reveal reveal-delay-2">
              {project.metadata.location} — {project.metadata.role}
            </p>

            <p className="text-base md:text-lg text-gw-charcoal/80 leading-relaxed mb-6 max-w-sm reveal reveal-delay-3">
              {project.description}
            </p>
            
            {/* Long description */}
            <p className="text-sm md:text-base text-gw-charcoal/60 leading-relaxed mb-14 max-w-sm reveal reveal-delay-3">
              {project.longDescription}
            </p>

            {/* Project Stats */}
            {project.stats && (
              <div className="flex flex-wrap gap-8 mb-14 reveal reveal-delay-3">
                {Object.entries(project.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <span className="font-display text-3xl font-bold text-gw-ink">{value}</span>
                    <p className="text-[10px] uppercase tracking-luxury text-gw-muted/70 mt-1.5">{key}</p>
                  </div>
                ))}
              </div>
            )}

            <Link 
              to={`/work/${project.slug}`}
              className="group inline-flex items-center gap-5 text-xs font-semibold uppercase tracking-editorial text-gw-ink hover:text-gw-olive transition-colors duration-400 w-fit interactive-hover reveal reveal-delay-4"
            >
              <span className="relative pb-1">
                View Case Study
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gw-ink group-hover:bg-gw-olive transition-colors"></span>
              </span>
              <span className="w-11 h-11 rounded-full border border-gw-line flex items-center justify-center group-hover:border-gw-olive group-hover:bg-gw-olive group-hover:text-white transition-all duration-400">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          {/* Right: Large Visual */}
          <div className="lg:col-span-8 order-1 lg:order-2 reveal-scale">
            <TiltCard>
              <Link to={`/work/${project.slug}`} className="block aspect-[4/3] md:aspect-[16/10] bg-gw-black">
                <img 
                  src={project.image} 
                  alt={project.imageAlt || project.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay with metadata */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-600 z-20">
                  <div className="flex justify-between items-end text-white">
                    <div>
                      <p className="text-xs uppercase tracking-luxury text-gw-white/80 mb-1">{project.metadata.client}</p>
                      <p className="text-base font-medium text-gw-white">{project.metadata.location}</p>
                    </div>
                    <span className="text-xs uppercase tracking-luxury text-gw-white/80">{project.metadata.role}</span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;

