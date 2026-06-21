import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faUser, faCogs, faFolderOpen, 
  faSignOutAlt, faCode, faEye, faTags,
  faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Sidebar() {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { 'x-auth-token': token }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    if (token) {
      fetchProfile();
    }
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => {
    return location === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarStyle = {
    ...styles.sidebar,
    ...(isMobile ? { transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' } : {})
  };

  return (
    <>
      {/* Hamburger Menu */}
      {isMobile && (
        <button style={styles.hamburger} onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {isMobile && isOpen && (
        <div style={styles.overlay} onClick={closeSidebar}></div>
      )}

      <div style={sidebarStyle}>
        {/* Profile Section - Crown icon removed */}
        <div style={styles.profileContainer}>
          {profile?.profileImage ? (
            <img 
              src={profile.profileImage} 
              alt="Profile" 
              style={styles.profileImage}
            />
          ) : (
            <div style={styles.profilePlaceholder}>
              {profile?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div style={styles.profileInfo}>
            <h3 style={styles.profileName}>{profile?.name || 'User'}</h3>
            <p style={styles.profileRole}>{profile?.personalInfo?.title || 'Developer'}</p>
          </div>
          {/* Crown icon REMOVED */}
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link 
            to="/dashboard" 
            style={isActive('/dashboard') ? styles.activeLink : styles.link} 
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faHome} style={styles.icon} /> Dashboard
          </Link>
          <Link 
            to="/profile" 
            style={isActive('/profile') ? styles.activeLink : styles.link} 
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faUser} style={styles.icon} /> Profile
          </Link>
          <Link 
            to="/skills" 
            style={isActive('/skills') ? styles.activeLink : styles.link} 
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faCogs} style={styles.icon} /> Skills
          </Link>
          <Link 
            to="/projects" 
            style={isActive('/projects') ? styles.activeLink : styles.link} 
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faFolderOpen} style={styles.icon} /> Projects
          </Link>
          <Link 
            to="/categories" 
            style={isActive('/categories') ? styles.activeLink : styles.link} 
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faTags} style={styles.icon} /> Categories
          </Link>
          <Link 
            to="/preview" 
            style={isActive('/preview') ? styles.activeLink : styles.link} 
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faEye} style={styles.icon} /> Preview
          </Link>
        </nav>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FontAwesomeIcon icon={faSignOutAlt} style={styles.icon} /> Logout
          </button>
          <p style={styles.creditText}>Intern @ Codiora House</p>
        </div>
      </div>
    </>
  );
}

const styles = {
  hamburger: {
    position: 'fixed',
    top: '15px',
    left: '15px',
    zIndex: 1001,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    padding: '14px 18px',
    borderRadius: '12px',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
  },
  sidebar: {
    width: '280px',
    height: '100vh',
    background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
    color: 'white',
    padding: '25px 20px',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 30px rgba(0,0,0,0.3)',
    zIndex: 1000,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '35px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    position: 'relative',
  },
  profileImage: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid rgba(102, 126, 234, 0.6)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  profilePlaceholder: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: 'white',
  },
  profileRole: {
    fontSize: '12px',
    color: '#a0aec0',
    margin: '2px 0 0 0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  link: {
    color: '#a0aec0',
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    fontSize: '14px',
    fontWeight: '500',
  },
  activeLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    fontSize: '14px',
    fontWeight: '500',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
  },
  icon: {
    width: '18px',
    fontSize: '16px',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  logoutBtn: {
    backgroundColor: 'rgba(229, 62, 62, 0.15)',
    color: '#fc8181',
    border: '1px solid rgba(229, 62, 62, 0.2)',
    padding: '12px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  creditText: {
    fontSize: '11px',
    color: '#4a5568',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default Sidebar;