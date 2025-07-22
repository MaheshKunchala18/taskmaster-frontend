import React from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password, strength }) => {
  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return 'Enter a password';
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Enter a password';
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return 'var(--color-text-tertiary)';
      case 1:
        return 'var(--color-error)';
      case 2:
        return '#ff9500';
      case 3:
        return '#007AFF';
      case 4:
        return 'var(--color-success)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const requirements = [
    { 
      test: (pwd) => pwd.length >= 6, 
      text: 'At least 6 characters',
      icon: '📏'
    },
    { 
      test: (pwd) => /[A-Z]/.test(pwd), 
      text: 'One uppercase letter',
      icon: '🔤'
    },
    { 
      test: (pwd) => /[0-9]/.test(pwd), 
      text: 'One number',
      icon: '🔢'
    },
    { 
      test: (pwd) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(pwd), 
      text: 'One special character',
      icon: '🔣'
    }
  ];

  return (
    <div className="password-strength-container">
      <div className="password-strength-header">
        <span className="password-strength-label">Password Strength</span>
        <span 
          className="password-strength-text"
          style={{ color: getStrengthColor(strength) }}
        >
          {getStrengthText(strength)}
        </span>
      </div>
      
      <div className="password-strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`password-strength-bar ${
              strength >= level ? 'active' : ''
            }`}
            style={{
              backgroundColor: strength >= level 
                ? getStrengthColor(strength) 
                : 'var(--color-border)',
              animationDelay: `${level * 0.1}s`
            }}
          />
        ))}
      </div>

      {password && (
        <div className="password-requirements">
          {requirements.map((req, index) => (
            <div
              key={index}
              className={`password-requirement ${
                req.test(password) ? 'met' : ''
              }`}
            >
              <span className="requirement-icon">
                {req.test(password) ? '✅' : req.icon}
              </span>
              <span className="requirement-text">{req.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrength; 