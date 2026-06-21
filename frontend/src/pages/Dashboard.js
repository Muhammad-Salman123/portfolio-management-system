import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFolderOpen, faTags, faArrowRight, faClock, faRocket, faTrash } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [stats, setStats] = useState({
    totalSkills: 0,
    totalProjects: 0,
    categories: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  const token = localStorage.getItem('token');

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const fetchStats = async () => {
    try {
      const skillsRes = await axios.get('http://localhost:5000/api/skills', {
        headers: { 'x-auth-token': token }
      });

      const projectsRes = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });

      const activitiesRes = await axios.get('http://localhost:5000/api/activities', {
        headers: { 'x-auth-token': token }
      });

      const categoriesRes = await axios.get('http://localhost:5000/api/categories', {
        headers: { 'x-auth-token': token }
      });

      setStats({
        totalSkills: skillsRes.data.length,
        totalProjects: projectsRes.data.length,
        categories: categoriesRes.data.length
      });
      setActivities(activitiesRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  // Clear all activities
  const clearActivities = async () => {
    if (!window.confirm('Are you sure you want to clear all activities?')) return;
    try {
      await axios.delete('http://localhost:5000/api/activities/clear', {
        headers: { 'x-auth-token': token }
      });
      setActivities([]);
      alert('All activities cleared successfully!');
    } catch (err) {
      alert('Failed to clear activities');
    }
  };

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with Greeting */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {greeting} <span style={styles.wave}></span>
            <span style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </h1>
          <p style={styles.subtitle}>Welcome back! Here's your portfolio overview</p>
        </div>
        <div style={styles.headerBadge}>
          <FontAwesomeIcon icon={faRocket} style={styles.headerIcon} />
          <span>Portfolio</span>
        </div>
      </div>

      {/* Statistics Cards - Using className for responsive */}
      <div className="dashboard-cards">
        <div className="stat-card" style={{...styles.card, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div style={styles.cardIconWrapper}>
            <FontAwesomeIcon icon={faCode} style={styles.cardIcon} />
          </div>
          <div style={styles.cardContent}>
            <h3 style={styles.cardNumber}>{stats.totalSkills}</h3>
            <p style={styles.cardLabel}>Total Skills</p>
          </div>
        </div>

        <div className="stat-card" style={{...styles.card, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <div style={styles.cardIconWrapper}>
            <FontAwesomeIcon icon={faFolderOpen} style={styles.cardIcon} />
          </div>
          <div style={styles.cardContent}>
            <h3 style={styles.cardNumber}>{stats.totalProjects}</h3>
            <p style={styles.cardLabel}>Total Projects</p>
          </div>
        </div>

        <div className="stat-card" style={{...styles.card, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <div style={styles.cardIconWrapper}>
            <FontAwesomeIcon icon={faTags} style={styles.cardIcon} />
          </div>
          <div style={styles.cardContent}>
            <h3 style={styles.cardNumber}>{stats.categories}</h3>
            <p style={styles.cardLabel}>Categories</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="glass-card" style={styles.activitiesSection}>
        <div style={styles.activitiesHeader}>
          <h3 style={styles.activitiesTitle}>
            <FontAwesomeIcon icon={faClock} style={styles.activitiesIcon} /> Recent Activities
          </h3>
          {activities.length > 0 && (
            <button onClick={clearActivities} style={styles.clearBtn}>
              <FontAwesomeIcon icon={faTrash} style={styles.clearIcon} /> Clear All
            </button>
          )}
        </div>
        <div style={styles.activitiesList}>
          {activities.length === 0 ? (
            <p style={styles.noActivity}>No recent activities yet. Start adding skills and projects!</p>
          ) : (
            activities.slice(0, 5).map((activity, index) => (
              <div key={activity._id} style={{
                ...styles.activityItem,
                animationDelay: `${index * 0.1}s`
              }} className="fade-in-up">
                <div style={styles.activityContent}>
                  <span style={{
                    ...styles.activityAction,
                    color: activity.action.includes('Added') ? '#48bb78' : 
                           activity.action.includes('Deleted') ? '#fc8181' : '#667eea'
                  }}>
                    {activity.action}
                  </span>
                  <span style={styles.activityDetails}>{activity.details}</span>
                </div>
                <span style={styles.activityTime}>
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actions}>
        <div className="glass-card" style={styles.actionCard}>
          <div style={styles.actionIcon}></div>
          <h3 style={styles.actionTitle}>Skills</h3>
          <p style={styles.actionDesc}>Manage your professional skills</p>
          <Link to="/skills" style={styles.actionLink}>
            Explore Skills <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} />
          </Link>
        </div>
        <div className="glass-card" style={styles.actionCard}>
          <div style={styles.actionIcon}></div>
          <h3 style={styles.actionTitle}>Projects</h3>
          <p style={styles.actionDesc}>Manage your portfolio projects</p>
          <Link to="/projects" style={styles.actionLink}>
            Explore Projects <FontAwesomeIcon icon={faArrowRight} style={styles.arrowIcon} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Designed & Built with by <strong style={styles.footerName}>Muhammad Salman</strong>
        </p>
        <p style={styles.footerSub}>Intern at Codiora House (Private) Limited</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '20px',
    padding: '50px',
    color: '#667eea',
  },
  wave: {
    display: 'inline-block',
    animation: 'wave 2s infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '5px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  dateText: {
    fontSize: '14px',
    color: '#a0aec0',
    fontWeight: '400',
    display: 'block',
    marginTop: '2px',
    WebkitTextFillColor: '#a0aec0',
  },
  subtitle: {
    color: '#718096',
    fontSize: '16px',
  },
  headerBadge: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '10px 20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    border: '1px solid rgba(255,255,255,0.2)',
    fontWeight: '600',
    color: '#667eea',
  },
  headerIcon: {
    fontSize: '18px',
  },
  card: {
    padding: '20px 18px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: 'white',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '80px',
  },
  cardIconWrapper: {
    width: '50px',
    height: '50px',
    minWidth: '50px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  },
  cardIcon: {
    fontSize: '22px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: '0',
  },
  cardNumber: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    lineHeight: '1.2',
  },
  cardLabel: {
    fontSize: '13px',
    opacity: 0.9,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activitiesSection: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    marginBottom: '30px',
  },
  activitiesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  activitiesTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  activitiesIcon: {
    color: '#667eea',
  },
  clearBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  clearIcon: {
    fontSize: '12px',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.6)',
    transition: 'all 0.3s ease',
  },
  activityContent: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  activityAction: {
    fontWeight: '600',
  },
  activityDetails: {
    color: '#4a5568',
  },
  activityTime: {
    color: '#a0aec0',
    fontSize: '12px',
  },
  noActivity: {
    color: '#a0aec0',
    textAlign: 'center',
    padding: '20px',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px',
  },
  actionCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    padding: '25px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  actionIcon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '5px',
  },
  actionDesc: {
    color: '#718096',
    fontSize: '14px',
    marginBottom: '15px',
  },
  actionLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  arrowIcon: {
    fontSize: '14px',
    transition: 'transform 0.3s ease',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    marginTop: '10px',
  },
  footerText: {
    color: '#4a5568',
    fontSize: '14px',
    margin: 0,
  },
  footerName: {
    color: '#667eea',
  },
  footerSub: {
    color: '#a0aec0',
    fontSize: '12px',
    margin: '5px 0 0 0',
  }
};

export default Dashboard;