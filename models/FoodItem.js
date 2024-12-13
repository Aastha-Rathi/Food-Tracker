const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['fruits', 'dairy', 'veggies', 'meat', 'others'], // Adjust categories as needed
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This is to link the food item to a specific user
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
