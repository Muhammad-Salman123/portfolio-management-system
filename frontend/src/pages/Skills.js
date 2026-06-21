import { useState, useEffect } from 'react';
import axios from 'axios';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch all skills
  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/skills', {
        headers: { 'x-auth-token': token }
      });
      setSkills(res.data);
      setLoading(false);
    } catch (err) {
      alert('Failed to fetch skills');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add skill
  const addSkill = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/skills',
        { name, level },
        { headers: { 'x-auth-token': token } }
      );
      setSkills([...skills, res.data]);
      setName('');
      setLevel('Intermediate');
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  // Update skill
  const updateSkill = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/skills/${editingId}`,
        { name, level },
        { headers: { 'x-auth-token': token } }
      );
      setSkills(skills.map(s => s._id === editingId ? res.data : s));
      setEditingId(null);
      setName('');
      setLevel('Intermediate');
    } catch (err) {
      alert('Failed to update skill');
    }
  };

  // Delete skill
  const deleteSkill = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setSkills(skills.filter(s => s._id !== id));
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  // Start editing
  const startEdit = (skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setLevel(skill.level);
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
      <h2>Skills Management</h2>
      
      {/* Add/Edit Form */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={styles.select}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
          <option>Expert</option>
        </select>
        {editingId ? (
          <button onClick={updateSkill} style={styles.updateBtn}>Update</button>
        ) : (
          <button onClick={addSkill} style={styles.addBtn}>Add</button>
        )}
      </div>

      {/* Skills List */}
      <div style={styles.list}>
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          skills.map((skill) => (
            <div key={skill._id} style={styles.card}>
              <div>
                <strong>{skill.name}</strong> - {skill.level}
              </div>
              <div>
                <button onClick={() => startEdit(skill)} style={styles.editBtn}>Edit</button>
                <button onClick={() => deleteSkill(skill._id)} style={styles.deleteBtn}>Delete</button>
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
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '150px',
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  addBtn: {
    padding: '8px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  updateBtn: {
    padding: '8px 20px',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  list: {
    marginTop: '20px',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
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

export default Skills;