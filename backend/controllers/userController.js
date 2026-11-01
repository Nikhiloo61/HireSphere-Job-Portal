const User = require('../models/User');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name || req.body.fullName) {
      const displayName = req.body.fullName || req.body.name;
      user.name = displayName;
      user.fullName = displayName;
    }

    if (req.body.email) {
      const newEmail = req.body.email.toLowerCase().trim();
      if (newEmail !== user.email) {
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
          return res.status(400).json({ message: 'Email address already in use by another account' });
        }
        user.email = newEmail;
      }
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    const updatableFields = [
      'phone',
      'location',
      'experience',
      'education',
      'skills',
      'profilePicture',
      'resumeUrl',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    // Preserve existing token
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      location: updatedUser.location,
      experience: updatedUser.experience,
      education: updatedUser.education,
      skills: updatedUser.skills,
      profilePicture: updatedUser.profilePicture,
      resumeUrl: updatedUser.resumeUrl,
      linkedinUrl: updatedUser.linkedinUrl,
      githubUrl: updatedUser.githubUrl,
      portfolioUrl: updatedUser.portfolioUrl,
      token
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/users/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's applications
    await Application.deleteMany({ user: userId });

    // Delete user's saved jobs
    await SavedJob.deleteMany({ user: userId });

    // If recruiter, optionally handle their jobs or delete applications to their jobs
    if (req.user.role === 'recruiter') {
      const userJobs = await Job.find({ recruiter: userId });
      const jobIds = userJobs.map((j) => j._id);
      await Application.deleteMany({ job: { $in: jobIds } });
      await SavedJob.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ recruiter: userId });
    }

    // Delete the user record
    await User.findByIdAndDelete(userId);

    return res.json({ message: 'User account and associated records deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    return res.status(500).json({ message: error.message || 'Server error deleting account' });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile };
