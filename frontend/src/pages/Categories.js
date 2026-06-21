import { useState, useEffect } from 'react';
import axios from 'axios';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories', {
        headers: { 'x-auth-token': token }
      });
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      alert('Failed to fetch categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const addCategory = async () => {
    if (!name.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/categories',
        { name, description },
        { headers: { 'x-auth-token': token } }
      );
      setCategories([...categories, res.data]);
      setName('');
      setDescription('');
    } catch (err) {
      alert('Failed to add category');
    }
  };

  // Update category
  const updateCategory = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/categories/${editingId}`,
        { name, description },
        { headers: { 'x-auth-token': token } }
      );
      setCategories(categories.map(c => c._id === editingId ? res.data : c));
      setEditingId(null);
      setName('');
      setDescription('');
    } catch (err) {
      alert('Failed to update category');
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  // Start editing
  const startEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || '');
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
      <h2>Categories Management</h2>
      
      {/* Add/Edit Form */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        {editingId ? (
          <button onClick={updateCategory} style={styles.updateBtn}>Update Category</button>
        ) : (
          <button onClick={addCategory} style={styles.addBtn}>Add Category</button>
        )}
      </div>

      {/* Categories List */}
      <div style={styles.list}>
        {categories.length === 0 ? (
          <p>No categories added yet.</p>
        ) : (
          categories.map((category) => (
            <div key={category._id} style={styles.card}>
              <div>
                <strong>{category.name}</strong>
                {category.description && <p style={styles.desc}>{category.description}</p>}
              </div>
              <div>
                <button onClick={() => startEdit(category)} style={styles.editBtn}>Edit</button>
                <button onClick={() => deleteCategory(category._id)} style={styles.deleteBtn}>Delete</button>
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
  desc: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '14px',
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

export default Categories;