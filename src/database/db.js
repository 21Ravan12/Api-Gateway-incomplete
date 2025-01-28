const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/Library-db';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Hata olursa uygulamayı durdur
  }
};

module.exports = connectDB;
