import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const STATUS_STEPS = ['Applied', 'Under Review', 'Shortlisted', 'Decision'];

export default function ApplicationsPage({ user, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications');
      setApplications(res.data || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  // Recruiter status update
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: res.data.status } : a))
      );
      setToast(`Applicant status successfully updated to "${newStatus}"!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Error updating status');
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Candidate withdraw application
  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      setToast('Application withdrawn successfully');
      setTimeout(() => setToast(''), 3000);
      if (selectedApp?._id === appId) {
        setSelectedApp(null);
      }
    } catch (err) {
      setToast(err.response?.data?.message || 'Error withdrawing application');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-grow-1 py-4 py-md-5 hs-fade-in">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1 text-white">
                {isRecruiter ? 'Candidate Pipeline' : 'Application Logs'}
              </h2>
              <p className="text-secondary mb-0">
                {isRecruiter
                  ? 'Review submissions, evaluate technical credentials, and manage applicant progression.'
                  : 'Track your active opportunity submissions and real-time recruitment statuses.'}
              </p>
            </div>
            <span className="text-info font-monospace small">
              {applications.length} {isRecruiter ? 'Submissions Received' : 'Applications Tracked'}
            </span>
          </div>

          {toast && (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-check-circle-fill"></i> {toast}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status"></div>
              <p className="text-muted mt-3">Loading pipeline records from database...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="hs-glass-card p-5 text-center">
              <i className="bi bi-inbox text-secondary display-4"></i>
              <h5 className="mt-3 text-white">No active applications found</h5>
              <p className="text-secondary small">
                {isRecruiter
                  ? 'No candidates have submitted applications for your posted jobs yet.'
                  : 'You have not submitted any applications yet. Explore opportunities to get started.'}
              </p>
            </div>
          ) : isRecruiter ? (
            /* Recruiter Applicants Table View */
            <div className="hs-glass-card overflow-hidden">
              <div className="table-responsive">
                <table className="table table-borderless table-hover align-middle mb-0 hs-table">
                  <thead
                    className="bg-dark bg-opacity-50 text-secondary small text-uppercase"
                    style={{ letterSpacing: '1px' }}
                  >
                    <tr>
                      <th className="py-3 ps-4">Candidate</th>
                      <th className="py-3">Role Applied</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Status Pipeline</th>
                      <th className="py-3 pe-4 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-top border-secondary border-opacity-10">
                        <td className="py-3 ps-4">
                          <div className="fw-bold text-white mb-0">
                            {app.user?.name || app.user?.fullName || 'Candidate'}
                          </div>
                          <div className="text-muted small">{app.user?.email}</div>
                          {app.user?.skills && (
                            <div className="small text-info mt-1" style={{ fontSize: '0.75rem' }}>
                              <i className="bi bi-code-slash me-1"></i> {app.user.skills}
                            </div>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="text-white fw-medium">{app.job?.title}</div>
                          <div className="text-muted small">{app.job?.company}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-secondary small">
                            {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3">
                          <select
                            className="form-select form-select-sm bg-dark text-white border-secondary"
                            style={{ maxWidth: 160 }}
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 pe-4 text-end">
                          <button
                            className="btn btn-sm btn-hs-outline"
                            onClick={() => setSelectedApp(app)}
                          >
                            View Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Candidate Applications List with Visual Timeline */
            <div className="d-flex flex-column gap-4">
              {applications.map((app) => {
                let currentStepIndex = 0;
                if (app.status === 'Under Review') currentStepIndex = 1;
                if (app.status === 'Shortlisted') currentStepIndex = 2;
                if (app.status === 'Accepted' || app.status === 'Rejected') currentStepIndex = 3;

                return (
                  <div key={app._id} className="hs-glass-card p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                      <div>
                        <span className="text-info font-monospace tracking-wide small d-block mb-1">
                          RECORD ID: {app._id.slice(-6).toUpperCase()}
                        </span>
                        <h4 className="fw-bold mb-1 text-white">{app.job?.title}</h4>
                        <div className="text-secondary small d-flex align-items-center gap-2">
                          <span>{app.job?.company}</span>
                          <span>•</span>
                          <span>{app.job?.location}</span>
                          <span>•</span>
                          <span>Applied on {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span
                          className={`hs-badge-accent py-1 px-3 ${
                            app.status === 'Rejected'
                              ? 'border-danger text-danger bg-danger bg-opacity-10'
                              : app.status === 'Accepted' || app.status === 'Shortlisted'
                              ? 'border-success text-success bg-success bg-opacity-10'
                              : ''
                          }`}
                        >
                          {app.status}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Withdraw Application"
                          onClick={() => handleWithdraw(app._id)}
                        >
                          <i className="bi bi-trash3 me-1"></i> Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Timeline Progress */}
                    <div className="position-relative py-2 px-1">
                      <div
                        className="progress position-absolute top-50 start-0 translate-y-middle w-100"
                        style={{ height: 2, background: 'rgba(255, 255, 255, 0.08)', zIndex: 1 }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width:
                              app.status === 'Rejected'
                                ? '100%'
                                : `${(currentStepIndex / 3) * 100}%`,
                            background:
                              app.status === 'Rejected' ? '#ef4444' : 'var(--hs-primary)',
                            transition: 'all 0.4s ease'
                          }}
                        ></div>
                      </div>

                      <div
                        className="d-flex justify-content-between position-relative"
                        style={{ zIndex: 2 }}
                      >
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;
                          const isRejectedState = app.status === 'Rejected' && idx === 3;
                          const isAcceptedState = app.status === 'Accepted' && idx === 3;

                          let borderStyle = '1px solid rgba(255, 255, 255, 0.1)';
                          if (isCompleted) {
                            borderStyle = '2px solid var(--hs-primary)';
                          }
                          if (isRejectedState) {
                            borderStyle = '2px solid #ef4444';
                          }
                          if (isAcceptedState) {
                            borderStyle = '2px solid #10b981';
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
                                {isCompleted && !isRejectedState && (
                                  <i
                                    className="bi bi-check text-white"
                                    style={{ fontSize: '0.85rem' }}
                                  ></i>
                                )}
                                {isRejectedState && (
                                  <i
                                    className="bi bi-x text-white"
                                    style={{ fontSize: '0.85rem' }}
                                  ></i>
                                )}
                              </div>
                              <span
                                className="small mt-2 font-monospace"
                                style={{
                                  fontSize: '0.72rem',
                                  color: isRejectedState
                                    ? '#ef4444'
                                    : isAcceptedState
                                    ? '#10b981'
                                    : isCompleted
                                    ? 'var(--hs-text-light)'
                                    : 'var(--hs-text-muted)',
                                  fontWeight: isCompleted ? '600' : '400'
                                }}
                              >
                                {idx === 3
                                  ? app.status === 'Accepted'
                                    ? 'Accepted'
                                    : app.status === 'Rejected'
                                    ? 'Rejected'
                                    : 'Decision'
                                  : step}
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
          )}
        </div>
      </main>

      {/* Applicant Details Modal for Recruiters */}
      {selectedApp && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content hs-glass-card border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white fw-bold">Candidate Dossier</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedApp(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-info text-dark fw-bold"
                    style={{ width: 48, height: 48, fontSize: '1.2rem' }}
                  >
                    {(selectedApp.user?.name || selectedApp.user?.fullName || 'C')[0]}
                  </div>
                  <div>
                    <h5 className="text-white mb-0">
                      {selectedApp.user?.name || selectedApp.user?.fullName}
                    </h5>
                    <span className="text-muted small">{selectedApp.user?.email}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Applying for Role</label>
                  <p className="text-white fw-semibold mb-0">
                    {selectedApp.job?.title} ({selectedApp.job?.company})
                  </p>
                </div>

                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Candidate Competencies</label>
                  <p className="text-white small mb-0">
                    {selectedApp.user?.skills || 'No skills listed'}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="text-secondary small d-block mb-1">Candidate Location</label>
                  <p className="text-white small mb-0">
                    {selectedApp.user?.location || 'Not Specified'}
                  </p>
                </div>

                {selectedApp.user?.experience && (
                  <div className="mb-3">
                    <label className="text-secondary small d-block mb-1">Experience</label>
                    <p className="text-white small mb-0">{selectedApp.user.experience}</p>
                  </div>
                )}

                {selectedApp.coverLetter && (
                  <div className="mb-3">
                    <label className="text-secondary small d-block mb-1">Cover Letter</label>
                    <div
                      className="p-3 rounded-2 text-secondary small"
                      style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                    >
                      {selectedApp.coverLetter}
                    </div>
                  </div>
                )}

                {selectedApp.resumeUrl && (
                  <div className="mb-3">
                    <label className="text-secondary small d-block mb-1">Resume Link</label>
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info small text-decoration-none"
                    >
                      <i className="bi bi-file-earmark-pdf me-1"></i> {selectedApp.resumeUrl}
                    </a>
                  </div>
                )}
              </div>
              <div className="modal-footer border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-hs-outline btn-sm"
                  onClick={() => setSelectedApp(null)}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
