import React, { useState, useEffect } from 'react';
import Form from './Form';
import { calcProfileCompletion } from '../utils/profileCompletion';
import api from '../api';

export default function Profile({ user, onUpdate, onLogout }) {
  const [form, setForm] = useState({
    name: user.name || user.fullName || '',
    fullName: user.fullName || user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    education: user.education || '',
    experience: user.experience || '',
    skills: user.skills || '',
    resumeUrl: user.resumeUrl || '',
    portfolioUrl: user.portfolioUrl || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || ''
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setForm({
      name: user.name || user.fullName || '',
      fullName: user.fullName || user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      education: user.education || '',
      experience: user.experience || '',
      skills: user.skills || '',
      resumeUrl: user.resumeUrl || '',
      portfolioUrl: user.portfolioUrl || '',
      githubUrl: user.githubUrl || '',
      linkedinUrl: user.linkedinUrl || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', form);
      onUpdate(res.data);
      setForm(res.data);
      setEditing(false);
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'WARNING: Are you sure you want to permanently delete your account and all associated applications and data? This action cannot be undone.'
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete('/users/profile');
      alert('Your account has been deleted successfully.');
      if (onLogout) onLogout();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting account');
    } finally {
      setDeleting(false);
    }
  };

  const completion = calcProfileCompletion(form);
  const displayName = form.fullName || form.name || 'User';

  return (
    <div className="row g-4">
      {/* Profile Summary Side Card */}
      <div className="col-lg-4">
        <div className="hs-glass-card p-4 text-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold"
            style={{
              width: 90,
              height: 90,
              fontSize: '1.8rem',
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--hs-primary)',
              border: '2px solid var(--hs-primary)',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h5 className="fw-bold mb-1 text-white">{displayName}</h5>
          <p className="text-secondary small font-monospace">{form.email}</p>
          <span className="hs-badge-accent py-0 px-2 text-uppercase" style={{ fontSize: '0.72rem' }}>
            {user.role || 'Candidate'}
          </span>

          <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary small">Dossier Completeness</span>
              <span className="text-info small fw-bold">{completion}%</span>
            </div>
            <div
              className="progress"
              style={{ height: 6, background: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${completion}%`,
                  background: 'linear-gradient(90deg, var(--hs-primary), var(--hs-accent))'
                }}
              ></div>
            </div>
            <p className="small text-secondary mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
              Optimizing your profile index helps matching algorithms prioritize your dossier.
            </p>
          </div>

          <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
            <button
              className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleDeleteAccount}
              disabled={deleting}
            >
              <i className="bi bi-trash3"></i>
              {deleting ? 'Deleting Account...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="col-lg-8">
        <div className="hs-glass-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0 text-white">Dossier Specifications</h5>
            {!editing && (
              <button
                className="btn btn-hs-outline btn-sm d-flex align-items-center gap-2"
                onClick={() => setEditing(true)}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-pencil-fill text-info"></i> Edit Details
              </button>
            )}
          </div>

          {saved && (
            <div className="alert alert-success py-2 d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-check-circle-fill"></i> Parameters updated and persisted to MongoDB!
            </div>
          )}
          {error && (
            <div className="alert alert-danger py-2 d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="row g-3">
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                editing={editing}
              />
              <Field
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                editing={false}
              />
              <Field
                label="Mobile Contact"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                editing={editing}
              />
              <Field
                label="Geographic Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                editing={editing}
              />
              <Field
                label="Educational Credentials"
                name="education"
                value={form.education}
                onChange={handleChange}
                editing={editing}
                placeholder="e.g. B.Tech Computer Science, Stanford"
              />
              <Field
                label="Professional Experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                editing={editing}
                placeholder="e.g. 3+ Years Full Stack Engineer"
              />
              <Field
                label="Competencies / Skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                editing={editing}
                full
                placeholder="React, Node.js, Python, Docker, MongoDB"
              />
              <Field
                label="Resume URL"
                name="resumeUrl"
                value={form.resumeUrl}
                onChange={handleChange}
                editing={editing}
                placeholder="https://example.com/resume.pdf"
              />
              <Field
                label="Portfolio URL"
                name="portfolioUrl"
                value={form.portfolioUrl}
                onChange={handleChange}
                editing={editing}
                placeholder="https://yourportfolio.dev"
              />
              <Field
                label="GitHub URL"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                editing={editing}
                placeholder="https://github.com/username"
              />
              <Field
                label="LinkedIn URL"
                name="linkedinUrl"
                value={form.linkedinUrl}
                onChange={handleChange}
                editing={editing}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {editing && (
              <div className="d-flex gap-3 mt-4 pt-3 border-top border-secondary border-opacity-10">
                <button type="submit" className="btn btn-hs-glow btn-sm px-4">
                  Commit Parameters
                </button>
                <button
                  type="button"
                  className="btn btn-hs-outline btn-sm px-4"
                  onClick={() => {
                    setForm({ ...user });
                    setEditing(false);
                    setError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, editing, full, placeholder }) {
  return (
    <div className={full ? 'col-12' : 'col-md-6'}>
      {editing ? (
        <Form
          label={label}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <div
          className="p-3 rounded-3"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)'
          }}
        >
          <label
            className="form-label text-secondary small d-block mb-1 font-monospace text-uppercase"
            style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}
          >
            {label}
          </label>
          <p className="mb-0 text-white fw-medium" style={{ fontSize: '0.92rem' }}>
            {value ? (
              value.startsWith('http') ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info text-decoration-none"
                >
                  {value} <i className="bi bi-box-arrow-up-right small"></i>
                </a>
              ) : (
                value
              )
            ) : (
              <span className="text-muted font-monospace italic">Empty Parameter</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
