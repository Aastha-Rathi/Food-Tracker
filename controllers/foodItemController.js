// // const axios = require('axios');
// const FoodItem = require('../models/FoodItem');
// const Notification = require('../models/Notification');
// const moment = require('moment');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');

// // Manual Entry of Food Item
// exports.addFoodItem = async (req, res) => {
//   const { name, category, manufacturingDate, expiryDate } = req.body;

//   try {
//     const newFoodItem = new FoodItem({
//       name,
//       category,
//       manufacturingDate,
//       expiryDate,
//       username: req.user.username,
//       userId: req.user._id,
//     });
//     await newFoodItem.save();
//     res.status(201).json(newFoodItem);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating food item', error });
//   }
// };


// // Barcode Scanning
// // exports.addFoodItemByBarcode = async (req, res) => {
// //   const { barcode } = req.body;

// //   if (!barcode) {
// //     return res.status(400).json({ message: 'Barcode is required' });
// //   }

// //   try {
// //     const response = await axios.get(`https://api.eandb.com/v1/lookup/${barcode}`, {
// //       headers: {
// //         Authorization: `Bearer ${process.env.BARCODE_API_KEY}`, // Replace with your actual API key
// //       },
// //     });

// //     const { name, category, manufacturingDate, expiryDate } = response.data; // Assuming API returns these fields

// //     const newFoodItem = new FoodItem({
// //       name,
// //       category,
// //       manufacturingDate,
// //       expiryDate,
// //       userId: req.user,
// //     });
// //     await newFoodItem.save();

// //     res.status(201).json(newFoodItem);
// //   } catch (error) {
// //     console.error('Error fetching barcode data:', error);
// //     res.status(500).json({ message: 'Error scanning barcode or fetching product data', error });
// //   }
// // };

// // Get All Food Items for a User
// // Get All Food Items for All Users
// exports.getFoodItems = async (req, res) => {
//   try {
//     // Fetch all food items without filtering by userId
//     const foodItems = await FoodItem.find().sort({ expiryDate: 1 }); // Sort by expiration date

//     if (!foodItems || foodItems.length === 0) {
//       return res.status(404).json({ message: 'No food items found' });
//     }

//     res.status(200).json(foodItems);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching food items', error });
//   }
// };


// // Get Food Items by userId
// exports.getFoodItemsByUserId = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const foodItems = await FoodItem.find({ userId }).sort({ expiryDate: 1 });

//     if (!foodItems || foodItems.length === 0) {
//       return res.status(404).json({ message: 'No food items found for this user' });
//     }

//     res.status(200).json(foodItems);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching food items', error });
//   }
// };



// // Notification

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // You can use any email service you prefer
//   auth: {
//     user: process.env.EMAIL_USER, // Your email address
//     pass: process.env.EMAIL_PASS, // Your email password or app-specific password
//   },
// });

// // Function to send email notifications
// const sendEmailNotification = async (userEmail, message) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: userEmail,
//     subject: 'Food Item Expiry Alert',
//     text: message,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// // Function to check and notify users about expiring food items
// exports.checkExpiringFoodItems = async (req, res) => {
//   try {
//     // Get the current date and date 7 days ahead
//     const currentDate = new Date();
//     const thresholdDate = new Date();
//     thresholdDate.setDate(currentDate.getDate() + 7);

//     // Find all food items that are expiring within 7 days
//     const expiringFoodItems = await FoodItem.find({
//       expiryDate: { $lte: thresholdDate },
//     }).populate('userId', 'username'); // Populate only the 'username' field

//     if (!expiringFoodItems || expiringFoodItems.length === 0) {
//       return res.status(404).json({ message: 'No food items are expiring soon' });
//     }

//     // Loop through each expiring food item and send a notification to the user
//     for (let foodItem of expiringFoodItems) {
//       const user = foodItem.userId; // Get the user from the populated field
//       const notificationMessage = `Your food item '${foodItem.name}' is about to expire on ${foodItem.expiryDate.toDateString()}. Please use it soon.`;

//       // Create a notification document for each expiring item
//       const notification = new Notification({
//         userId: user._id,
//         message: notificationMessage,
//         // foodItemId: foodItem._id, // Link the notification to the food item
//       });

//       await notification.save();
//     }

//     res.status(200).json({ message: 'Notifications sent for expiring food items' });

//   } catch (error) {
//     console.error('Error checking expiring food items:', error);
//     res.status(500).json({ message: 'Error checking expiring food items', error });
//   }
// };

const FoodItem = require('../models/FoodItem');
const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
const User = require('../models/User');
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

// Get All Food Items for All Users
exports.getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().sort({ expiryDate: 1 });

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

// Email sending setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send email notifications
const sendEmailNotification = async (userEmail, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Food Item Expiry Alert',
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Function to check and notify users about expiring food items
exports.checkExpiringFoodItems = async (req, res) => {
  try {
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(currentDate.getDate() + 7);

    // Find all food items that are expiring within 7 days
    const expiringFoodItems = await FoodItem.find({
      expiryDate: { $lte: thresholdDate },
    }).populate('userId', 'username email'); // Populate 'username' and 'email'

    if (!expiringFoodItems || expiringFoodItems.length === 0) {
      return res.status(404).json({ message: 'No food items are expiring soon' });
    }

    // Loop through each expiring food item and send a notification to the user
    for (let foodItem of expiringFoodItems) {
      const user = foodItem.userId; // Get the user from the populated field
      const notificationMessage = `Your food item '${foodItem.name}' is about to expire on ${foodItem.expiryDate.toDateString()}. Please use it soon.`;

      // Check if user email exists
      if (user.email) {
        // Send email notification
        await sendEmailNotification(user.email, notificationMessage);
      } else {
        console.error(`No email found for user: ${user.username}`);
      }

      // Create a notification document for each expiring item
      const notification = new Notification({
        userId: user._id,
        message: notificationMessage,
        foodItemId: foodItem._id, // Link the notification to the food item
      });

      await notification.save();
    }

    res.status(200).json({ message: 'Notifications sent for expiring food items' });

  } catch (error) {
    console.error('Error checking expiring food items:', error);
    res.status(500).json({ message: 'Error checking expiring food items', error });
  }
};
