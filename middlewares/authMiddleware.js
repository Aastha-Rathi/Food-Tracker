const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.isAuthenticated = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '').trim();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token, failed to decode' });
    }

    // Find user by decoded token ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user ID to request object
    req.user = { _id: user._id, username: user.username };
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};
