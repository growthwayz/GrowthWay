import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import Footer from './components/footer/Footer'
import CustomCursor from './components/CustomCursor'
import SignatureExperience from './components/signature-experience/SignatureExperience'
import Hero from './components/hero/Hero'
import PortfolioPage from './pages/PortfolioPage'
import ProjectDetail from './pages/ProjectDetail'
import Services from './components/services/Services'
import IndustriesList from './components/industries/IndustriesList'
import WhyGrowthway from './components/why/WhyGrowthway'
import ClientLogos from './components/clients/ClientLogos'
import Testimonials from './components/testimonials/Testimonials'
import FounderCards from './components/founders/FounderCards'
import FinalCTA from './components/cta/FinalCTA'
import ContactPage from './pages/ContactPage'
import WhatsAppFloat from './components/chatbot/WhatsAppFloat'
import ChatWidget from './components/chatbot/ChatWidget'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

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
      <CustomCursor />
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<PortfolioPage />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
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