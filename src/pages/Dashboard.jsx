import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardCard from '../components/DashboardCard';
import JobCard from '../components/JobCard';
import { calcProfileCompletion } from '../utils/profileCompletion';
import api from '../api';

export default function Dashboard({ user, onLogout }) {
  const completion = calcProfileCompletion(user);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Recruiter job creation modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: user.company || 'TechCorp Labs',
    location: 'Remote',
    type: 'Full-time',
    salary: '18-24 LPA',
    salaryMin: 18,
    salaryMax: 24,
    skills: 'React, Node.js, TypeScript',
    experience: '3-5 years',
    experienceLevel: 'Mid-level',
    category: 'Engineering',
    description: ''
  });
  const [postingJob, setPostingJob] = useState(false);

  const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const requests = [api.get('/jobs'), api.get('/applications')];
      if (!isRecruiter) {
        requests.push(api.get('/saved-jobs'));
      }

      const results = await Promise.all(requests);
      setJobs(results[0].data || []);
      setApplications(results[1].data || []);
      if (!isRecruiter && results[2]) {
        setSavedJobs(results[2].data.map((sj) => sj.job?._id || sj.job));
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Skill matching for candidates
  const userSkills = user.skills
    ? user.skills.split(',').map((s) => s.trim().toLowerCase())
    : [];

  const recommendedJobs = jobs.filter((job) =>
    Array.isArray(job.skills) && job.skills.some((skill) => userSkills.includes(skill.toLowerCase()))
  );

  const displayRecommendations = recommendedJobs.length > 0
    ? recommendedJobs.slice(0, 4)
    : jobs.slice(0, 4);

  const appliedJobIds = applications.map((a) => a.job?._id || a.job);

  const handleApply = async (job) => {
    if (appliedJobIds.includes(job._id)) return;
    try {
      const res = await api.post('/applications', { jobId: job._id });
      setApplications((prev) => [...prev, { ...res.data, job: job }]);
      setToast(`Application submitted for ${job.title} at ${job.company}!`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Error submitting application');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleSave = async (job) => {
    try {
      if (savedJobs.includes(job._id)) {
        await api.delete(`/saved-jobs/${job._id}`);
        setSavedJobs((prev) => prev.filter((id) => id !== job._id));
      } else {
        await api.post('/saved-jobs', { jobId: job._id });
        setSavedJobs((prev) => [...prev, job._id]);
      }
    } catch (err) {
      console.error('handleSave error:', err);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.description) {
      alert('Please fill in title, company, and description');
      return;
    }
    setPostingJob(true);
    try {
      const res = await api.post('/jobs', {
        ...newJob,
        skills: newJob.skills.split(',').map((s) => s.trim())
      });
      setJobs((prev) => [res.data, ...prev]);
      setShowPostModal(false);
      setToast(`Job opportunity "${newJob.title}" published successfully!`);
      setTimeout(() => setToast(''), 3000);
      setNewJob({
        title: '',
        company: user.company || 'TechCorp Labs',
        location: 'Remote',
        type: 'Full-time',
        salary: '18-24 LPA',
        salaryMin: 18,
        salaryMax: 24,
        skills: 'React, Node.js, TypeScript',
        experience: '3-5 years',
        experienceLevel: 'Mid-level',
        category: 'Engineering',
        description: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing job');
    } finally {
      setPostingJob(false);
    }
  };

  const recruiterJobs = isRecruiter
    ? jobs.filter((j) => String(j.recruiter?._id || j.recruiter) === String(user._id))
    : [];

  const displayName = user.fullName || user.name || 'User';

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-grow-1 py-4 py-md-5 hs-fade-in">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-white">
                Good morning, {displayName.split(' ')[0]}
              </h2>
              <p className="text-secondary mb-0">
                {isRecruiter
                  ? 'Recruitment Command Center: manage opportunities and review candidates.'
                  : 'Your next opportunity is closer than you think.'}
              </p>
            </div>
            {isRecruiter && (
              <button
                className="btn btn-hs-glow d-flex align-items-center gap-2"
                onClick={() => setShowPostModal(true)}
              >
                <i className="bi bi-plus-circle"></i> Post New Job
              </button>
            )}
          </div>

          {toast && (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-check-circle-fill"></i> {toast}
            </div>
          )}

          {/* Stats Section */}
          <div className="row g-3 mb-5">
            {isRecruiter ? (
              <>
                <DashboardCard
                  icon="bi-briefcase-fill"
                  label="Jobs Posted"
                  value={recruiterJobs.length}
                  accentColor="violet"
                />
                <DashboardCard
                  icon="bi-people-fill"
                  label="Applicants Received"
                  value={applications.length}
                  accentColor="cyan"
                />
                <DashboardCard
                  icon="bi-check-all"
                  label="Active Listings"
                  value={recruiterJobs.filter((j) => j.status === 'active').length}
                  accentColor="cyan"
                />
              </>
            ) : (
              <>
                <DashboardCard
                  icon="bi-send-check"
                  label="Applications"
                  value={applications.length}
                  accentColor="violet"
                />
                <DashboardCard
                  icon="bi-bookmark-star"
                  label="Saved Jobs"
                  value={savedJobs.length}
                  accentColor="cyan"
                />
                <DashboardCard
                  icon="bi-percent"
                  label="Profile Completion"
                  value={`${completion}%`}
                  accentColor="cyan"
                />
              </>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status"></div>
              <p className="text-muted mt-3">Synchronizing with MongoDB...</p>
            </div>
          ) : isRecruiter ? (
            /* Recruiter Dashboard View */
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0 text-white">Your Job Postings</h4>
                  <span className="text-secondary small font-monospace">
                    {recruiterJobs.length} Published
                  </span>
                </div>

                {recruiterJobs.length === 0 ? (
                  <div className="hs-glass-card p-5 text-center">
                    <i className="bi bi-briefcase text-secondary display-4"></i>
                    <h5 className="mt-3 text-white">No active listings created yet</h5>
                    <p className="text-secondary small">
                      Start publishing opportunities to source top engineering talent.
                    </p>
                    <button
                      className="btn btn-hs-glow btn-sm mt-2"
                      onClick={() => setShowPostModal(true)}
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="row">
                    {recruiterJobs.map((job) => (
                      <div className="col-md-6 mb-4" key={job._id}>
                        <JobCard
                          job={job}
                          isApplied={false}
                          isSaved={false}
                          onApply={() => {}}
                          onSave={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-lg-4">
                <div className="hs-glass-card p-4 mb-4">
                  <h5 className="fw-bold mb-3 text-white">Recent Candidates</h5>
                  {applications.length === 0 ? (
                    <p className="text-secondary small mb-0">
                      No applications submitted to your listings yet.
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {applications.slice(0, 5).map((app) => (
                        <div
                          key={app._id}
                          className="border-bottom border-secondary border-opacity-10 pb-3"
                        >
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <span className="fw-bold text-white small">
                              {app.user?.name || app.user?.fullName || 'Candidate'}
                            </span>
                            <span className="hs-badge-accent py-0 px-2" style={{ fontSize: '0.68rem' }}>
                              {app.status}
                            </span>
                          </div>
                          <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                            Applied for: {app.job?.title}
                          </div>
                          <div className="text-secondary small mt-1" style={{ fontSize: '0.7rem' }}>
                            Skills: {app.user?.skills || 'N/A'}
                          </div>
                        </div>
                      ))}
                      <Link to="/applications" className="btn btn-hs-outline btn-sm w-100 mt-2">
                        Manage All Applicants
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Candidate Dashboard View */
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0 text-white">Recommended Opportunities</h4>
                  <Link to="/jobs" className="text-info text-decoration-none small">
                    Explore All <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>

                <div className="row">
                  {displayRecommendations.map((job) => (
                    <div className="col-md-6 mb-4" key={job._id || job.id}>
                      <JobCard
                        job={job}
                        isApplied={appliedJobIds.includes(job._id || job.id)}
                        isSaved={savedJobs.includes(job._id || job.id)}
                        onApply={handleApply}
                        onSave={handleSave}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="hs-glass-card p-4 mb-4">
                  <h5 className="fw-bold mb-3 text-white">Career Snapshot</h5>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary small">Profile Completeness</span>
                      <span className="text-info small fw-bold">{completion}%</span>
                    </div>
                    <div
                      className="progress"
                      style={{ height: 6, background: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${completion}%`,
                          background: 'linear-gradient(90deg, var(--hs-primary), var(--hs-accent))'
                        }}
                        aria-valuenow={completion}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-secondary small d-block mb-2">
                      Primary Competencies
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      {userSkills.length > 0 ? (
                        userSkills.map((skill) => (
                          <span className="hs-badge-accent py-1" key={skill}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-secondary small d-block mb-1">
                      Preferred Location
                    </span>
                    <div className="text-white small fw-semibold d-flex align-items-center gap-2">
                      <i className="bi bi-geo-alt text-info"></i>
                      {user.location || 'Not Specified'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-secondary small d-block mb-1">
                      Job Preference
                    </span>
                    <div className="text-white small fw-semibold d-flex align-items-center gap-2">
                      <i className="bi bi-briefcase text-info"></i>
                      {user.experience
                        ? `${user.experience} Experience`
                        : 'Full-Time Positions'}
                    </div>
                  </div>

                  <Link to="/profile" className="btn btn-hs-outline btn-sm w-100 mt-3">
                    Optimize Command Dossier
                  </Link>
                </div>

                <div className="hs-glass-card p-4">
                  <h5 className="fw-bold mb-3 text-white">Active Logs</h5>
                  {applications.length === 0 ? (
                    <p className="text-secondary small mb-0">
                      No active applications currently in progress.
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {applications.slice(-3).reverse().map((app) => (
                        <div
                          key={app._id}
                          className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-10 pb-2"
                        >
                          <div>
                            <div className="text-white fw-bold small">
                              {app.job?.title || 'Job Listing'}
                            </div>
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              {app.job?.company || ''}
                            </div>
                          </div>
                          <span className="hs-badge-accent py-0 px-2">{app.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Recruiter Post Job Modal */}
      {showPostModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content hs-glass-card border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title text-white fw-bold">
                  <i className="bi bi-plus-circle text-info me-2"></i>Post New Job Opportunity
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPostModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateJob}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Job Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. Senior Backend Engineer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small">Company Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. TechCorp Labs"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. San Francisco, CA or Remote"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small">Employment Type</label>
                      <select
                        className="form-select"
                        value={newJob.type}
                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small">Category</label>
                      <select
                        className="form-select"
                        value={newJob.category}
                        onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="AI & Data Science">AI & Data Science</option>
                        <option value="DevOps & Cloud">DevOps & Cloud</option>
                        <option value="Design & Frontend">Design & Frontend</option>
                        <option value="Security">Security</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small">Salary Label</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 18-24 LPA"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small">Min Salary (LPA)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newJob.salaryMin}
                        onChange={(e) => setNewJob({ ...newJob, salaryMin: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small">Experience Level</label>
                      <select
                        className="form-select"
                        value={newJob.experienceLevel}
                        onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                      >
                        <option value="Entry-level">Entry-level (0-2 yrs)</option>
                        <option value="Mid-level">Mid-level (2-5 yrs)</option>
                        <option value="Senior-level">Senior-level (5+ yrs)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small">Required Skills (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. React, Node.js, MongoDB, TypeScript"
                        value={newJob.skills}
                        onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small">Job Description *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        required
                        placeholder="Detailed role responsibilities, prerequisites, and company perks..."
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button
                    type="button"
                    className="btn btn-hs-outline btn-sm"
                    onClick={() => setShowPostModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-hs-glow btn-sm"
                    disabled={postingJob}
                  >
                    {postingJob ? 'Publishing to MongoDB...' : 'Publish Opportunity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
