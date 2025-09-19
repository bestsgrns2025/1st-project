const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// @route   GET /api/content
// @desc    Get all content items
// @access  Public (can be restricted later)
router.get('/', async (req, res) => {
  try {
    const content = await Content.find({});
    res.json(content);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/content
// @desc    Update a content item
// @access  Private (Admin only)
router.put('/', async (req, res) => {
  const { key, value } = req.body;

  try {
    let contentItem = await Content.findOne({ key });

    if (!contentItem) {
      // If content item doesn't exist, create it
      contentItem = new Content({
        key,
        value,
      });
      await contentItem.save();
      return res.json({ message: 'Content item created and updated', contentItem });
    }

    contentItem.value = value;
    await contentItem.save();
    res.json({ message: 'Content item updated', contentItem });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
