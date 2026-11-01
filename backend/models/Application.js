const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    coverLetter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Accepted'],
      default: 'Applied'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Keep user and candidate in sync
ApplicationSchema.pre('save', function () {
  if (this.user && !this.candidate) this.candidate = this.user;
  if (this.candidate && !this.user) this.user = this.candidate;
});

// Prevent duplicate applications for the same job by the same candidate
ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
