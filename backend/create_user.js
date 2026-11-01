const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const createUser = async () => {
  try {
    await connectDB();
    const userExists = await User.findOne({ email: 'test@example.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Test user created!');
    } else {
      console.log('Test user already exists.');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createUser();
