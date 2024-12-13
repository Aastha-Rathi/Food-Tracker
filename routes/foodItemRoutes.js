const express = require('express');
const { getFoodItemsByUserId, addFoodItem, addFoodItemByBarcode, getFoodItems } = require('../controllers/foodItemController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

// Manual Entry of Food Item
router.post('/add-food-items', isAuthenticated, addFoodItem);

// Barcode Scanning
// router.post('/barcode', protect, addFoodItemByBarcode);

// Get All Food Items for a User
router.get('/get-food-items', getFoodItems);

// Get Food Items by userId
router.get('/get-food-items/:userId', getFoodItemsByUserId);

module.exports = router;
