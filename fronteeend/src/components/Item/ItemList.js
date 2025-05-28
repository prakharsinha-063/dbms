import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ItemList.css'

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (category) params.append('category', category);

      const response = await axios.get(`http://localhost:5000/api/items?${params.toString()}`);
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  const handleBuyNow = async (itemId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/orders', { itemId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/item/${itemId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process purchase');
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, location, minPrice, maxPrice, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="item-list-container">
      <h2>E-Waste Items</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="search-group">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Batteries">Batteries</option>
            <option value="Appliances">Appliances</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
      <div className="item-grid">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <img src={item.imageLink} alt={item.productName} />
            <h3>{item.productName}</h3>
            <p>Price: ${item.price}</p>
            <p>Location: {item.location}</p>
            <p>Category: {item.category}</p>
            <Link to={`/item/${item._id}`}>View Details</Link>
            <button onClick={() => handleBuyNow(item._id)} className="buy-now">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;