const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// Forgot password handler
const forgotpassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error('There is no user with that email');
      error.statusCode = 404;
      return next(error);
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/resetpassword?token=${resetToken}`;
    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: 'Password change request received',
      message: message
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to email!'
    });
  } catch (err) {
    next(err);
  }
};

// Reset password handler
const resetpassword = async (req, res, next) => {
  try {
    console.log('Reset password endpoint hit');
    console.log('Req body:', req.body);
    console.log('Req query:', req.query);
    console.log('Req params:', req.params);

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log('Hashed token:', hashedToken);

    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
    console.log('User found:', user);

    if (!user) {
      const error = new Error('Token is invalid or has expired');
      error.statusCode = 400;
      console.log('Error:', error);
      return next(error);
    }

    const { password, confirmPassword } = req.body;
    console.log('Password and confirm password:', password, confirmPassword);

    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match');
      error.statusCode = 400;
      console.log('Error:', error);
      return next(error);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword);

    user.password = hashedPassword;
    user.confirmPassword = confirmPassword;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    console.log('User updated:', user);

    const newToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    console.log('New token:', newToken);

    res.json({ message: 'Password reset successful', user, token: newToken });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { forgotpassword, resetpassword }