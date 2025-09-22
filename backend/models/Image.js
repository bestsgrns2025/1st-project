const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);