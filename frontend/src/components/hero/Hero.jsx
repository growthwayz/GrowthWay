import { useEffect, useRef, useState } from 'react'
import './Hero.css'
import heroVideo from "./videos/sample.mp4"
import { videoUrl } from '../../lib/media'
import { usePublicCms } from '../../lib/publicCms'

const PLACEHOLDER_VIDEO = heroVideo

export default function Hero() {
  const showreelVideoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const { data: settings } = usePublicCms('/api/site-settings')
  const hero = settings?.hero
  const videoSource = hero?.videoUrl && hero.videoPermissionApproved ? videoUrl(hero.videoUrl) : PLACEHOLDER_VIDEO

  // Keep the showreel muted so it can play inline when the page loads.
  useEffect(() => {
    if (showreelVideoRef.current) {
      showreelVideoRef.current.defaultMuted = true
      showreelVideoRef.current.muted = true
      showreelVideoRef.current.play().catch(() => {})
    }
  }, [videoSource])

  const toggleShowreel = () => {
    if (!showreelVideoRef.current) return
    if (showreelVideoRef.current.paused) {
      showreelVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      showreelVideoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="gw-hero w-full relative">
      <div className="hero-stage w-full min-h-screen overflow-hidden theme-bg">

        {/* Hero content and interactive showreel are visible immediately. */}
        <div className="hero-ui w-full min-h-screen flex flex-col justify-center relative z-10">
          {/* 3D decorative cube layer */}
          <div className="scene-3d bg-parallax-layer" aria-hidden="true">
            <div className="cube-wrapper hidden md:block">
              <div className="cube-face face-front" />
              <div className="cube-face face-back" />
              <div className="cube-face face-right" />
              <div className="cube-face face-left" />
              <div className="cube-face face-top" />
              <div className="cube-face face-bottom" />
            </div>
          </div>

          {/* Main hero presentation canvas */}
          <main className="hero-presentation w-full flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-[5vw] pt-28 pb-16 lg:py-0 relative gap-8 lg:gap-12 z-10">
            
            {/* Left Column: Typography & Conversion Core */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center z-10">
              
              {/* Eyebrow with official emblem badge */}
              <div className="hero-eyebrow flex items-center gap-3 sm:gap-4 text-xs font-bold tracking-[0.25em] text-gw-muted uppercase mb-6 sm:mb-8">
                <img src="/logo-icon.png" alt="" className="w-5 h-5 rounded-[4px] object-cover shadow-sm" />
                <span className="w-8 h-[1.5px] bg-gw-olive" />
                <span>Creative Growth Agency</span>
                <span className="text-[#D6D0C7]">/</span>
                <span className="font-mono text-gw-olive">MUMBAI · GLOBAL</span>
              </div>

              {/* Master Headline */}
              <h1
                className="flex flex-col font-display font-bold uppercase leading-[0.88] tracking-[-0.05em] mb-6 sm:mb-8"
                style={{ fontSize: 'clamp(2.75rem, 10vw, 8.5rem)' }}
              >
                <span className="text-gw-ink inline-block overflow-hidden leading-[0.8] align-bottom">
                  IDEAS TO
                </span>
                <div className="relative flex items-center flex-wrap gap-3 sm:gap-5 mt-2">
                  <span
                    id="impact-target"
                    className="text-outline inline-block text-gw-ink"
                  >
                    IMPACT
                  </span>
                  <div className="inline-flex items-center gap-2.5 bg-gw-ink text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-gw-olive animate-pulse" />
                    <span>Open for Projects</span>
                  </div>
                </div>
              </h1>

              {/* Description */}
              <p className="text-gw-muted text-base sm:text-lg lg:text-xl max-w-lg leading-relaxed mb-8 sm:mb-12 font-body">
                We partner with ambitious brands to transform vision into high-conviction digital presence. Strategy, identity, campaigns, and engineering — synthesized under one roof.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <a
                  href="/contact"
                  className="bg-gw-ink text-white px-9 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-gw-olive transition-colors duration-300 shadow-xl flex items-center gap-3 group rounded-sm"
                >
                  <span>Start a Project</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </a>

                <a
                  href="#work"
                  className="inline-flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase text-gw-ink border border-[#D6D0C7] hover:border-gw-ink rounded-sm transition-all"
                >
                  <span>Explore Selected Work</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* Right Column: Video Showreel Showcase */}
            <div className="hero-showreel w-full lg:w-[45%] h-[34vh] sm:h-[45vh] lg:h-[72vh] flex items-center justify-center relative mt-4 lg:mt-0">
              <div
                onClick={toggleShowreel}
                role="button"
                tabIndex={0}
                aria-label={isPlaying ? 'Pause showreel' : 'Play showreel'}
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleShowreel(); } }}
                className="w-full max-w-[560px] h-full max-h-[680px] bg-gw-charcoal rounded-sm shadow-2xl relative flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-black/10 group"
              >
                {/* Embedded video player */}
                <video
                  ref={showreelVideoRef}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  src={videoSource}
                  poster={hero?.poster || undefined}
                  preload="metadata"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity duration-500 scale-100 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Play/Pause Button Badge */}
                <div className="absolute z-10 flex flex-col items-center gap-3 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/40 bg-black/30 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-gw-ink transition-all duration-300 shadow-2xl">
                    {isPlaying ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white/90 text-[11px] font-bold tracking-[0.25em] uppercase font-mono">
                    {isPlaying ? 'PAUSE SHOWREEL' : 'PLAY SHOWREEL'}
                  </span>
                </div>

                {/* Corner Badge */}
                <div className="absolute bottom-4 left-5 z-10 text-[10px] font-mono uppercase tracking-widest text-white/60">
                  GROWTHWAY // SHOWREEL 2026
                </div>
              </div>
            </div>

          </main>
        </div>

      </div>
    </div>
  )
}
