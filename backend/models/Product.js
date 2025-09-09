const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);