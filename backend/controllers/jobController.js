const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');

// @desc    Get all jobs with search, filtering, sorting, and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      search,
      q,
      title,
      company,
      location,
      type,
      employmentType,
      experienceLevel,
      category,
      minSalary,
      maxSalary,
      skills,
      status,
      recruiter,
      sort,
      page,
      limit,
      format
    } = req.query;

    const query = {};

    // Only return active jobs by default, unless specified or queried by recruiter
    if (status) {
      query.status = status;
    }

    // Search query on title, company, skills
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), 'i');
      query.$or = [
        { title: regex },
        { company: regex },
        { skills: regex },
        { description: regex },
        { location: regex }
      ];
    }

    if (title) query.title = new RegExp(title.trim(), 'i');
    if (company) query.company = new RegExp(company.trim(), 'i');
    if (location) query.location = new RegExp(location.trim(), 'i');
    if (type) query.type = type;
    if (employmentType) query.type = employmentType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = new RegExp(category.trim(), 'i');
    if (recruiter) query.recruiter = recruiter;

    // Filter by skills
    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    // Salary filtering
    if (minSalary !== undefined) {
      query.salaryMin = { ...(query.salaryMin || {}), $gte: Number(minSalary) };
    }
    if (maxSalary !== undefined) {
      query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(maxSalary) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'salary-high') sortOption = { salaryMin: -1 };
    if (sort === 'salary-low') sortOption = { salaryMin: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const total = await Job.countDocuments(query);

    let jobsQuery = Job.find(query).sort(sortOption).populate('recruiter', 'name email company');

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      jobsQuery = jobsQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const jobs = await jobsQuery;

    // Set headers for pagination metadata
    res.setHeader('X-Total-Count', total);

    if (format === 'paginated') {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || total;
      return res.json({
        total,
        page: pageNum,
        pages: Math.ceil(total / (limitNum || 1)),
        jobs
      });
    }

    // Default: return array directly for seamless frontend compatibility
    return res.json(jobs);
  } catch (error) {
    console.error('getJobs error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching jobs' });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email company');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error fetching job details' });
  }
};

// @desc    Create a job listing
// @route   POST /api/jobs
// @access  Private (Recruiter & Admin)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      logo,
      description,
      location,
      type,
      employmentType,
      salary,
      salaryMin,
      salaryMax,
      skills,
      experience,
      experienceLevel,
      category,
      deadline,
      applicationDeadline,
      status
    } = req.body;

    if (!title || !company || !description || !location) {
      return res.status(400).json({
        message: 'Please provide title, company, description, and location for the job'
      });
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const job = new Job({
      title,
      company,
      logo: logo || companyLogo || (company ? company[0].toUpperCase() : 'J'),
      companyLogo: companyLogo || logo || (company ? company[0].toUpperCase() : 'J'),
      description,
      location,
      type: type || employmentType || 'Full-time',
      employmentType: employmentType || type || 'Full-time',
      salary: salary || 'Competitive',
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      skills: skillsArray,
      experience: experience || '0-2 years',
      experienceLevel: experienceLevel || 'Entry-level',
      category: category || 'Engineering',
      recruiter: req.user._id,
      recruiterId: req.user._id,
      deadline: deadline || applicationDeadline,
      applicationDeadline: applicationDeadline || deadline,
      status: status || 'active'
    });

    const savedJob = await job.save();
    return res.status(201).json(savedJob);
  } catch (error) {
    console.error('createJob error:', error);
    return res.status(500).json({ message: error.message || 'Server error creating job' });
  }
};

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter owner & Admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check authorization: only recruiter who posted it or admin can update
    if (req.user.role !== 'admin' && String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to modify this job listing' });
    }

    const updatableFields = [
      'title',
      'company',
      'logo',
      'companyLogo',
      'description',
      'location',
      'type',
      'employmentType',
      'salary',
      'salaryMin',
      'salaryMax',
      'skills',
      'experience',
      'experienceLevel',
      'category',
      'deadline',
      'applicationDeadline',
      'status'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'skills' && typeof req.body.skills === 'string') {
          job.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
        } else {
          job[field] = req.body[field];
        }
      }
    });

    const updatedJob = await job.save();
    return res.json(updatedJob);
  } catch (error) {
    console.error('updateJob error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating job' });
  }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter owner & Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check authorization: only recruiter who posted it or admin can delete
    if (req.user.role !== 'admin' && String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this job listing' });
    }

    // Delete associated applications and saved jobs
    await Application.deleteMany({ job: job._id });
    await SavedJob.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(job._id);

    return res.json({ message: 'Job listing and associated records removed successfully' });
  } catch (error) {
    console.error('deleteJob error:', error);
    return res.status(500).json({ message: error.message || 'Server error deleting job' });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};
