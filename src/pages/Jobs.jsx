import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchFilter from '../components/SearchFilter';
import JobList from '../components/JobList';
import api from '../api';

const initialFilters = { search: '', location: '', type: '', experienceLevel: '', maxSalary: 35 };

export default function Jobs({ user, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  // Recruiter modal state
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
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const locations = [...new Set(jobs.map((j) => j.location).filter(Boolean))];
  const jobTypes = [...new Set(jobs.map((j) => j.type).filter(Boolean))];
  const experienceLevels = [...new Set(jobs.map((j) => j.experienceLevel).filter(Boolean))];

  const appliedJobIds = applications.map((a) => a.job?._id || a.job);

  const filteredJobs = jobs.filter((job) => {
    const q = filters.search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (Array.isArray(job.skills) && job.skills.some((s) => s.toLowerCase().includes(q)));
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesType = !filters.type || job.type === filters.type;
    const matchesExperience = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;
    const matchesSalary = !job.salaryMin || job.salaryMin <= Number(filters.maxSalary);
    return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesSalary;
  });

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

  const handleClearFilters = () => setFilters(initialFilters);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.description) {
      alert('Please fill in required fields');
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-grow-1 py-4 py-md-5 hs-fade-in">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-white">Explore Opportunities</h2>
              <p className="text-secondary mb-0">
                Find roles that match your skills, ambitions, and technical trajectory.
              </p>
              <small className="text-info font-monospace tracking-wide">
                {filteredJobs.length} active positions indexed in MongoDB
              </small>
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

          <SearchFilter
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
            locations={locations}
            jobTypes={jobTypes}
            experienceLevels={experienceLevels}
          />

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-info" role="status"></div>
              <p className="text-muted mt-3">Loading opportunities from database...</p>
            </div>
          ) : (
            <JobList
              jobs={filteredJobs}
              appliedJobIds={appliedJobIds}
              savedJobIds={savedJobs}
              onApply={handleApply}
              onSave={handleSave}
            />
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
