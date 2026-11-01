import React from 'react';

export default function JobCard({ job, isApplied, isSaved, onApply, onSave }) {
  const timeAgo = (dateStr) => {
    const days = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div 
      className="hs-glass-card p-4 h-100 d-flex flex-column"
      style={{
        borderTop: isApplied 
          ? '3px solid var(--hs-success)' 
          : (isSaved ? '3px solid var(--hs-accent)' : '1px solid var(--hs-card-border)')
      }}
    >
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex gap-3">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 fw-bold"
              style={{
                width: 50,
                height: 50,
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--hs-accent)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1.25rem'
              }}
            >
              {job.logo || (job.company ? job.company[0] : 'C')}
            </div>
            <div>
              <h5 className="fw-bold mb-1 text-white">{job.title}</h5>
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small">{job.company}</span>
                <span className="hs-badge-accent py-0 px-2">{job.type}</span>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            className="btn btn-sm border-0 rounded-circle d-flex align-items-center justify-content-center"
            title={isSaved ? 'Remove from saved jobs' : 'Save job'}
            onClick={() => onSave(job)}
            style={{ 
              width: 36, 
              height: 36, 
              background: isSaved ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: isSaved ? 'var(--hs-accent)' : 'var(--hs-text-muted)',
              border: `1px solid ${isSaved ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
              transition: 'all 0.2s ease'
            }}
          >
            <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} fs-6`}></i>
          </button>
        </div>

        <p className="text-secondary small mt-3 mb-3 flex-grow-1" style={{ lineHeight: '1.5' }}>
          {job.description}
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {job.skills.map((skill) => (
            <span className="hs-badge-primary" key={skill}>{skill}</span>
          ))}
        </div>

        <div className="row g-2 mb-4 pt-3 border-top border-secondary border-opacity-10 small text-secondary">
          <div className="col-6 d-flex align-items-center gap-1">
            <i className="bi bi-geo-alt text-info"></i>
            <span>{job.location}</span>
          </div>
          <div className="col-6 d-flex align-items-center gap-1">
            <i className="bi bi-currency-rupee text-info"></i>
            <span>{job.salary}</span>
          </div>
          <div className="col-6 d-flex align-items-center gap-1">
            <i className="bi bi-briefcase text-info"></i>
            <span>{job.experience}</span>
          </div>
          <div className="col-6 d-flex align-items-center gap-1">
            <i className="bi bi-clock text-info"></i>
            <span>{timeAgo(job.postedDate)}</span>
          </div>
        </div>

        <div className="d-flex gap-2 mt-auto">
          {isApplied ? (
            <button
              type="button"
              className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              disabled
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--hs-success)',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '0.55rem'
              }}
            >
              <i className="bi bi-check-circle-fill"></i> Applied
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-hs-glow w-100"
              style={{ borderRadius: '8px', padding: '0.55rem' }}
              onClick={() => onApply(job)}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
  );
}
