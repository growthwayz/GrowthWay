import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigationType } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import Footer from './components/footer/Footer'
import SignatureExperience from './components/signature-experience/SignatureExperience'
import Hero from './components/hero/Hero'
import PortfolioPage from './pages/PortfolioPage'
import Services from './components/services/Services'
import IndustriesList from './components/industries/IndustriesList'
import WhyGrowthway from './components/why/WhyGrowthway'
import ClientLogos from './components/clients/ClientLogos'
import Testimonials from './components/testimonials/Testimonials'
import FounderCards from './components/founders/FounderCards'
import FinalCTA from './components/cta/FinalCTA'
import WhatsAppFloat from './components/chatbot/WhatsAppFloat'
import ChatWidget from './components/chatbot/ChatWidget'

// Code splitting / Lazy-loaded routes for performance (Seq 48)
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminContent = lazy(() => import('./pages/admin/AdminContent'))
const AdminHero = lazy(() => import('./pages/admin/AdminHero'))
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'))
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminAccounts = lazy(() => import('./pages/admin/AdminAccounts'))
const LegalPage = lazy(() => import('./pages/LegalPage'))

const scrollPositionCache = new Map()

function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()

  // Prevent browser native premature restoration that clashes with React component mounting
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Persist scroll position both in-memory and in sessionStorage
  useEffect(() => {
    const saveCurrentScroll = () => {
      const y = window.scrollY
      if (y > 0) {
        scrollPositionCache.set(location.key, y)
        try {
          sessionStorage.setItem(`gw_pos_${location.key}`, String(y))
          sessionStorage.setItem(`gw_last_${location.pathname}`, String(y))
        } catch {}
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        scrollPositionCache.set(location.key, window.scrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      saveCurrentScroll()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.key, location.pathname])

  useEffect(() => {
    // Detail pages, contact page, etc. must ALWAYS land at top (top: 0).
    // Return scroll restoration only applies when returning back to home or the /work portfolio index.
    const isTargetPage = location.pathname === '/' || location.pathname === '/work';

    if (!isTargetPage) {
      if (!location.hash) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      return;
    }

    // 1. Check for specific target restoration when returning to home or /work
    const specificTargetId = location.state?.returnTarget || 
      sessionStorage.getItem('gw_scroll_restore_target') || 
      sessionStorage.getItem('gw_return_target');
    const specificScrollY = location.state?.returnScrollY ?? (
      sessionStorage.getItem('gw_scroll_restore_y') ? Number(sessionStorage.getItem('gw_scroll_restore_y')) : 
      sessionStorage.getItem('gw_return_scroll') ? Number(sessionStorage.getItem('gw_return_scroll')) : null
    );

    if (specificTargetId || typeof specificScrollY === 'number') {
      let attempts = 0;
      let timer = null;

      const performSpecificScroll = () => {
        attempts++;
        let target = specificTargetId ? document.getElementById(specificTargetId) : null;
        if (!target && specificTargetId?.startsWith('project-')) {
          target = document.getElementById(specificTargetId.replace('project-', ''));
        }

        if (target) {
          const rect = target.getBoundingClientRect();
          const targetY = rect.top + window.scrollY - 90;
          window.scrollTo({ top: Math.max(0, targetY), behavior: attempts === 1 ? 'auto' : 'smooth' });
          if (attempts >= 4 && Math.abs(rect.top - 90) < 15) {
            sessionStorage.removeItem('gw_scroll_restore_target');
            sessionStorage.removeItem('gw_scroll_restore_y');
            sessionStorage.removeItem('gw_return_target');
            sessionStorage.removeItem('gw_return_scroll');
            return;
          }
        } else if (typeof specificScrollY === 'number' && specificScrollY > 0) {
          window.scrollTo({ top: specificScrollY, behavior: 'auto' });
          if (attempts >= 4 && Math.abs(window.scrollY - specificScrollY) < 15) {
            sessionStorage.removeItem('gw_scroll_restore_target');
            sessionStorage.removeItem('gw_scroll_restore_y');
            sessionStorage.removeItem('gw_return_target');
            sessionStorage.removeItem('gw_return_scroll');
            return;
          }
        }

        if (attempts < 16) {
          timer = setTimeout(performSpecificScroll, 60);
        } else {
          sessionStorage.removeItem('gw_scroll_restore_target');
          sessionStorage.removeItem('gw_scroll_restore_y');
          sessionStorage.removeItem('gw_return_target');
          sessionStorage.removeItem('gw_return_scroll');
        }
      };

      timer = setTimeout(performSpecificScroll, 30);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }

    // 2. Normal hash scrolling (e.g. #hero, #services, #contact)
    if (location.hash) {
      const hashId = decodeURIComponent(location.hash.slice(1));
      let attempts = 0;
      let timer = null;

      const attemptScroll = () => {
        attempts++;
        const target = document.getElementById(hashId);
        if (target) {
          const rect = target.getBoundingClientRect();
          if (attempts === 1 || Math.abs(rect.top - 80) > 40) {
            const targetY = rect.top + window.scrollY - 80;
            window.scrollTo({ top: Math.max(0, targetY), behavior: attempts === 1 ? 'auto' : 'smooth' });
          }
        }
        if (attempts < 16) {
          timer = setTimeout(attemptScroll, 80);
        }
      };

      timer = setTimeout(attemptScroll, 40);
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else if (navigationType === 'POP') {
      let savedY = scrollPositionCache.get(location.key);
      if (typeof savedY !== 'number') {
        try {
          const fromSession = sessionStorage.getItem(`gw_pos_${location.key}`);
          if (fromSession) savedY = Number(fromSession);
          else {
            const fromPath = sessionStorage.getItem(`gw_last_${location.pathname}`);
            if (fromPath) savedY = Number(fromPath);
          }
        } catch {}
      }

      if (typeof savedY === 'number' && savedY > 0) {
        let attempts = 0;
        let pollTimer = null;

        const restoreScroll = () => {
          attempts++;
          window.scrollTo({ top: savedY, behavior: 'auto' });
          if (attempts < 18 && Math.abs(window.scrollY - savedY) > 50) {
            pollTimer = setTimeout(restoreScroll, 60);
          }
        };

        pollTimer = setTimeout(restoreScroll, 40);
        return () => {
          if (pollTimer) clearTimeout(pollTimer);
        };
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.hash, location.pathname, location.key, location.state, navigationType]);

  return null
}

/**
 * Homepage flow (per Phase A acceptance):
 * Hero → Statement (SignatureExperience) → Selected Work → Ideas→Impact →
 * Services → Industries → Why → Founders → Testimonials/Clients →
 * Final CTA → Footer
 */
function Home() {
  return (
    <div className="flex flex-col w-full">
      <div id="hero">
        <Hero />
      </div>
      <div id="work">
        <PortfolioPage />
      </div>
      <div id="about">
        <SignatureExperience />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="industries">
        <IndustriesList />
      </div>
      <div id="why">
        <WhyGrowthway />
      </div>
      <div id="founders">
        <FounderCards />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="clients">
        <ClientLogos />
      </div>
      <div id="final-cta">
        <FinalCTA />
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isWorkRoute = location.pathname === '/work'

  return (
    <div
      className="min-h-screen font-sans text-gw-ink"
      style={{
        backgroundColor: '#FAF8F5',
        backgroundImage: isAdminRoute
          ? 'none'
          : 'linear-gradient(180deg, rgba(92,158,49,0.06) 0%, rgba(250,248,245,0) 400px)',
      }}
    >
      {/* Skip to Content for Keyboard / Screen Reader Accessibility (Seq 46) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-gw-olive focus:text-white focus:rounded focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {!isAdminRoute && <Navbar />}
      <ScrollManager />

      <main id="main-content" tabIndex="-1" className="outline-none">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center bg-gw-canvas text-gw-olive font-display text-sm tracking-widest uppercase">
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<PortfolioPage standalone />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="content/:collection" element={<AdminContent />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminAccounts mode="users" />} />
              <Route path="audit" element={<AdminAccounts mode="audit" />} />
              <Route path="account" element={<AdminAccounts mode="account" />} />
            </Route>

            <Route path="*" element={
              <div className="min-h-[60vh] grid place-items-center px-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase tracking-luxury text-gw-olive font-semibold mb-3">Protocol 404</span>
                  <h1 className="font-display text-5xl md:text-6xl font-bold uppercase tracking-tight mb-8">Page Not Found</h1>
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
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && (
        <>
          {!isWorkRoute && <div id="contact"><Footer /></div>}
          <ChatWidget />
          <WhatsAppFloat />
        </>
      )}
    </div>
  )
}

export default App
