import React, { useState, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './FloatingLabelInput.css';

const FloatingLabelInput = ({
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    error = false,
    showPasswordToggle = false,
    icon = null,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    const isActive = isFocused || value;
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleLabelClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`floating-input-container ${error ? 'error' : ''} ${isActive ? 'active' : ''}`}>
            {icon && (
                <div className="floating-input-icon">
                    {icon}
                </div>
            )}

            <input
                ref={inputRef}
                type={inputType}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="floating-input"
                required={required}
                {...props}
            />

            <label
                className={`floating-label ${isActive ? 'float' : ''}`}
                onClick={handleLabelClick}
            >
                {label}
                {required && <span className="required-asterisk">*</span>}
            </label>

            {showPasswordToggle && type === 'password' && (
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
            )}

            <div className="floating-input-border"></div>
            <div className="floating-input-focus-border"></div>
        </div>
    );
};

export default FloatingLabelInput; 