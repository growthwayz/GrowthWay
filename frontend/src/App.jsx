import { Routes, Route, Navigate } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/work" replace />} />
      <Route path="/work" element={<PortfolioPage />} />
      <Route path="/work/:slug" element={<ProjectDetail />} />
    </Routes>
  );
}

export default App;
