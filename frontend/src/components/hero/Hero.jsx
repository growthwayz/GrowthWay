import { useEffect, useRef } from 'react'
import './Hero.css'
import heroVideo from "./videos/sample.mp4";
const PLACEHOLDER_VIDEO = heroVideo

export default function Hero() {
  const videoLayerRef = useRef(null)
  const impactTargetRef = useRef(null)
  const maskTextRef = useRef(null)
  const uiLayerRef = useRef(null)
  const scrollHintRef = useRef(null)
  const cachedMetricsRef = useRef(null)
  const tickingRef = useRef(false)

  useEffect(() => {
    const videoLayer = videoLayerRef.current
    const targetEl = impactTargetRef.current
    const maskText = maskTextRef.current
    const uiLayer = uiLayerRef.current
    const scrollHint = scrollHintRef.current

    function initMetrics() {
      // Reset transforms so getBoundingClientRect reads the natural unscaled layout
      maskText.style.transform = 'scale3d(1, 1, 1)'

      const rect = targetEl.getBoundingClientRect()
      const computed = window.getComputedStyle(targetEl)

      // Calculate mathematically perfect center points instead of guessing baselines
      const centerX = rect.left + (rect.width / 2)
      const centerY = rect.top + (rect.height / 2)

      cachedMetricsRef.current = {
        centerX: centerX,
        centerY: centerY,
        fontSize: computed.fontSize,
        letterSpacing: computed.letterSpacing,
      }

      // Align from exact center
      maskText.setAttribute('x', centerX)
      maskText.setAttribute('y', centerY)
      maskText.setAttribute('text-anchor', 'middle')
      maskText.setAttribute('dominant-baseline', 'middle')

      // Inject identical font properties
      maskText.style.fontSize = cachedMetricsRef.current.fontSize
      maskText.style.letterSpacing = cachedMetricsRef.current.letterSpacing
      maskText.textContent = targetEl.getAttribute('data-text') // Ensures text matches

      // FIX: Forces SVG to render smoothly during massive scales
      maskText.setAttribute('text-rendering', 'geometricPrecision')
      maskText.style.willChange = 'transform'
      maskText.style.transformOrigin = `${centerX}px ${centerY}px`

      updateFrame()
    }

    function updateFrame() {
      if (!cachedMetricsRef.current) return

      const scrollY = window.scrollY
      const distance = window.innerHeight * 2
      let p = Math.max(0, Math.min(1, scrollY / distance))
      const easeP = 1 - Math.pow(1 - p, 3)

      // Base scale 250 ensures it always covers the edges of ultra-wide monitors
      const scale = 1 + (250 - 1) * (1 - easeP)

      // Always keep clipPath applied to avoid a visual "pop" at p < 0.01
      videoLayer.style.clipPath = 'url(#video-mask)'
      videoLayer.style.webkitClipPath = 'url(#video-mask)'

      // scale3d forces hardware GPU acceleration for buttery smooth scaling
      maskText.style.transform = `scale3d(${scale}, ${scale}, 1)`

      // Fade in the underlying UI as you scroll
      uiLayer.style.opacity = Math.min(1, easeP * 1.5)
      scrollHint.style.opacity = Math.max(0, 1 - (p * 5))

      // THE FIX: Seamless text crossfade
      // Instead of them rendering on top of each other and glitching,
      // the video handles the text shape until the very end, then crossfades instantly.
      if (p > 0.85) {
        // Smoothly maps progress over the last 15% of the scroll
        const crossfade = (p - 0.85) * (1 / 0.15) // 0 to 1
        videoLayer.style.opacity = Math.max(0, 1 - crossfade)
        targetEl.style.opacity = crossfade
      } else {
        videoLayer.style.opacity = 1
        targetEl.style.opacity = 0 // Completely hides DOM text while video is covering it
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

    // Ensure fonts are fully loaded before calculating width/height bounding boxes
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initMetrics()
        // Brief timeout fallback for older browsers
        setTimeout(initMetrics, 150)
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
    <>
      {/* Page 1: scroll-driven video intro */}
      <div className="h-[300vh] w-full relative">
        <div className="sticky top-0 w-full h-screen overflow-hidden theme-bg">

          {/* SVG clipPath definition */}
          <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
              <clipPath id="video-mask" clipPathUnits="userSpaceOnUse">
                <text
                  ref={maskTextRef}
                  fontFamily="'Inter', sans-serif"
                  fontWeight="900"
                  fill="white"
                />
              </clipPath>
            </defs>
          </svg>

          {/* Video layer */}
          <div
            ref={videoLayerRef}
            className="absolute inset-0 w-full h-full z-40 pointer-events-none origin-center"
          >
            <video
              src={PLACEHOLDER_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Scroll hint */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/90 text-xs font-bold tracking-[0.3em] uppercase z-50 flex flex-col items-center gap-3"
          >
            Scroll to Explore
            <div className="w-[2px] h-12 bg-white/20 overflow-hidden relative rounded-full">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[scrollDown_1.5s_infinite]" />
            </div>
          </div>

          {/* UI layer (hero content) */}
          <div
            ref={uiLayerRef}
            className="w-full h-full flex flex-col absolute inset-0 z-10 opacity-0 pointer-events-auto"
          >
            {/* Nav */}
            <nav className="w-full flex items-center justify-between px-6 md:px-16 py-8 relative z-50">
              <a href="#" className="text-2xl font-black tracking-tight flex items-center">
                GROWTH<span style={{ color: 'var(--brand-pink)' }}>WAY</span>
              </a>
              <div className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest text-gray-600">
                <a href="#" className="hover:text-black transition-colors duration-300">WORK</a>
                <a href="#" className="hover:text-black transition-colors duration-300">SERVICES</a>
                <a href="#" className="hover:text-black transition-colors duration-300">ABOUT</a>
              </div>
              <a
                href="#"
                className="hidden sm:inline-block border border-gray-300 px-6 py-2.5 text-xs font-bold tracking-wider uppercase rounded hover:bg-black hover:text-white transition-all duration-300"
              >
                Start a Project
              </a>
            </nav>

            {/* Main content */}
            <main className="flex-1 w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 pb-12 lg:pb-0 relative gap-12 lg:gap-8">
              <div className="w-full lg:w-[55%] flex flex-col justify-center z-10 pt-10 lg:pt-0 relative">
                {/* 3D cube */}
                <div className="scene-3d bg-parallax-layer">
                  <div className="cube-wrapper hidden md:block">
                    <div className="cube-face face-front" />
                    <div className="cube-face face-back" />
                    <div className="cube-face face-right" />
                    <div className="cube-face face-left" />
                    <div className="cube-face face-top" />
                    <div className="cube-face face-bottom" />
                  </div>
                </div>

                {/* Eyebrow */}
                <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
                  <span className="w-10 h-[1px] bg-red-400" />
                  Creative Growth Agency
                </div>

                {/* Headline */}
                <h1
                  className="flex flex-col font-black leading-[0.85] tracking-tighter mb-8"
                  style={{ fontSize: 'clamp(4.5rem, 9vw, 9rem)' }}
                >
                  <span className="text-black inline-block overflow-hidden pb-1 leading-[0.75] align-bottom">IDEAS TO</span>
                  <div className="relative flex items-center flex-wrap gap-4 mt-2">
                    <span
                      ref={impactTargetRef}
                      id="impact-target"
                      className="text-outline inline-block"
                      data-text="IMPACT"
                    >
                      IMPACT
                    </span>
                    <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-xl whitespace-nowrap mt-4 sm:mt-0 relative sm:-top-4 lg:-top-6">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Open for Projects
                    </div>
                  </div>
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-base lg:text-lg max-w-md leading-relaxed mb-10">
                  We build brands people remember. Strategy, content, branding, campaigns and execution — all under one roof.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pointer-events-auto">
                  <a
                    href="#"
                    className="bg-[#111] text-white px-8 py-4 text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors duration-300 shadow-xl flex items-center gap-3 group"
                  >
                    Start a Project
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>

              {/* Showreel card */}
              <div className="w-full lg:w-[45%] h-[50vh] lg:h-[75vh] flex items-center justify-center relative mt-12 lg:mt-0">
                <div className="w-full max-w-[550px] h-full max-h-[700px] bg-[#151515] rounded-xl shadow-2xl relative flex flex-col items-center justify-center cursor-pointer overflow-hidden border border-white/5 group">
                  <div className="absolute inset-0 bg-grid-pattern opacity-50 z-0" />
                  <div className="flex flex-col items-center gap-6 z-10 transition-transform duration-500 group-hover:scale-105">
                    <div className="w-20 h-20 rounded-full border border-gray-400/50 flex items-center justify-center hover:bg-white transition-colors duration-500 relative text-white hover:text-black">
                      <svg className="w-6 h-6 ml-1 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase">Showreel</span>
                  </div>
                </div>
              </div>
            </main>
          </div>

        </div>
      </div>

      {/* Page 2: Next Section */}
      <div className="h-screen flex items-center justify-center theme-bg border-t border-gray-200">
        <p className="text-gray-400 font-bold tracking-widest uppercase">Next Section</p>
      </div>
    </>
  )
}
