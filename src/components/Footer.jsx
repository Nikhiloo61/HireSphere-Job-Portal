import React from 'react';

export default function Footer() {
  return (
    <footer 
      className="py-4 mt-auto border-top border-secondary border-opacity-10"
      style={{ background: 'rgba(13, 15, 20, 0.95)' }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div className="d-flex align-items-center">
          <strong className="text-white">HIRESPHERE</strong>
          <span className="ms-2 small text-secondary">&copy; {new Date().getFullYear()} Career Intelligence. All rights reserved.</span>
        </div>
        <div className="d-flex gap-3 small">
          <a href="#!" className="text-secondary text-decoration-none hover-white">About System</a>
          <a href="#!" className="text-secondary text-decoration-none hover-white">Contact Terminal</a>
          <a href="#!" className="text-secondary text-decoration-none hover-white">Security Protocol</a>
        </div>
      </div>
    </footer>
  );
}
