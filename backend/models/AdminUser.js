const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
AdminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
AdminUserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('Entered password:', enteredPassword); // Added for debugging
  console.log('Stored password hash:', this.password); // Added for debugging
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log('Password match result:', isMatch); // Added for debugging
  return isMatch;
};

module.exports = mongoose.model('AdminUser', AdminUserSchema);
