import React, { useState, useRef } from 'react';
import './ModernButton.css';

const ModernButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'lg',
  loading = false,
  disabled = false,
  icon = null,
  ripple = true,
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    if (disabled || loading) return;

    if (ripple) {
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const newRipple = {
        x,
        y,
        size,
        key: Date.now()
      };

      setRipples(prev => [...prev, newRipple]);


      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.key !== newRipple.key));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const buttonClasses = [
    'modern-button',
    `modern-button--${variant}`,
    `modern-button--${size}`,
    loading ? 'modern-button--loading' : '',
    disabled ? 'modern-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      <div className="modern-button__content">
        {loading && (
          <div className="modern-button__loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
        )}
        
        {icon && !loading && (
          <span className="modern-button__icon">
            {icon}
          </span>
        )}
        
        <span className={`modern-button__text ${loading ? 'modern-button__text--loading' : ''}`}>
          {children}
        </span>
      </div>

      {ripple && (
        <div className="modern-button__ripples">
          {ripples.map(ripple => (
            <span
              key={ripple.key}
              className="modern-button__ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
        </div>
      )}

      <div className="modern-button__glow"></div>
    </button>
  );
};

export default ModernButton; 