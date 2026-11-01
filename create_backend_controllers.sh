cat << 'INNER_EOF' > backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
module.exports = { protect };
INNER_EOF

cat << 'INNER_EOF' > backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

module.exports = { registerUser, loginUser };
INNER_EOF

cat << 'INNER_EOF' > backend/controllers/jobController.js
const Job = require('../models/Job');

const getJobs = async (req, res) => {
  const jobs = await Job.find({});
  res.json(jobs);
};

const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

module.exports = { getJobs, getJobById };
INNER_EOF

cat << 'INNER_EOF' > backend/controllers/applicationController.js
const Application = require('../models/Application');

const applyJob = async (req, res) => {
  const { jobId } = req.body;
  const applicationExists = await Application.findOne({ user: req.user._id, job: jobId });
  if (applicationExists) return res.status(400).json({ message: 'Already applied' });
  
  const application = new Application({ user: req.user._id, job: jobId });
  await application.save();
  res.status(201).json(application);
};

const getApplications = async (req, res) => {
  const applications = await Application.find({ user: req.user._id }).populate('job');
  res.json(applications);
};

module.exports = { applyJob, getApplications };
INNER_EOF

cat << 'INNER_EOF' > backend/controllers/savedJobController.js
const SavedJob = require('../models/SavedJob');

const saveJob = async (req, res) => {
  const { jobId } = req.body;
  const savedJobExists = await SavedJob.findOne({ user: req.user._id, job: jobId });
  if (savedJobExists) return res.status(400).json({ message: 'Job already saved' });
  
  const savedJob = new SavedJob({ user: req.user._id, job: jobId });
  await savedJob.save();
  res.status(201).json(savedJob);
};

const removeSavedJob = async (req, res) => {
  const { jobId } = req.params;
  await SavedJob.findOneAndDelete({ user: req.user._id, job: jobId });
  res.json({ message: 'Saved job removed' });
};

const getSavedJobs = async (req, res) => {
  const savedJobs = await SavedJob.find({ user: req.user._id }).populate('job');
  res.json(savedJobs);
};

module.exports = { saveJob, removeSavedJob, getSavedJobs };
INNER_EOF

