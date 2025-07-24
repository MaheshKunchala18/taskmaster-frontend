import React, { useMemo, memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = memo(() => {
  const { theme, toggleTheme, isLoading } = useTheme();

  const accessibilityText = useMemo(() => 
    `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
    [theme]
  );

  const themeIcon = useMemo(() => {
    if (theme === 'light') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
        </svg>
      );
    }
  }, [theme]);

  const labelText = useMemo(() => 
    theme === 'light' ? 'Light' : 'Dark',
    [theme]
  );

  const buttonClass = useMemo(() => 
    `theme-toggle ${theme}`,
    [theme]
  );

  if (isLoading) {
    return null;
  }

  return (
    <button
      className={buttonClass}
      onClick={toggleTheme}
      aria-label={accessibilityText}
      title={accessibilityText}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <div className="theme-icon">
            {themeIcon}
          </div>
        </div>
      </div>
      <span className="theme-toggle-label">
        {labelText}
      </span>
    </button>
  );
}, () => {
  return false;
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle; 