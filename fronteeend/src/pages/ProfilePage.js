import React from 'react';
import Profile from '../components/User/Profile';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return <Profile />;
};

export default ProfilePage;