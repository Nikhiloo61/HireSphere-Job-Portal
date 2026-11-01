import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function Register({ users, onAuthSuccess }) {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="row hs-glass-card g-0 overflow-hidden">
          {/* Left Branding Info Side */}
          <div className="col-lg-6 p-4 p-md-5 hs-auth-left d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-4">
                <h4 className="fw-bold mb-0 text-gradient">HIRESPHERE</h4>
              </div>
              <h1 className="display-6 fw-bold mb-3 text-white">
                Launch your command center.
              </h1>
              <p className="text-secondary mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                Join HireSphere to access advanced career tools, track active submissions, and build a digital dossier that highlights your expertise.
              </p>
              
              <div className="mt-2">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-shield-check text-info fs-5 me-3"></i>
                  <div>
                    <h6 className="text-white mb-0">Secure Verification</h6>
                    <small className="text-muted">Direct authentication and local security credentials.</small>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-bar-chart text-info fs-5 me-3"></i>
                  <div>
                    <h6 className="text-white mb-0">Real-time Metrics</h6>
                    <small className="text-muted">Watch your applications progress seamlessly.</small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="bi bi-lightning text-info fs-5 me-3"></i>
                  <div>
                    <h6 className="text-white mb-0">Instant Matchmaking</h6>
                    <small className="text-muted">Get immediately matched with relevant job opportunities.</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-top border-secondary opacity-25">
              <small className="text-muted">HIRESPHERE Career Intelligence Portal v1.0.0</small>
            </div>
          </div>

          {/* Right Registration Form Side */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center">
            <h3 className="fw-bold mb-1 text-white">Create Command Dossier</h3>
            <p className="text-muted mb-4 small">Configure system settings and personal profile parameters.</p>
            
            <RegistrationForm  onAuthSuccess={onAuthSuccess} />
            
            <div className="text-center mt-4">
              <span className="text-muted small">Already have a dossier? </span>
              <Link to="/login" className="text-info small fw-semibold text-decoration-none">
                Access Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
