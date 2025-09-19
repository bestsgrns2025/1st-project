const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Content', ContentSchema);
