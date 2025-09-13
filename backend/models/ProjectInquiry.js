const mongoose = require('mongoose');

const ProjectInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  service: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
  },
  timeline: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('ProjectInquiry', ProjectInquirySchema);
