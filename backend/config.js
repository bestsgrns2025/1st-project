module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwtkey' // Add a default secret for development
};