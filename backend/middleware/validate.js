
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('No Authorization header'); // Debug
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('Malformed Authorization header'); // Debug
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your-jwt-secret'); // Replace with your secret
    console.log('Decoded token:', decoded); // Debug
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Debug
    res.status(401).json({ message: 'Invalid token' });
  }
};
