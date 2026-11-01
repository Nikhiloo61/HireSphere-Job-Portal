import React from 'react';

export default function DashboardCard({ icon, label, value, accentColor = 'cyan' }) {
  const isViolet = accentColor === 'violet';
  const accentClass = isViolet ? 'text-gradient-purple' : 'text-gradient';
  const borderStyle = isViolet 
    ? 'rgba(139, 92, 246, 0.2)' 
    : 'rgba(6, 182, 212, 0.2)';

  return (
    <div className="col-md-4">
      <div 
        className="hs-glass-card p-4 d-flex justify-content-between align-items-center"
        style={{ borderLeft: `4px solid ${isViolet ? 'var(--hs-primary)' : 'var(--hs-accent)'}` }}
      >
        <div>
          <div className="text-uppercase text-secondary font-monospace tracking-wider mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
            {label}
          </div>
          <div className={`fs-1 fw-extrabold ${accentClass}`} style={{ lineHeight: '1.2' }}>
            {value}
          </div>
        </div>
        <div 
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{ 
            width: 48, 
            height: 48, 
            background: isViolet ? 'rgba(139, 92, 246, 0.1)' : 'rgba(6, 182, 212, 0.1)',
            color: isViolet ? 'var(--hs-primary)' : 'var(--hs-accent)',
            border: `1px solid ${borderStyle}`
          }}
        >
          <i className={`bi ${icon} fs-4`}></i>
        </div>
      </div>
    </div>
  );
}
