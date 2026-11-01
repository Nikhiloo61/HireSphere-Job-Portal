import React from 'react';
import { Link } from 'react-router-dom';

const stepsList = ['Applied', 'Under Review', 'Shortlisted', 'Decision'];

export default function Applications({ applications }) {
  if (applications.length === 0) {
    return (
      <div className="hs-glass-card p-5 text-center">
        <div 
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{ width: 64, height: 64, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <i className="bi bi-file-earmark-text text-secondary fs-3"></i>
        </div>
        <h5 className="mt-3 text-white fw-bold">No active submissions</h5>
        <p className="text-secondary small mb-4">You have not registered any job applications in the current cycle.</p>
        <Link to="/jobs" className="btn btn-hs-glow btn-sm">Browse Opportunities</Link>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {applications.slice().reverse().map((app) => {
        // Determine index for progress mapping
        let currentStepIndex = 0;
        if (app.status === 'Under Review') currentStepIndex = 1;
        if (app.status === 'Shortlisted') currentStepIndex = 2;
        if (app.status === 'Rejected') currentStepIndex = 3;

        return (
          <div key={app.id} className="hs-glass-card p-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
              <div>
                <span className="text-info font-monospace tracking-wide small d-block mb-1">SUBMISSION ID: {app.id.split('-')[0].toUpperCase()}</span>
                <h4 className="fw-bold mb-1 text-white">{app.jobTitle}</h4>
                <div className="text-secondary small d-flex align-items-center gap-2">
                  <span>{app.company}</span>
                  <span>•</span>
                  <span>Applied on {app.appliedDate}</span>
                </div>
              </div>
              
              <div>
                <span 
                  className={`hs-badge-accent py-1 px-3 ${
                    app.status === 'Rejected' 
                      ? 'border-danger text-danger bg-danger bg-opacity-10' 
                      : (app.status === 'Shortlisted' ? 'border-success text-success bg-success bg-opacity-10' : '')
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>

            {/* Custom Status Timeline */}
            <div className="position-relative py-2 px-1">
              <div 
                className="progress position-absolute top-50 start-0 translate-y-middle w-100" 
                style={{ height: 2, background: 'rgba(255, 255, 255, 0.08)', zIndex: 1 }}
              >
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: app.status === 'Rejected' ? '100%' : `${(currentStepIndex / 3) * 100}%`,
                    background: app.status === 'Rejected' ? '#ef4444' : 'var(--hs-primary)',
                    transition: 'all 0.4s ease'
                  }}
                ></div>
              </div>

              <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                {stepsList.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isRejectedState = app.status === 'Rejected' && idx === 3;

                  let stepColor = 'rgba(255, 255, 255, 0.2)';
                  let borderStyle = '1px solid rgba(255, 255, 255, 0.1)';
                  
                  if (isCompleted) {
                    stepColor = 'var(--hs-primary)';
                    borderStyle = '2px solid var(--hs-primary)';
                  }
                  if (isRejectedState) {
                    stepColor = '#ef4444';
                    borderStyle = '2px solid #ef4444';
                  }

                  return (
                    <div key={step} className="d-flex flex-column align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center bg-dark"
                        style={{ 
                          width: 24, 
                          height: 24, 
                          border: borderStyle,
                          boxShadow: isCurrent ? '0 0 10px var(--hs-primary)' : 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isCompleted && !isRejectedState && <i className="bi bi-check text-white" style={{ fontSize: '0.85rem' }}></i>}
                        {isRejectedState && <i className="bi bi-x text-white" style={{ fontSize: '0.85rem' }}></i>}
                      </div>
                      <span 
                        className="small mt-2 font-monospace"
                        style={{ 
                          fontSize: '0.72rem', 
                          color: isRejectedState ? '#ef4444' : (isCompleted ? 'var(--hs-text-light)' : 'var(--hs-text-muted)'),
                          fontWeight: isCompleted ? '600' : '400'
                        }}
                      >
                        {isRejectedState ? 'Rejected' : step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
