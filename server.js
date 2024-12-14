const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const cors = require('cors');
const path = require("path");
const { multerErrorHandler } = require("./utils/multer");
const bodyParser = require('body-parser');
const cron = require('node-cron');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const forgotpasswordRoutes = require('./routes/forgotpasswordRoutes');
const imageRoutes = require('./routes/imageRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');


const app = express();

// Connect to MongoDB
connectDB();


// For Frontend Connectivity
// const corsOptions = {
//   origin: 'http://localhost:3000', // specify your frontend's URL
//   credentials: true,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions));

// app.use(bodyParser.json());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled task to check for expiring food items..');
  foodItemController.checkExpiringFoodItems();
});


// endpoints
app.use('/api/auth', authRoutes);
app.use('/api', forgotpasswordRoutes);
app.use('/api/images', imageRoutes);
app.use('/api', foodItemRoutes);


app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});


app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to your express application'
  });   
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});