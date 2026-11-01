import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import api from '../api';

export default function LoginForm({ onAuthSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const err = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email address.';
    if (!form.password) err.password = 'Password is required.';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setLoginError('');
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      onAuthSuccess(res.data);
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
      {loginError && <div className="alert alert-danger py-2">{loginError}</div>}

      {/* Quick Demo Credentials Selector */}
      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className="btn btn-sm btn-hs-outline flex-fill text-nowrap"
          onClick={() =>
            setForm({ email: 'alex.chen@example.com', password: 'candidate123', remember: true })
          }
          style={{ fontSize: '0.75rem' }}
        >
          <i className="bi bi-person me-1"></i> Demo Candidate
        </button>
        <button
          type="button"
          className="btn btn-sm btn-hs-outline flex-fill text-nowrap"
          onClick={() =>
            setForm({ email: 'recruiter1@techcorp.com', password: 'recruiter123', remember: true })
          }
          style={{ fontSize: '0.75rem' }}
        >
          <i className="bi bi-building me-1"></i> Demo Recruiter
        </button>
      </div>

      <div className="mb-3">
        <Form
          label="Email"
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
          placeholder="Enter password"
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          name="remember"
          className="form-check-input"
          id="rememberCheck"
          checked={form.remember}
          onChange={handleChange}
        />
        <label className="form-check-label small" htmlFor="rememberCheck">
          Remember Me
        </label>
      </div>

      <button type="submit" className="btn btn-hs-glow w-100" disabled={loading}>
        {loading ? (
          <span>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Authenticating...
          </span>
        ) : (
          'Authenticate'
        )}
      </button>
    </form>
  );
}
