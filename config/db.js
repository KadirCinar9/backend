const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // No need for useNewUrlParser or useUnifiedTopology
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message); // Use error.message for clearer output
    process.exit(1);
  }
};

module.exports = connectDB;
