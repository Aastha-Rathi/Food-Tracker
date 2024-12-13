const express = require('express');
const router = express.Router();
const { forgotpassword, resetpassword } = require('../controllers/forgotpasswordController');

// Route for handling forgot password request
router.post('/forgotpassword', forgotpassword);

// Route for handling password reset
router.patch('/resetpassword/:token', resetpassword);

module.exports = router;