import { useEffect, useRef, useState } from 'react'
import './Hero.css'
import heroVideo from "./videos/sample.mp4"
import { videoUrl } from '../../lib/media'
import { usePublicCms } from '../../lib/publicCms'

const PLACEHOLDER_VIDEO = heroVideo

export default function Hero() {
  const containerRef = useRef(null)
  const stickyRef = useRef(null)
  const videoLayerRef = useRef(null)
  const introVideoRef = useRef(null)
  const showreelVideoRef = useRef(null)
  const impactTargetRef = useRef(null)
  const maskTextRef = useRef(null)
  const uiLayerRef = useRef(null)
  const scrollHintRef = useRef(null)
  const cachedMetricsRef = useRef(null)
  const tickingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const { data: settings } = usePublicCms('/api/site-settings')
  const hero = settings?.hero
  const videoSource = hero?.videoUrl && hero.videoPermissionApproved ? videoUrl(hero.videoUrl) : PLACEHOLDER_VIDEO

  // Ensure videos are properly muted and autoplaying without browser blockage
  useEffect(() => {
    if (introVideoRef.current) {
      introVideoRef.current.defaultMuted = true
      introVideoRef.current.muted = true
      introVideoRef.current.play().catch(() => {})
    }
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

  useEffect(() => {
    const videoLayer = videoLayerRef.current
    const targetEl = impactTargetRef.current
    const maskText = maskTextRef.current
    const uiLayer = uiLayerRef.current
    const scrollHint = scrollHintRef.current
    const sticky = stickyRef.current

    if (!videoLayer || !targetEl || !maskText || !uiLayer || !sticky) return

    function initMetrics() {
      if (!maskText || !targetEl || !sticky) return

      // Temporarily reset transform so bounding client rect reads true unscaled layout
      maskText.style.transform = 'scale3d(1, 1, 1)'

      const targetRect = targetEl.getBoundingClientRect()
      const stickyRect = sticky.getBoundingClientRect()
      const computed = window.getComputedStyle(targetEl)

      // Calculate coordinates relative to the sticky viewport canvas
      const centerX = (targetRect.left - stickyRect.left) + (targetRect.width / 2)
      const centerY = (targetRect.top - stickyRect.top) + (targetRect.height / 2)

      cachedMetricsRef.current = {
        centerX,
        centerY,
        fontSize: computed.fontSize,
        letterSpacing: computed.letterSpacing,
      }

      // Align SVG text exactly from calculated center
      maskText.setAttribute('x', centerX)
      maskText.setAttribute('y', centerY)
      maskText.setAttribute('text-anchor', 'middle')
      maskText.setAttribute('dominant-baseline', 'middle')

      // Sync font styling perfectly with DOM outline text
      maskText.style.fontSize = computed.fontSize
      maskText.style.fontFamily = computed.fontFamily
      maskText.style.fontWeight = computed.fontWeight
      maskText.style.letterSpacing = computed.letterSpacing
      maskText.textContent = targetEl.getAttribute('data-text') || 'IMPACT'

      // Force crisp geometric rendering and hardware GPU layering
      maskText.setAttribute('text-rendering', 'geometricPrecision')
      maskText.style.willChange = 'transform'

      // Use fill-box to ensure transform origin percentages map directly to text bounding box.
      // 35% 50% targets solid geometry (stem of 'P' in 'IMPACT').
      // Scaling from here guarantees 100% video coverage at scale 250 without transparent bleed.
      maskText.style.transformBox = 'fill-box'
      maskText.style.transformOrigin = '35% 50%'

      updateFrame()
    }

    function updateFrame() {
      if (!cachedMetricsRef.current) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (window.matchMedia('(max-width: 1023px)').matches) {
        uiLayer.style.opacity = 1
        videoLayer.style.opacity = 0
        targetEl.style.opacity = 1
        if (scrollHint) scrollHint.style.opacity = 0
        tickingRef.current = false
        return
      }
      if (prefersReducedMotion) {
        uiLayer.style.opacity = 1
        videoLayer.style.opacity = 1
        targetEl.style.opacity = 1
        if (scrollHint) scrollHint.style.opacity = 0
        tickingRef.current = false
        return
      }

      // Total scroll range for the video zoom effect (2 viewports of scroll)
      const scrollY = window.scrollY
      const totalDistance = window.innerHeight * 2
      const progress = Math.max(0, Math.min(1, scrollY / totalDistance))
      const easeP = 1 - Math.pow(1 - progress, 3)

      // Scale zooms smoothly out from 250 down to 1
      const scale = 1 + (250 - 1) * (1 - easeP)

      videoLayer.style.clipPath = 'url(#video-mask)'
      videoLayer.style.webkitClipPath = 'url(#video-mask)'

      // Hardware accelerated 3D transform for silky 60/120fps motion
      maskText.style.transform = `scale3d(${scale}, ${scale}, 1)`

      // Fade in the hero UI layer as the zoom progresses
      uiLayer.style.opacity = Math.min(1, easeP * 1.5)

      // Fade out scroll indicator quickly upon starting scroll
      if (scrollHint) {
        scrollHint.style.opacity = Math.max(0, 1 - (progress * 4))
      }

      // Seamless crossfade in the final 15% of the scroll track
      if (progress > 0.85) {
        const crossfade = (progress - 0.85) / 0.15
        videoLayer.style.opacity = Math.max(0, 1 - crossfade)
        targetEl.style.opacity = crossfade
      } else {
        videoLayer.style.opacity = 1
        targetEl.style.opacity = 0
      }

      tickingRef.current = false
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(updateFrame)
        tickingRef.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', initMetrics)

    // Ensure fonts and assets are loaded before measuring bounding boxes
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initMetrics()
        setTimeout(initMetrics, 120)
      })
    } else {
      initMetrics()
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', initMetrics)
    }
  }, [])

  return (
    <div ref={containerRef} className="gw-hero h-[300vh] w-full relative">
      <div ref={stickyRef} className="hero-stage sticky top-0 w-full h-screen overflow-hidden theme-bg">

        {/* SVG clipPath definition for video masking */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            <clipPath id="video-mask" clipPathUnits="userSpaceOnUse">
              <text
                ref={maskTextRef}
                fontFamily="'Space Grotesk', system-ui, sans-serif"
                fontWeight="700"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>

        {/* Video layer that gets masked by the zooming text */}
        <div
          ref={videoLayerRef}
          className="hero-intro-layer absolute inset-0 w-full h-full z-40 pointer-events-none origin-center"
        >
          <video
            ref={introVideoRef}
            src={videoSource}
            poster={hero?.poster || undefined}
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Scroll hint indicator */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/90 text-xs font-bold tracking-[0.3em] uppercase z-50 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span>Scroll to Explore</span>
          <div className="w-[2px] h-12 bg-white/20 overflow-hidden relative rounded-full">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[scrollDown_1.5s_infinite]" />
          </div>
        </div>

        {/* UI layer: Hero content, typography, CTAs and interactive showreel */}
        <div
          ref={uiLayerRef}
          className="hero-ui w-full h-full flex flex-col justify-center absolute inset-0 z-10 pointer-events-auto"
          style={{ opacity: 0 }}
        >
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
                    ref={impactTargetRef}
                    id="impact-target"
                    className="text-outline inline-block text-gw-ink"
                    data-text="IMPACT"
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
