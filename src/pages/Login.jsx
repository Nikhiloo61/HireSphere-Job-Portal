import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function Login({ users, onAuthSuccess }) {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="row hs-glass-card g-0 overflow-hidden">
          {/* Left Branding Side */}
          <div className="col-lg-6 p-4 p-md-5 hs-auth-left d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-gradient">HIRESPHERE</h4>
              </div>
              <h1 className="display-6 fw-bold mb-3 text-white">
                Navigate your career with intelligence.
              </h1>
              <p className="text-secondary mb-5" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                HireSphere is a premium AI-inspired career command center designed to optimize your job hunt, analyze opportunities, and streamline your applications.
              </p>
            </div>
            
            {/* Quick Statistics */}
            <div className="row g-3">
              <div className="col-4">
                <h3 className="fw-bold text-info mb-0">2,500+</h3>
                <small className="text-muted">Opportunities</small>
              </div>
              <div className="col-4">
                <h3 className="fw-bold text-info mb-0">500+</h3>
                <small className="text-muted">Companies</small>
              </div>
              <div className="col-4">
                <h3 className="fw-bold text-info mb-0">10+</h3>
                <small className="text-muted">Categories</small>
              </div>
            </div>
          </div>

          {/* Right Login Form Side */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center">
            <h3 className="fw-bold mb-1 text-white">Access Portal</h3>
            <p className="text-muted mb-4 small">Enter security credentials to authenticate.</p>
            
            <LoginForm  onAuthSuccess={onAuthSuccess} />
            
            <div className="text-center mt-4">
              <span className="text-muted small">New to the platform? </span>
              <Link to="/register" className="text-info small fw-semibold text-decoration-none">
                Register Command Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
