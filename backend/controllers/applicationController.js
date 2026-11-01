const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
const applyJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required to apply' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Target job not found' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ message: 'This job listing is closed and no longer accepting applications' });
    }

    // Check duplicate application
    const existing = await Application.findOne({
      $or: [
        { user: req.user._id, job: jobId },
        { candidate: req.user._id, job: jobId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }

    const application = new Application({
      user: req.user._id,
      candidate: req.user._id,
      job: jobId,
      resumeUrl: resumeUrl || req.user.resumeUrl || '',
      coverLetter: coverLetter || '',
      status: 'Applied'
    });

    const saved = await application.save();
    const populated = await Application.findById(saved._id)
      .populate('job')
      .populate('user', 'name fullName email phone skills location resumeUrl');

    return res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate application detected' });
    }
    console.error('applyJob error:', error);
    return res.status(500).json({ message: error.message || 'Server error submitting application' });
  }
};

// @desc    Get user's applications (candidate gets theirs, recruiter gets apps for their jobs)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    let applications;

    if (req.user.role === 'recruiter') {
      // Find jobs posted by this recruiter
      const recruiterJobs = await Job.find({ recruiter: req.user._id }).select('_id');
      const jobIds = recruiterJobs.map((j) => j._id);

      applications = await Application.find({ job: { $in: jobIds } })
        .populate('job')
        .populate('user', 'name fullName email phone skills location education experience resumeUrl')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      applications = await Application.find({})
        .populate('job')
        .populate('user', 'name fullName email phone skills location resumeUrl')
        .sort({ createdAt: -1 });
    } else {
      // Candidate: only their own applications
      applications = await Application.find({
        $or: [{ user: req.user._id }, { candidate: req.user._id }]
      })
        .populate('job')
        .sort({ createdAt: -1 });
    }

    return res.json(applications);
  } catch (error) {
    console.error('getApplications error:', error);
    return res.status(500).json({ message: error.message || 'Server error retrieving applications' });
  }
};

// @desc    Get application details by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('user', 'name fullName email phone skills location education experience resumeUrl');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const isApplicant = String(application.user._id || application.user) === String(req.user._id);
    const isRecruiter = application.job && String(application.job.recruiter) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isApplicant && !isRecruiter && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error retrieving application' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter of that job & Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const isRecruiter = application.job && String(application.job.recruiter) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isRecruiter && !isAdmin) {
      return res.status(403).json({
        message: 'Only the recruiter who posted this job or an administrator can update the status'
      });
    }

    application.status = status;
    const updated = await application.save();

    return res.json(updated);
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating application status' });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Candidate & Admin)
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const isApplicant = String(application.user) === String(req.user._id) || String(application.candidate) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isApplicant && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await Application.findByIdAndDelete(application._id);
    return res.json({ message: 'Application successfully withdrawn' });
  } catch (error) {
    console.error('deleteApplication error:', error);
    return res.status(500).json({ message: error.message || 'Server error withdrawing application' });
  }
};

module.exports = {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
};
