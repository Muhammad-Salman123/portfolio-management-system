import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({
    personalInfo: { title: '', phone: '', location: '' },
    about: { introduction: '', bio: '' },
    contact: { email: '', phone: '', github: '', linkedin: '', twitter: '' },
    profileImage: ''  // ← ADDED for image
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  // Fetch profile
  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { 'x-auth-token': token }
      });
      console.log('Profile data:', res.data);
      
      const data = res.data || {};
      setProfile({
        personalInfo: {
          title: data.personalInfo?.title || '',
          phone: data.personalInfo?.phone || '',
          location: data.personalInfo?.location || ''
        },
        about: {
          introduction: data.about?.introduction || '',
          bio: data.about?.bio || ''
        },
        contact: {
          email: data.contact?.email || '',
          phone: data.contact?.phone || '',
          github: data.contact?.github || '',
          linkedin: data.contact?.linkedin || '',
          twitter: data.contact?.twitter || ''
        },
        profileImage: data.profileImage || ''  // ← ADDED
      });
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      window.location.href = '/login';
    }
  }, [token]);

  // Update profile
  const updateProfile = async () => {
    try {
      console.log('Sending update:', profile);
      const res = await axios.put('http://localhost:5000/api/profile',
        profile,
        { headers: { 'x-auth-token': token } }
      );
      console.log('Update response:', res.data);
      setProfile(res.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile');
    }
  };

  // Upload profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await axios.post('http://localhost:5000/api/profile/upload-image',
        formData,
        { 
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      setProfile({ ...profile, profileImage: res.data.imageUrl });
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image');
    }
  };

  // Remove profile image
  const removeImage = async () => {
    try {
      await axios.put('http://localhost:5000/api/profile',
        { profileImage: '' },
        { headers: { 'x-auth-token': token } }
      );
      setProfile({ ...profile, profileImage: '' });
      setMessage('Image removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Remove error:', err);
      alert('Failed to remove image');
    }
  };

  // Handle changes
  const handleChange = (section, field, value) => {
    setProfile({
      ...profile,
      [section]: {
        ...profile[section],
        [field]: value
      }
    });
  };

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  if (loading) {
    return <div style={styles.container}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Profile Management</h2>
      
      {message && <div style={styles.message}>{message}</div>}

      {/* Profile Image Upload - NEW */}
      <div style={styles.section}>
        <h3>Profile Image</h3>
        <div style={styles.form}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.fileInput}
          />
          {profile.profileImage && (
            <div>
              <img 
                src={profile.profileImage} 
                alt="Profile" 
                style={styles.profileImage} 
              />
              <button onClick={removeImage} style={styles.removeBtn}>
                Remove Image
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div style={styles.section}>
        <h3>Personal Information</h3>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Title (e.g., Full Stack Developer)"
            value={profile.personalInfo?.title || ''}
            onChange={(e) => handleChange('personalInfo', 'title', e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Phone"
            value={profile.personalInfo?.phone || ''}
            onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Location"
            value={profile.personalInfo?.location || ''}
            onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* About Section */}
      <div style={styles.section}>
        <h3>About Section</h3>
        <div style={styles.form}>
          <textarea
            placeholder="Introduction"
            value={profile.about?.introduction || ''}
            onChange={(e) => handleChange('about', 'introduction', e.target.value)}
            style={styles.textarea}
            rows="2"
          />
          <textarea
            placeholder="Bio"
            value={profile.about?.bio || ''}
            onChange={(e) => handleChange('about', 'bio', e.target.value)}
            style={styles.textarea}
            rows="4"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div style={styles.section}>
        <h3>Contact Information</h3>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Email"
            value={profile.contact?.email || ''}
            onChange={(e) => handleChange('contact', 'email', e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Phone"
            value={profile.contact?.phone || ''}
            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={profile.contact?.github || ''}
            onChange={(e) => handleChange('contact', 'github', e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={profile.contact?.linkedin || ''}
            onChange={(e) => handleChange('contact', 'linkedin', e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Twitter URL"
            value={profile.contact?.twitter || ''}
            onChange={(e) => handleChange('contact', 'twitter', e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      <button onClick={updateProfile} style={styles.button}>
        Save Profile
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '50px auto',
    padding: '20px',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
  },
  fileInput: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginTop: '10px',
    border: '3px solid #007bff',
  },
  removeBtn: {
    padding: '8px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '10px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
  },
  message: {
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center',
  }
};

export default Profile;