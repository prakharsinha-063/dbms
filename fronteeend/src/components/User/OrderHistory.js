import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>{order.item.productName}</h3>
              <p>Price: ${order.item.price}</p>
              <p>Purchased: {new Date(order.purchaseDate).toLocaleDateString()}</p>
              <p>Seller: {order.item.seller.name}</p>
              <Link to={`/item/${order.item._id}`}>View Item</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;