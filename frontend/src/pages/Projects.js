import { useState, useEffect } from 'react';
import axios from 'axios';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const token = localStorage.getItem('token');

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      alert('Failed to fetch projects');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Filter and search projects
  const getFilteredProjects = () => {
    let filtered = projects;
    
    if (filterCategory !== 'All') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  // Add project
  const addProject = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('githubLink', githubLink);
      formData.append('liveLink', liveLink);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      const res = await axios.post('http://localhost:5000/api/projects',
        formData,
        { 
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      setProjects([...projects, res.data]);
      setTitle('');
      setDescription('');
      setGithubLink('');
      setLiveLink('');
      setCategory('Web Development');
      setImage(null);
      setImagePreview('');
    } catch (err) {
      alert('Failed to add project');
    }
  };

  // Update project
  const updateProject = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('githubLink', githubLink);
      formData.append('liveLink', liveLink);
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      const res = await axios.put(`http://localhost:5000/api/projects/${editingId}`,
        formData,
        { 
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      setProjects(projects.map(p => p._id === editingId ? res.data : p));
      setEditingId(null);
      setTitle('');
      setDescription('');
      setGithubLink('');
      setLiveLink('');
      setCategory('Web Development');
      setImage(null);
      setImagePreview('');
    } catch (err) {
      alert('Failed to update project');
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  // Start editing
  const startEdit = (project) => {
    setEditingId(project._id);
    setTitle(project.title);
    setDescription(project.description || '');
    setGithubLink(project.githubLink || '');
    setLiveLink(project.liveLink || '');
    setCategory(project.category || 'Web Development');
    setImagePreview(project.image || '');
    setImage(null);
  };

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Projects Management</h2>
      
      {/* Search and Filter */}
      <div style={styles.searchFilter}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Data Analysis">Data Analysis</option>
        </select>
      </div>
      
      {/* Add/Edit Form */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="GitHub Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Live Link"
          value={liveLink}
          onChange={(e) => setLiveLink(e.target.value)}
          style={styles.input}
        />
        
        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          <option value="Web Development">Web Development</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Data Analysis">Data Analysis</option>
        </select>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        {imagePreview && (
          <div style={styles.imagePreviewContainer}>
            <img src={imagePreview} alt="Project preview" style={styles.imagePreview} />
            <button onClick={() => { setImage(null); setImagePreview(''); }} style={styles.removeImageBtn}>
              Remove Image
            </button>
          </div>
        )}

        {editingId ? (
          <button onClick={updateProject} style={styles.updateBtn}>Update</button>
        ) : (
          <button onClick={addProject} style={styles.addBtn}>Add</button>
        )}
      </div>

      {/* Projects List */}
      <div style={styles.list}>
        {filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <div key={project._id} style={styles.card}>
              <div style={styles.cardContent}>
                {project.image && (
                  <img src={project.image} alt={project.title} style={styles.projectImage} />
                )}
                <div>
                  <strong>{project.title}</strong>
                  {project.category && (
                    <span style={styles.categoryBadge}>{project.category}</span>
                  )}
                  {project.description && <p>{project.description}</p>}
                  <div style={styles.links}>
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live</a>}
                  </div>
                </div>
              </div>
              <div>
                <button onClick={() => startEdit(project)} style={styles.editBtn}>Edit</button>
                <button onClick={() => deleteProject(project._id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '50px auto',
    padding: '20px',
  },
  searchFilter: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '200px',
  },
  filterSelect: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '180px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  fileInput: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
  imagePreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  imagePreview: {
    maxWidth: '200px',
    maxHeight: '150px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '2px solid #ddd',
  },
  removeImageBtn: {
    padding: '5px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addBtn: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  updateBtn: {
    padding: '10px',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  list: {
    marginTop: '20px',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  projectImage: {
    width: '100px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  categoryBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    marginLeft: '10px',
  },
  links: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
  },
  editBtn: {
    marginRight: '10px',
    padding: '5px 15px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '5px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default Projects;