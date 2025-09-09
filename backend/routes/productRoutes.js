const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Image = require('../models/Image'); // To populate image details

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('image'); // Populate image details
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (e.g., admin only) - For simplicity, no auth implemented yet
router.post('/', async (req, res) => {
  const { description, type, price, imageId } = req.body;

  try {
    const newProduct = new Product({
      description,
      type,
      price,
      image: imageId // Expects an Image ObjectId
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add PUT and DELETE routes if needed, similar to projectRoutes.js

module.exports = router;