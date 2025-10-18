import React from 'react';

export default function FormField({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  options = [],
  autoFocus = false
}) {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            autoFocus={autoFocus}
            className={`form-input ${error ? 'error' : ''}`}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className={`form-input ${error ? 'error' : ''}`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            autoFocus={autoFocus}
            className={`form-input ${error ? 'error' : ''}`}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div className="field-error">
          {error}
        </div>
      )}
    </div>
  );
}
