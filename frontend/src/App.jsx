import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import Footer from './components/footer/Footer'
import CustomCursor from './components/CustomCursor'
import SignatureExperience from './components/signature-experience/SignatureExperience'
import Hero from './components/hero/Hero'
import PortfolioPage from './pages/PortfolioPage'
import ProjectDetail from './pages/ProjectDetail'
import Services from './components/services/Services'

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
    </div>
  )
}

function App() {
  return (
    <div
      className="min-h-screen font-sans text-gw-ink"
      style={{
        backgroundColor: '#FAF8F5',
        backgroundImage:
          'linear-gradient(180deg, rgba(92,158,49,0.06) 0%, rgba(250,248,245,0) 400px)',
      }}
    >
      <CustomCursor />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<PortfolioPage />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>

      <div id="contact">
        <Footer />
      </div>
    </div>
  )
}

export default App