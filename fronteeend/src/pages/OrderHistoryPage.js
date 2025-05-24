import React from 'react';
import OrderHistory from '../components/User/OrderHistory';
import { Navigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return <OrderHistory />;
};

export default OrderHistoryPage;