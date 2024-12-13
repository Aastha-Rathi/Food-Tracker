// const axios = require('axios');
const FoodItem = require('../models/FoodItem');
const Notification = require('../models/Notification');
const moment = require('moment');

// Manual Entry of Food Item
exports.addFoodItem = async (req, res) => {
  const { name, category, manufacturingDate, expiryDate } = req.body;

  try {
    const newFoodItem = new FoodItem({
      name,
      category,
      manufacturingDate,
      expiryDate,
      username: req.user.username,
      userId: req.user._id,
    });
    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating food item', error });
  }
};


// Barcode Scanning
// exports.addFoodItemByBarcode = async (req, res) => {
//   const { barcode } = req.body;

//   if (!barcode) {
//     return res.status(400).json({ message: 'Barcode is required' });
//   }

//   try {
//     const response = await axios.get(`https://api.eandb.com/v1/lookup/${barcode}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.BARCODE_API_KEY}`, // Replace with your actual API key
//       },
//     });

//     const { name, category, manufacturingDate, expiryDate } = response.data; // Assuming API returns these fields

//     const newFoodItem = new FoodItem({
//       name,
//       category,
//       manufacturingDate,
//       expiryDate,
//       userId: req.user,
//     });
//     await newFoodItem.save();

//     res.status(201).json(newFoodItem);
//   } catch (error) {
//     console.error('Error fetching barcode data:', error);
//     res.status(500).json({ message: 'Error scanning barcode or fetching product data', error });
//   }
// };

// Get All Food Items for a User
// Get All Food Items for All Users
exports.getFoodItems = async (req, res) => {
  try {
    // Fetch all food items without filtering by userId
    const foodItems = await FoodItem.find().sort({ expiryDate: 1 }); // Sort by expiration date

    if (!foodItems || foodItems.length === 0) {
      return res.status(404).json({ message: 'No food items found' });
    }

    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food items', error });
  }
};


// Get Food Items by userId
exports.getFoodItemsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const foodItems = await FoodItem.find({ userId }).sort({ expiryDate: 1 });

    if (!foodItems || foodItems.length === 0) {
      return res.status(404).json({ message: 'No food items found for this user' });
    }

    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food items', error });
  }
};
