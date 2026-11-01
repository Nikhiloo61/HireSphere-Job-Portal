import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const displayName = user?.fullName || user?.name || 'User';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const userRole = user?.role ? user.role.toUpperCase() : 'CANDIDATE';

  return (
    <nav className="navbar navbar-expand-lg hs-navbar sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fs-4" to="/dashboard">
          HIRESPHERE
        </Link>

        {/* Customized mobile menu toggler */}
        <button
          className="navbar-toggler border-0 text-white p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hsNavContent"
          aria-controls="hsNavContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ outline: 'none', boxShadow: 'none' }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        <div className="collapse navbar-collapse" id="hsNavContent">
          <ul className="navbar-nav me-auto ms-lg-4 mt-3 mt-lg-0 gap-1">
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/dashboard">
                <i className="bi bi-grid-1x2-fill me-2"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/jobs">
                <i className="bi bi-compass-fill me-2"></i> Explore Jobs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/applications">
                <i className="bi bi-folder-fill me-2"></i>{' '}
                {user?.role === 'recruiter' ? 'Applicants' : 'Applications'}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center" to="/profile">
                <i className="bi bi-person-fill-gear me-2"></i> Profile
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center mt-3 mt-lg-0 gap-3 border-top border-secondary pt-3 pt-lg-0 border-lg-0 mt-lg-0">
            <span
              className="hs-badge-accent py-1 px-2 d-none d-md-inline"
              style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
            >
              {userRole}
            </span>

            <div className="dropdown">
              <button
                className="btn btn-sm d-flex align-items-center gap-2 dropdown-toggle text-white border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '30px',
                  padding: '6px 16px'
                }}
              >
                <div
                  className="profile-ring d-inline-flex align-items-center justify-content-center rounded-circle fw-bold"
                  style={{
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: 'var(--hs-primary)',
                    border: '1px solid rgba(139, 92, 246, 0.4)'
                  }}
                >
                  {initials}
                </div>
                <span className="d-none d-sm-inline font-monospace text-secondary small">
                  {displayName}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark hs-glass-card mt-2 border-secondary shadow-lg">
                <li>
                  <Link className="dropdown-item py-2 d-flex align-items-center" to="/profile">
                    <i className="bi bi-person me-2 text-info"></i>My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item py-2 d-flex align-items-center" to="/dashboard">
                    <i className="bi bi-speedometer2 me-2 text-info"></i>Command Center
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider border-secondary" />
                </li>
                <li>
                  <button
                    className="dropdown-item py-2 d-flex align-items-center text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Logout System
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
