const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, fullName, email, password, role, phone, location, skills } = req.body;
    const displayName = (fullName || name || '').trim();

    if (!displayName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Prevent public creation of admin accounts
    let userRole = 'candidate';
    if (role === 'recruiter') {
      userRole = 'recruiter';
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: displayName,
      fullName: displayName,
      email: email.toLowerCase(),
      password,
      role: userRole,
      phone: phone || '',
      location: location || '',
      skills: skills || ''
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        education: user.education,
        experience: user.experience,
        skills: user.skills,
        profilePicture: user.profilePicture,
        resumeUrl: user.resumeUrl,
        portfolioUrl: user.portfolioUrl,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        token: generateToken(user._id)
      });
    } else {
      return res.status(400).json({ message: 'Invalid user registration data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        education: user.education,
        experience: user.experience,
        skills: user.skills,
        profilePicture: user.profilePicture,
        resumeUrl: user.resumeUrl,
        portfolioUrl: user.portfolioUrl,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server error during authentication' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe };
