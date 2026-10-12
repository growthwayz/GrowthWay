import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

      <main id="main-content" tabIndex="-1" className="outline-none">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center bg-gw-canvas text-gw-olive font-display text-sm tracking-widest uppercase">
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<PortfolioPage />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
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

            {/* Catch-all fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && (
        <>
          <div id="contact">
            <Footer />
          </div>
          <ChatWidget />
          <WhatsAppFloat />
        </>
      )}
    </div>
  )
}

export default App
