const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    
    const user = await User.findById(decoded.id);
    

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send('Please authenticate');
  }
};