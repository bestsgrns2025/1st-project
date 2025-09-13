const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const ProjectInquiry = require('../models/ProjectInquiry');

// Middleware to protect routes
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id; // Assuming the JWT payload contains the user ID
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
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password }); // Added for debugging
  console.log('Searching for user with query:', { username }); // Added for debugging

  try {
    const user = await AdminUser.findOne({ username });
    console.log('User found:', user); // Added for debugging

    if (user) {
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch); // Added for debugging

      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
  const { username, password } = req.body;

  try {
    let user = await AdminUser.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    user = new AdminUser({
      username,
      password,
    });

    await user.save();

    res.status(201).json({ message: 'Admin user registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
