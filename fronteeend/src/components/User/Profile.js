
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch current user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view profile');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          password: '',
        });
      } catch (err) {
        console.error('Fetch user error:', err.response?.data);
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) return 'Valid email is required';
    if (formData.password && formData.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to update profile');
        navigate('/login');
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) payload.password = formData.password;

      console.log('Submitting profileFormData:', payload); // Debug payload
      console.log('Token:', token); // Debug token

      const response = await axios.put('http://localhost:5000/api/users/profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile updated:', response.data); // Debug success
      setSuccess('Profile updated successfully');
      setFormData({ ...formData, password: '' }); // Clear password
    } catch (err) {
      console.error('Error response:', err.response?.data); // Debug error
      const errorMsg = err.response?.data?.errors?.map(e => e.msg).join(', ') ||
                       err.response?.data?.message ||
                       err.message ||
                       'Failed to update profile';
      setError(errorMsg);
    }
  };

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="e.g., john@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password (leave blank to keep unchanged)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
