mkdir -p backend/models backend/controllers backend/routes backend/middleware backend/config

cat << 'INNER_EOF' > backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
INNER_EOF

cat << 'INNER_EOF' > backend/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  salary: String,
  salaryMin: Number,
  salaryMax: Number,
  skills: [String],
  experience: String,
  experienceLevel: String,
  postedDate: String,
  logo: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
INNER_EOF

cat << 'INNER_EOF' > backend/models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'Applied' },
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
INNER_EOF

cat << 'INNER_EOF' > backend/models/SavedJob.js
const mongoose = require('mongoose');

const SavedJobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
}, { timestamps: true });

module.exports = mongoose.model('SavedJob', SavedJobSchema);
INNER_EOF

cat << 'INNER_EOF' > backend/config/db.js
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
INNER_EOF

cat << 'INNER_EOF' > backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hiresphere
JWT_SECRET=supersecretjwt
INNER_EOF

cat << 'INNER_EOF' > backend/.env.example
PORT=5000
MONGO_URI=mongodb://localhost:27017/hiresphere
JWT_SECRET=supersecretjwt
INNER_EOF

