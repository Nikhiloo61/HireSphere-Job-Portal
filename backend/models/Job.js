const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description']
    },
    location: {
      type: String,
      required: [true, 'Please provide a job location'],
      trim: true
    },
    type: {
      type: String,
      default: 'Full-time',
      trim: true
    },
    employmentType: {
      type: String,
      default: 'Full-time'
    },
    salary: {
      type: String,
      default: 'Competitive'
    },
    salaryMin: {
      type: Number,
      default: 0
    },
    salaryMax: {
      type: Number,
      default: 0
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: '0-2 years'
    },
    experienceLevel: {
      type: String,
      default: 'Entry-level'
    },
    category: {
      type: String,
      default: 'Engineering',
      trim: true
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    deadline: {
      type: Date
    },
    applicationDeadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    },
    postedDate: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10)
    }
  },
  {
    timestamps: true
  }
);

// Keep logo/companyLogo and recruiter/recruiterId in sync
JobSchema.pre('save', function () {
  if (this.companyLogo && !this.logo) this.logo = this.companyLogo;
  if (this.logo && !this.companyLogo) this.companyLogo = this.logo;
  if (this.recruiter && !this.recruiterId) this.recruiterId = this.recruiter;
  if (this.recruiterId && !this.recruiter) this.recruiter = this.recruiterId;
  if (this.type && !this.employmentType) this.employmentType = this.type;
  if (this.employmentType && !this.type) this.type = this.employmentType;
  if (this.deadline && !this.applicationDeadline) this.applicationDeadline = this.deadline;
  if (this.applicationDeadline && !this.deadline) this.deadline = this.applicationDeadline;
});

// Create text index for search on title, company, description, and skills
JobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
