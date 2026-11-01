import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import api from '../api';

export default function RegistrationForm({ onAuthSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email address.';
    if (form.password.length < 6) err.password = 'Password must be at least 6 characters.';
    if (!form.terms) err.terms = 'You must agree to the terms.';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setRegisterError('');
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: form.name,
        fullName: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      onAuthSuccess(res.data);
      navigate('/dashboard');
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
      {registerError && <div className="alert alert-danger py-2">{registerError}</div>}

      <div className="mb-3">
        <Form
          label="Full Name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          validated={validated}
          placeholder="e.g. Alex Chen"
        />
      </div>

      <div className="mb-3">
        <Form
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          validated={validated}
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-3">
        <Form
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          validated={validated}
          placeholder="At least 6 characters"
        />
      </div>

      <div className="mb-3">
        <label className="form-label text-secondary small fw-semibold">Account Purpose</label>
        <select
          className="form-select"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="candidate">Candidate (Seeking Opportunities)</option>
          <option value="recruiter">Recruiter (Hiring & Posting Jobs)</option>
        </select>
      </div>

      <div className="form-check mb-4">
        <input
          type="checkbox"
          name="terms"
          className="form-check-input"
          id="termsCheck"
          checked={form.terms}
          onChange={handleChange}
          required
        />
        <label className="form-check-label small text-secondary" htmlFor="termsCheck">
          I accept the <a href="#!" className="text-info text-decoration-none">Terms of Service</a> & <a href="#!" className="text-info text-decoration-none">Privacy Policy</a>
        </label>
        {validated && errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
      </div>

      <button type="submit" className="btn btn-hs-glow w-100" disabled={loading}>
        {loading ? (
          <span>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Initializing Command Dossier...
          </span>
        ) : (
          'Initialize Command Dossier'
        )}
      </button>
    </form>
  );
}
