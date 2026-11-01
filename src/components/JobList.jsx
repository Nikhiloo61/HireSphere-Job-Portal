import React from 'react';
import JobCard from './JobCard';

export default function JobList({ jobs, appliedJobIds, savedJobIds, onApply, onSave }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-emoji-frown display-4 hs-muted"></i>
        <h5 className="mt-3">No jobs found</h5>
        <p className="hs-muted">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {jobs.map((job) => (
        <div className="col-md-6 col-xl-4" key={job._id || job.id}>
          <JobCard
            job={job}
            isApplied={appliedJobIds.includes(job._id || job.id)}
            isSaved={savedJobIds.includes(job._id || job.id)}
            onApply={onApply}
            onSave={onSave}
          />
        </div>
      ))}
    </div>
  );
}
