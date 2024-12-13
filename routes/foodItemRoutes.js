const express = require('express');
const { getFoodItemsByUserId, addFoodItem, addFoodItemByBarcode, getFoodItems, checkExpiringFoodItems } = require('../controllers/foodItemController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');

const router = express.Router();

// Manual Entry of Food Item
router.post('/add-food-items', isAuthenticated, addFoodItem);

// Barcode Scanning
// router.post('/barcode', protect, addFoodItemByBarcode);

// Get All Food Items for a User
router.get('/get-food-items', getFoodItems);

// Get Food Items by userId
router.get('/get-food-items/:userId', getFoodItemsByUserId);

// Manually trigger the expiry check for testing
router.get('/check-expiring-food-items', checkExpiringFoodItems);

// Get notifications for a user
router.get('/notifications/:userId', async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.params.userId });
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found for this user' });
      }
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  });

module.exports = router;
