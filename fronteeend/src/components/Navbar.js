import React from 'react';
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">E-Waste Marketplace</Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/create-item">Add Item</Link>
              <Link to="/orders">Order History</Link>
              <Link to="/profile">Profile</Link>
              <span>{user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;