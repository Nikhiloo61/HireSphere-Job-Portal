import React from 'react';

export default function SearchFilter({ filters, onChange, onClear, locations, jobTypes, experienceLevels }) {
  const handleField = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="hs-glass-card p-4 mb-4">
      <div className="row g-3 align-items-end">
        {/* Search */}
        <div className="col-lg-4">
          <label className="form-label small fw-semibold text-secondary">Search Command</label>
          <div className="input-group">
            <span 
              className="input-group-text border-secondary border-opacity-25 text-secondary"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search roles, skills or company..." 
              value={filters.search} 
              onChange={handleField('search')} 
            />
          </div>
        </div>

        {/* Location */}
        <div className="col-6 col-lg-2">
          <label className="form-label small fw-semibold text-secondary">Location</label>
          <select className="form-select" value={filters.location} onChange={handleField('location')}>
            <option value="">All Locations</option>
            {locations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
          </select>
        </div>

        {/* Job Type */}
        <div className="col-6 col-lg-2">
          <label className="form-label small fw-semibold text-secondary">Employment Type</label>
          <select className="form-select" value={filters.type} onChange={handleField('type')}>
            <option value="">All Types</option>
            {jobTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        {/* Experience */}
        <div className="col-6 col-lg-2">
          <label className="form-label small fw-semibold text-secondary">Experience</label>
          <select className="form-select" value={filters.experienceLevel} onChange={handleField('experienceLevel')}>
            <option value="">All Levels</option>
            {experienceLevels.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
          </select>
        </div>

        {/* Max Salary */}
        <div className="col-6 col-lg-2">
          <div className="d-flex justify-content-between">
            <label className="form-label small fw-semibold text-secondary">Max Budget</label>
            <span className="text-info small fw-bold">{filters.maxSalary} LPA</span>
          </div>
          <input 
            type="range" 
            className="form-range mt-2" 
            min="2" 
            max="25" 
            step="1" 
            value={filters.maxSalary} 
            onChange={handleField('maxSalary')} 
            style={{ accentColor: 'var(--hs-accent)' }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button 
          type="button" 
          className="btn btn-hs-outline btn-sm d-flex align-items-center gap-2" 
          onClick={onClear}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-x-circle text-info"></i> Reset Filters
        </button>
      </div>
    </div>
  );
}
