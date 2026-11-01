const mongoose = require('mongoose');

const SavedJobSchema = new mongoose.Schema(
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
    savedDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

SavedJobSchema.pre('save', function () {
  if (this.user && !this.candidate) this.candidate = this.user;
  if (this.candidate && !this.user) this.user = this.candidate;
});

// Prevent duplicate saved jobs
SavedJobSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', SavedJobSchema);
