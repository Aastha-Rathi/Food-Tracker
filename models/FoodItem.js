const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['fruits', 'dairy', 'veggies', 'meat', 'others'], 
    required: true,
  },
  manufacturingDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  username: { 
    type: String, 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);

