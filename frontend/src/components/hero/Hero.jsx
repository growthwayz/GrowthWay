import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import heroVideo from '../../assets/introvidio1.mp4'
import { videoUrl } from '../../lib/media'
import { usePublicCms } from '../../lib/publicCms'

const PLACEHOLDER_VIDEO = heroVideo

export default function Hero() {
  const showreelVideoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const { data: settings } = usePublicCms('/api/site-settings')
  const hero = settings?.hero
  const videoSource = hero?.videoUrl && hero.videoPermissionApproved ? videoUrl(hero.videoUrl) : PLACEHOLDER_VIDEO

  // Ensure showreel video autoplays and matches muted state
  useEffect(() => {
    if (showreelVideoRef.current) {
      showreelVideoRef.current.defaultMuted = true
      showreelVideoRef.current.muted = isMuted
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

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (!showreelVideoRef.current) return
    const nextMuted = !isMuted
    showreelVideoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <div className="gw-hero w-full min-h-screen relative flex items-start justify-center theme-bg pt-20 pb-8 lg:pt-26 lg:pb-10 overflow-hidden">
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
      <main className="hero-presentation w-full max-w-[1520px] mx-auto flex flex-col lg:flex-row items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16 relative gap-8 lg:gap-10 xl:gap-14 z-10">
        
        {/* Left Column: Typography & Conversion Core */}
        <div className="hero-content-col w-full lg:w-[52%] flex flex-col justify-start lg:self-start z-10">
          
          {/* Eyebrow with official emblem badge */}
          <div className="hero-eyebrow flex items-center gap-3 sm:gap-4 text-xs font-bold tracking-[0.25em] text-gw-muted uppercase mb-3.5 sm:mb-4">
            <img src="/logo-icon.png" alt="" className="w-5 h-5 rounded-[4px] object-cover shadow-sm" />
            <span className="w-8 h-[1.5px] bg-gw-olive" />
            <span>Creative Growth Agency</span>
            <span className="text-[#D6D0C7]">/</span>
            <span className="font-mono text-gw-olive">GORAKHPUR · UP</span>
          </div>

          {/* Master Headline */}
          <h1
            className="flex flex-col font-display font-bold uppercase leading-[0.92] tracking-[-0.03em] mb-4 sm:mb-5"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 5.4rem)' }}
          >
            <span className="text-gw-ink inline-block overflow-hidden leading-[0.85] align-bottom">
              IDEAS TO
            </span>
            <div className="relative flex items-center flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-2.5">
              <span
                id="impact-target"
                className="text-outline inline-block text-gw-ink"
                data-text="IMPACT"
              >
                IMPACT
              </span>
              <div className="inline-flex items-center gap-2 bg-gw-ink text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-gw-olive animate-pulse" />
                <span>Open for Projects</span>
              </div>
            </div>
          </h1>

          {/* Description */}
          <p className="text-gw-muted text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed mb-6 sm:mb-7 font-body">
            We partner with ambitious brands to transform vision into high-conviction digital presence. Strategy, identity, campaigns, and engineering — synthesized under one roof.
          </p>

          {/* CTAs */}
          <div className="flex flex-row flex-wrap items-center gap-4 sm:gap-5">
            <Link
              to="/contact"
              className="hero-pill-btn hero-pill-primary group"
            >
              <span>START A PROJECT</span>
              <span className="hero-pill-circle">
                <span className="hero-pill-arrow">→</span>
              </span>
            </Link>

            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById('work')
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  window.history.pushState(null, '', '#work')
                }
              }}
              className="hero-pill-btn hero-pill-secondary group"
            >
              <span>EXPLORE SELECTED WORK</span>
              <span className="hero-pill-circle hero-pill-circle-sec">
                <span className="hero-pill-arrow">↓</span>
              </span>
            </a>
          </div>
        </div>

        {/* Right Column: Video Showreel Showcase */}
        <div className="hero-showreel w-full lg:w-[40%] flex items-center justify-center lg:justify-end relative mt-6 lg:mt-0 lg:self-center">
          <div
            onClick={toggleShowreel}
            role="button"
            tabIndex={0}
            aria-label={isPlaying ? 'Pause showreel' : 'Play showreel'}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleShowreel(); } }}
            className="w-full max-w-[440px] sm:max-w-[470px] xl:max-w-[500px] aspect-[1080/1232] bg-white rounded-xl sm:rounded-2xl shadow-2xl relative flex items-center justify-center cursor-pointer overflow-hidden border border-black/10 group"
          >
            {/* Direct uncropped video player */}
            <video
              ref={showreelVideoRef}
              onPlay={handlePlay}
              onPause={handlePause}
              src={videoSource}
              poster={hero?.poster || undefined}
              preload="metadata"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain block select-none transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* Unmute / Mute Audio Button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute showreel audio" : "Mute showreel audio"}
              className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-xl"
            >
              {isMuted ? (
                <>
                  <svg className="w-3.5 h-3.5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                  <span className="font-bold">UNMUTE</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-gw-olive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span className="font-bold text-gw-olive">MUTE</span>
                </>
              )}
            </button>

            {/* Play/Pause Button Badge — reveals on hover when playing, persists when paused */}
            <div className={`absolute z-20 flex flex-col items-center gap-2.5 transition-all duration-300 pointer-events-none ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/40 bg-black/55 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-gw-ink transition-all duration-300 shadow-2xl">
                {isPlaying ? (
                  <svg className="w-5 h-5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
              <span className="text-white/90 text-[10px] font-bold tracking-[0.22em] uppercase font-mono bg-black/40 px-2 py-0.5 rounded-sm backdrop-blur-xs">
                {isPlaying ? 'PAUSE SHOWREEL' : 'PLAY SHOWREEL'}
              </span>
            </div>

            {/* Corner Badge */}
            <div className="absolute bottom-3.5 left-4 z-20 text-[10px] font-mono uppercase tracking-widest text-gw-ink/70 bg-white/85 backdrop-blur-sm px-2 py-0.5 rounded-sm border border-black/5 shadow-xs">
              GROWTHWAY // SHOWREEL 2026
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
