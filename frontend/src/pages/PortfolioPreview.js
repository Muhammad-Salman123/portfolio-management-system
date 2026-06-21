import { useState, useEffect } from 'react';
import axios from 'axios';

function PortfolioPreview() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const profileRes = await axios.get('http://localhost:5000/api/profile', {
        headers: { 'x-auth-token': token }
      });
      setProfile(profileRes.data);

      const skillsRes = await axios.get('http://localhost:5000/api/skills', {
        headers: { 'x-auth-token': token }
      });
      setSkills(skillsRes.data);

      const projectsRes = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(projectsRes.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  if (loading) {
    return <div style={styles.container}>Loading your portfolio...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>{profile?.name || 'My Portfolio'}</h1>
        <p style={styles.title}>{profile?.personalInfo?.title || 'Developer'}</p>
        <div style={styles.contact}>
          {profile?.contact?.email && <span> {profile.contact.email}</span>}
          {profile?.contact?.github && <a href={profile.contact.github} target="_blank" rel="noopener noreferrer"> GitHub</a>}
          {profile?.contact?.linkedin && <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
        </div>
      </div>

      {profile?.about?.introduction && (
        <div style={styles.section}>
          <h2>About Me</h2>
          <p>{profile.about.introduction}</p>
          {profile?.about?.bio && <p>{profile.about.bio}</p>}
        </div>
      )}

      <div style={styles.section}>
        <h2>Skills</h2>
        <div style={styles.skillsGrid}>
          {skills.map((skill) => (
            <div key={skill._id} style={styles.skillBadge}>
              {skill.name} 
              <span style={styles.skillLevel}>{skill.level}</span>
            </div>
          ))}
          {skills.length === 0 && <p>No skills added yet.</p>}
        </div>
      </div>

      <div style={styles.section}>
        <h2>Projects</h2>
        <div style={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project._id} style={styles.projectCard}>
              {project.image && (
                <img src={project.image} alt={project.title} style={styles.projectImage} />
              )}
              <div style={styles.projectInfo}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.category && (
                  <span style={styles.categoryBadge}>{project.category}</span>
                )}
                <div style={styles.projectLinks}>
                  {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p>No projects added yet.</p>}
        </div>
      </div>

      <div style={styles.footer}>
        <p>Built with using MERN Stack</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#f7fafc',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    padding: '40px 0',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '30px',
  },
  title: {
    fontSize: '20px',
    color: '#667eea',
    fontWeight: '600',
  },
  contact: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '15px',
    flexWrap: 'wrap',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  skillBadge: {
    backgroundColor: '#e9d8fd',
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  skillLevel: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '15px',
  },
  projectCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: 'white',
  },
  projectImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  projectInfo: {
    padding: '15px',
  },
  categoryBadge: {
    backgroundColor: '#4299e1',
    color: 'white',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    display: 'inline-block',
    marginBottom: '10px',
  },
  projectLinks: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#a0aec0',
    fontSize: '14px',
  }
};

export default PortfolioPreview;