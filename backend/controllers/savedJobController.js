const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job listing
// @route   POST /api/saved-jobs
// @access  Private (Candidate)
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existing = await SavedJob.findOne({
      $or: [
        { user: req.user._id, job: jobId },
        { candidate: req.user._id, job: jobId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: 'Job is already saved in bookmarks' });
    }

    const savedJob = new SavedJob({
      user: req.user._id,
      candidate: req.user._id,
      job: jobId
    });

    await savedJob.save();
    const populated = await SavedJob.findById(savedJob._id).populate('job');

    return res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    console.error('saveJob error:', error);
    return res.status(500).json({ message: error.message || 'Server error saving job' });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Candidate)
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await SavedJob.findOneAndDelete({
      $or: [
        { user: req.user._id, job: jobId },
        { candidate: req.user._id, job: jobId },
        { _id: jobId, user: req.user._id }
      ]
    });

    if (!result) {
      return res.status(404).json({ message: 'Saved job entry not found' });
    }

    return res.json({ message: 'Job removed from saved bookmarks' });
  } catch (error) {
    console.error('removeSavedJob error:', error);
    return res.status(500).json({ message: error.message || 'Server error removing saved job' });
  }
};

// @desc    Get all saved jobs for user
// @route   GET /api/saved-jobs
// @access  Private (Candidate)
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      $or: [{ user: req.user._id }, { candidate: req.user._id }]
    })
      .populate('job')
      .sort({ createdAt: -1 });

    return res.json(savedJobs);
  } catch (error) {
    console.error('getSavedJobs error:', error);
    return res.status(500).json({ message: error.message || 'Server error retrieving saved jobs' });
  }
};

module.exports = { saveJob, removeSavedJob, getSavedJobs };
