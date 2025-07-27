import React, { useState, useRef, useCallback, useMemo, memo } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './FloatingLabelInput.css';

const FloatingLabelInput = memo(({
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

    const isActive = useMemo(() => isFocused || value, [isFocused, value]);
    const inputType = useMemo(() => 
        type === 'password' && showPassword ? 'text' : type, 
        [type, showPassword]
    );

    const containerClasses = useMemo(() => [
        'floating-input-container',
        error ? 'error' : '',
        isActive ? 'active' : ''
    ].filter(Boolean).join(' '), [error, isActive]);

    const labelClasses = useMemo(() => [
        'floating-label',
        isActive ? 'float' : ''
    ].filter(Boolean).join(' '), [isActive]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleLabelClick = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const passwordToggleIcon = useMemo(() => 
        showPassword ? <FaEye /> : <FaEyeSlash />, 
        [showPassword]
    );

    const passwordToggleAriaLabel = useMemo(() => 
        showPassword ? 'Hide password' : 'Show password', 
        [showPassword]
    );

    return (
        <div className={containerClasses}>
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
                className={labelClasses}
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
                    aria-label={passwordToggleAriaLabel}
                >
                    {passwordToggleIcon}
                </button>
            )}

            <div className="floating-input-border"></div>
            <div className="floating-input-focus-border"></div>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.label === nextProps.label &&
        prevProps.type === nextProps.type &&
        prevProps.value === nextProps.value &&
        prevProps.required === nextProps.required &&
        prevProps.error === nextProps.error &&
        prevProps.showPasswordToggle === nextProps.showPasswordToggle &&
        prevProps.icon === nextProps.icon &&
        prevProps.onChange === nextProps.onChange
    );
});

FloatingLabelInput.displayName = 'FloatingLabelInput';

export default FloatingLabelInput; 