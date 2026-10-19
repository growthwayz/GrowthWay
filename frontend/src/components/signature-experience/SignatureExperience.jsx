import React from 'react';
import { usePublicCms } from '../../lib/publicCms';
import './SignatureExperience.css';

const PHASES = [
  {
    number: '01',
    title: 'IDEAS',
    subtitle: 'Research • Insight • Possibility',
    quote: 'Find the white space.',
    quoteTheme: 'olive',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop',
    figure: 'Spark',
    tags: ['Discovery', 'Market Research', 'Audience Insights'],
    description: 'We identify unseen opportunities, uncover cultural nuances, and establish the strategic spark behind your brand.'
  },
  {
    number: '02',
    title: 'STRATEGY',
    subtitle: 'Audience • Positioning • Direction',
    quote: 'Audience first. Always.',
    quoteTheme: 'cream',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop',
    figure: 'Map',
    tags: ['Brand Positioning', 'Architecture', 'Growth Roadmap'],
    description: 'Translating raw ambition into clear, actionable direction. We align creative purpose with commercial milestones.'
  },
  {
    number: '03',
    title: 'CREATIVITY',
    subtitle: 'Identity • Content • Design',
    quote: 'Make them feel something.',
    quoteTheme: 'olive',
    image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop',
    figure: 'Palette',
    tags: ['Visual Identity', 'Design Systems', 'Storytelling'],
    description: 'Distinctive typography, art direction, and digital experiences engineered to cut through noise and command attention.'
  },
  {
    number: '04',
    title: 'EXECUTION',
    subtitle: 'Campaigns • Production • Ship',
    quote: 'Precision in every detail.',
    quoteTheme: 'dark',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    figure: 'Launch',
    tags: ['Content Production', 'Engineering', 'Rollout'],
    description: 'High-speed delivery across film, campaigns, and web engineering. Built with rigorous craft and zero compromises.'
  },
  {
    number: '05',
    title: 'IMPACT',
    subtitle: 'Growth • Reach • Relevance',
    quote: 'Real brands. Real impact.',
    quoteTheme: 'cream',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    figure: 'Scale',
    tags: ['Brand Equity', 'Performance', 'Sustainable Reach'],
    description: 'Measurable expansion in market share, engagement, and enduring recall. The final outcome that drives your next chapter.'
  }
];

export default function SignatureExperience() {
  const { data: settings } = usePublicCms('/api/site-settings');

  // If custom process steps exist in site settings, merge dynamically; otherwise maintain luxury baseline PHASES
  const activePhases = (settings?.process && settings.process.length >= 3)
    ? settings.process.map((step, idx) => {
        const baseline = PHASES[idx % PHASES.length];
        return {
          ...baseline,
          title: step.title || baseline.title,
          description: step.description || baseline.description,
          image: step.image || baseline.image,
        };
      })
    : PHASES;

  // Seamless loop by duplicating phases: A, B, C, D, E -> A, B, C, D, E
  const loopCards = [...activePhases, ...activePhases];

  return (
    <section className="sig-marquee-section relative w-full overflow-hidden" id="about">
      {/* Background aesthetic grid */}
      <div className="sig-marquee-grid" aria-hidden="true" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 text-xs font-bold tracking-[0.25em] text-gw-muted uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gw-olive" />
            <span>Our Methodology // Process</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-gw-ink leading-[1.05]">
            Ideas to <span className="text-outline-dark">Impact</span><span className="text-gw-olive">.</span>
          </h2>
        </div>
      </div>

      {/* Continuous Right-to-Left Marquee Track */}
      <div className="sig-marquee-wrapper relative w-full py-6 pb-20 md:pb-28">
        {/* Soft edge fade masks for seamless visual infinity */}
        <div className="sig-fade-left" aria-hidden="true" />
        <div className="sig-fade-right" aria-hidden="true" />

        <div className="sig-marquee-track">
          {loopCards.map((phase, idx) => (
            <div 
              key={`${phase.number}-${idx}`} 
              className="sig-process-card group"
            >
              {/* Card Header: Number & Title */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="font-mono text-xs font-bold tracking-widest text-gw-olive">
                    PHASE {phase.number}
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-gw-ink mt-0.5">
                    {phase.title}
                  </h3>
                </div>
                <span className="text-3xl font-serif font-black text-gw-muted/20 select-none">
                  {phase.number}
                </span>
              </div>

              {/* Subtitle pill */}
              <div className="text-[11px] font-mono tracking-wider text-gw-muted uppercase mb-4 pb-3 border-b border-[#E3E7D9]">
                {phase.subtitle}
              </div>

              {/* Card Image Canvas with Tape & Sticky Note */}
              <div className="sig-card-media relative rounded-sm overflow-hidden mb-5 bg-[#E3E7D9]">
                <img 
                  src={phase.image} 
                  alt={phase.title} 
                  loading="lazy"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-2.5 left-3 text-[10px] font-mono font-bold tracking-widest text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-sm">
                  {phase.figure}
                </span>

                {/* Sticky Note Quote */}
                <div className={`sig-card-sticky sig-sticky-${phase.quoteTheme}`}>
                  "{phase.quote}"
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gw-muted leading-relaxed font-body mb-5">
                {phase.description}
              </p>

              {/* Capability tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[#E3E7D9]/60">
                {phase.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-1 bg-white border border-[#DCE0D4] text-gw-ink rounded-sm shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
