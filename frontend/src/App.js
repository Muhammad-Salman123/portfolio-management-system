import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import PortfolioPreview from './pages/PortfolioPreview';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Sidebar />
      <div className="app-content" style={{ 
        marginLeft: '280px', 
        padding: '20px',
        minHeight: '100vh',
        transition: 'all 0.3s ease',
        maxWidth: 'calc(100% - 280px)',
      }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/skills" element={token ? <Skills /> : <Navigate to="/login" />} />
          <Route path="/projects" element={token ? <Projects /> : <Navigate to="/login" />} />
          <Route path="/categories" element={token ? <Categories /> : <Navigate to="/login" />} />
          <Route path="/preview" element={token ? <PortfolioPreview /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;