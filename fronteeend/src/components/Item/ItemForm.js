
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ItemForm.css'

const ItemForm = () => {
  const [formData, setFormData] = useState({
    productName: '',
    sellerDescription: '',
    price: '',
    imageLink: '',
    location: '',
    contactDetails: '',
    category: 'Electronics',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? (value ? parseFloat(value) : '') : value,
    });
  };

  const validateForm = () => {
    if (!formData.productName.trim()) return 'Product name is required';
    if (!formData.sellerDescription.trim()) return 'Description is required';
    if (formData.price === '' || isNaN(formData.price) || formData.price < 0) return 'Price must be a positive number';
    try {
      new URL(formData.imageLink); // Validates any URL
      if (!formData.imageLink.startsWith('http://') && !formData.imageLink.startsWith('https://')) {
        return 'Image URL must start with http:// or https://';
      }
    } catch {
      return 'Valid image URL is required';
    }
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.contactDetails.trim()) return 'Contact details are required';
    if (!['Electronics', 'Batteries', 'Appliances', 'Other'].includes(formData.category)) return 'Invalid category';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add an item');
        navigate('/login');
        return;
      }

      console.log('Submitting formData:', formData); // Debug payload
      console.log('Token:', token); // Debug token

      const response = await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Item created:', response.data); // Debug success
      navigate('/');
    } catch (err) {
      console.error('Error response:', err.response?.data); // Debug error
      const errorMsg = err.response?.data?.errors?.map(e => e.msg).join(', ') ||
                       err.response?.data?.message ||
                       err.message ||
                       'Failed to create item';
      setError(errorMsg);
    }
  };

  return (
    <div className="item-form-container">
      <h2>Add E-Waste Item</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            placeholder="e.g., Used Smartphone"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="sellerDescription"
            value={formData.sellerDescription}
            onChange={handleChange}
            required
            placeholder="e.g., Good condition, minor scratches"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="e.g., 50.00"
          />
        </div>
        <div className="form-group">
          <label>Image Link</label>
          <input
            type="text"
            name="imageLink"
            value={formData.imageLink}
            onChange={handleChange}
            required
            placeholder="e.g., https://example.com/image"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., Mumbai"
          />
        </div>
        <div className="form-group">
          <label>Contact Details</label>
          <input
            type="text"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleChange}
            required
            placeholder="e.g., 9876543210"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Electronics">Electronics</option>
            <option value="Batteries">Batteries</option>
            <option value="Appliances">Appliances</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
