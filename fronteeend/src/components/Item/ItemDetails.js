import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Failed to fetch item');
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="item-details-container">
      <h2>{item.productName}</h2>
      <img src={item.imageLink} alt={item.productName} />
      <p><strong>Description:</strong> {item.sellerDescription}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Seller:</strong> {item.seller.name}</p>
      <p><strong>Contact:</strong> {item.contactDetails}</p>
      <button onClick={() => alert(`Contact seller at: ${item.contactDetails}`)}>
        Contact Seller
      </button>
    </div>
  );
};

export default ItemDetails;