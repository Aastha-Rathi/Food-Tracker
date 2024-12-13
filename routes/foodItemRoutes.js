const express = require('express');
const { addFoodItem, addFoodItemByBarcode, getFoodItems } = require('../controllers/foodController');
const protect = require('../middlewares/authMiddleware.js'); // Authentication middleware

const router = express.Router();

// Manual Entry of Food Item
router.post('/', protect, addFoodItem);

// Barcode Scanning
router.post('/barcode', protect, addFoodItemByBarcode);

// Get All Food Items for a User
router.get('/', protect, getFoodItems);

module.exports = router;
