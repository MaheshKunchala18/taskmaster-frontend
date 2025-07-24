import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
import './ModernButton.css';

const ModernButton = memo(({ 
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

  const buttonClasses = useMemo(() => [
    'modern-button',
    `modern-button--${variant}`,
    `modern-button--${size}`,
    loading ? 'modern-button--loading' : '',
    disabled ? 'modern-button--disabled' : '',
    className
  ].filter(Boolean).join(' '), [variant, size, loading, disabled, className]);

  const removeRipple = useCallback((rippleKey) => {
    setRipples(prev => prev.filter(ripple => ripple.key !== rippleKey));
  }, []);

  const handleClick = useCallback((e) => {
    if (disabled || loading) return;

    if (ripple && buttonRef.current) {
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
        removeRipple(newRipple.key);
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  }, [disabled, loading, ripple, onClick, removeRipple]);

  const rippleElements = useMemo(() => 
    ripples.map(ripple => (
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
    )), [ripples]
  );

  const loaderElements = useMemo(() => (
    <>
      <div className="loader-ring"></div>
      <div className="loader-ring"></div>
      <div className="loader-ring"></div>
    </>
  ), []);

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
            {loaderElements}
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
          {rippleElements}
        </div>
      )}

      <div className="modern-button__glow"></div>
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.loading === nextProps.loading &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.ripple === nextProps.ripple &&
    prevProps.className === nextProps.className &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.type === nextProps.type
  );
});

ModernButton.displayName = 'ModernButton';

export default ModernButton; 