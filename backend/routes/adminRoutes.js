const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const AdminUser = require('../models/AdminUser');
const ProjectInquiry = require('../models/ProjectInquiry');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to protect routes
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role }; // Include role in req.user
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // Added for debugging
  console.log('Searching for user with query:', { email }); // Added for debugging

  try {
    const user = await AdminUser.findOne({ email });
    console.log('User found:', user); // Added for debugging

    if (user) {
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch); // Added for debugging

      if (isMatch) {
        // Update lastLogin timestamp
        user.lastLogin = Date.now();
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
      }
    }

    // If user is not found or password doesn't match
    res.status(401).json({ message: 'Invalid credentials' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/admin/inquiries
// @desc    Get all project inquiries
// @access  Private (Admin only)
router.get('/inquiries', protect, async (req, res) => {
  try {
    const inquiries = await ProjectInquiry.find({});
    res.json(inquiries);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/admin/register
// @desc    Register a new admin user
// @access  Public (should be restricted in production)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await AdminUser.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    user = new AdminUser({
      email,
      password,
    });

    await user.save();

    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/admin/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL); // Temporary log for debugging
  console.log('--- ADMIN ROUTES FILE LOADED ---');

  try {
    const user = await AdminUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please make a PUT request to: \n\n ${resetUrl}
      This token is valid for 10 minutes.
    `;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Token',
        text: message,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error(err.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ message: 'Email could not be sent', error: err.message });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/admin/reset-password/:token
// @desc    Reset password
// @access  Public
router.put('/reset-password/:token', async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  try {
    const user = await AdminUser.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Token or Token Expired' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Middleware for role-based authorization
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized to access this route' });
  }
  next();
};

// @route   GET /api/admin/users
// @desc    Get all admin users
// @access  Private (Superadmin only)
router.get('/users', protect, authorize('superadmin'), async (req, res) => {
  try {
    const users = await AdminUser.find({}).select('-password'); // Exclude password
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;