import React from 'react';

// A single reusable, controlled form field with Bootstrap validation
// styling built in. RegistrationForm, LoginForm and Profile all use this
// one component instead of repeating <label>/<input>/<div> markup, so
// every field in the app is validated and styled the same way.
//
// Props:
//   label        - text shown above the field
//   type         - 'text' | 'email' | 'tel' | 'password' | 'checkbox' (default 'text')
//   as           - 'input' (default) or 'select'
//   options      - array of option strings, required when as="select"
//   name         - used for the input's name/id and to read form[name]
//   value        - current controlled value
//   checked      - current controlled checked state (checkboxes only)
//   onChange     - change handler (usually a shared handleChange from the form)
//   error        - validation message string, shows a red is-invalid state
//   validated    - true once the form has been submitted once (shows green is-valid on clean fields)
//   placeholder  - input placeholder text
export default function Form({
  label, type = 'text', as = 'input', options = [],
  name, value, checked, onChange, error, validated, placeholder
}) {
  const validationClass = error ? 'is-invalid' : (validated ? 'is-valid' : '');

  if (type === 'checkbox') {
    return (
      <>
        <input
          type="checkbox"
          id={name}
          name={name}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          checked={checked}
          onChange={onChange}
        />
        <label className="form-check-label small" htmlFor={name}>{label}</label>
        <div className="invalid-feedback">{error}</div>
      </>
    );
  }

  return (
    <>
      {label && <label className="form-label" htmlFor={name}>{label}</label>}

      {as === 'select' ? (
        <select id={name} name={name} className={`form-select ${validationClass}`} value={value} onChange={onChange}>
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          className={`form-control ${validationClass}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      <div className="invalid-feedback">{error}</div>
    </>
  );
}
