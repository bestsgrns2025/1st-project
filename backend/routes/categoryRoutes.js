const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name } = req.body;

  try {
    let category = await Category.findOne({ name });

    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    category = new Category({
      name
    });

    await category.save();

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;

  const categoryFields = {};
  if (name) categoryFields.name = name;

  try {
    let category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ msg: 'Category not found' });

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ msg: 'Category not found' });

    await Category.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
