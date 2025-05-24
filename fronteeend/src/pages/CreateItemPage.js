import React from 'react';
import ItemForm from '../components/Item/ItemForm';
import { Navigate } from 'react-router-dom';

const CreateItemPage = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  return <ItemForm />;
};

export default CreateItemPage;