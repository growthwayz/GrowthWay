import { Routes, Route, Navigate } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/navigation/Navbar';
import Hero from './components/hero/Hero';

function App() {
  return (
    <div
      className="min-h-screen font-sans text-[#111111]"
      style={{
        backgroundColor: '#F7F4F4',
        backgroundImage:
          'linear-gradient(180deg, rgba(241,206,203,0.15) 0%, rgba(247,244,244,0) 300px)',
      }}
    >
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/work" element={<PortfolioPage />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
