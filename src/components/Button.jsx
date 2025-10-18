import React from 'react';

export default function Button({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false, 
  className = '', 
  variant = 'primary' 
}) {
  const baseClasses = 'button';
  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    danger: 'button-danger'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    disabled ? 'button-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
