const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const verify = async () => {
  await connectDB();
  const user = await User.findOne({ email: 'test@example.com' });
  console.log('User password in DB:', user.password);
  process.exit(0);
};
verify();
