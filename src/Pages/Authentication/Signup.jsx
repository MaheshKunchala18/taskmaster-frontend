import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import FloatingLabelInput from '../../components/FloatingLabelInput/FloatingLabelInput';
import ModernButton from '../../components/ModernButton/ModernButton';
import PasswordStrength from '../../components/PasswordStrength/PasswordStrength';
import axios from "axios";
import './LoginSignup.css';

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showImage, setShowImage] = useState(true);
    const [invalidInput, setInvalidInput] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [strength, setStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { setUserId } = useContext(AuthContext);

    const calculateStrength = (password) => {
        let strength = 0;
        const criteria = [
            (password) => password.length >= 6,
            (password) => /\d/.test(password),
            (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/.test(password),
            (password) => /[A-Z]/.test(password),
        ];
        criteria.forEach((test) => test(password) && strength++);
        return strength;
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setStrength(calculateStrength(newPassword));
        setPasswordError('');


        if (confirmPassword && newPassword === confirmPassword) {
            setInvalidInput(false);
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const newConfirmPassword = event.target.value;
        setConfirmPassword(newConfirmPassword);

        if (password && newConfirmPassword && password !== newConfirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        if (newEmail && !validateEmail(newEmail)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setInvalidInput(false);
        setPasswordError('');
        setEmailError('');

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            setInvalidInput(true);
            setIsLoading(false);
            return;
        }

        if (strength < 2) {
            setPasswordError('Please choose a stronger password');
            setInvalidInput(true);
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            setInvalidInput(true);
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            });

            if (response.status === 201) {
                const userId = response.data.userId;
                localStorage.setItem('userId', userId);
                setUserId(userId);

                setTimeout(() => {
                    navigate('/tasks');
                }, 800);
            } else {
                console.error('Signup failed');
                setInvalidInput(true);
            }

        } catch (error) {
            console.error('Error signing up:', error);
            if (error.response?.status === 409) {
                setEmailError('An account with this email already exists');
            } else {
                setInvalidInput(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResize = () => {
        setShowImage(window.innerWidth >= 700);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isFormValid = firstName && lastName && email && password && confirmPassword &&
        password === confirmPassword && strength >= 2 &&
        !emailError && !passwordError;

    return (
        <Container fluid>
            <div className="theme-toggle-container">
                <ThemeToggle />
            </div>
            <Row style={{ height: '100vh' }}>
                {showImage && (
                    <Col className='bg-img' xs={12} sm={3} md={5}>
                        <div className="auth-illustration">
                            <div className="auth-illustration-icon">
                                🚀
                            </div>
                            <h2>Join TaskMaster</h2>
                            <p>Create your account to start organizing your tasks and boost your productivity with our modern, intuitive interface.</p>
                        </div>
                    </Col>
                )}
                <Col xs={12} sm={showImage ? 9 : 12} md={showImage ? 7 : 12} className="form-container">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <div className="modern-form-container">
                                    <div className="modern-form-header">
                                        <div className="modern-lock-icon">
                                            👤
                                        </div>
                                        <h1 className="form-heading">Create Account</h1>
                                    </div>

                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col>
                                                <FloatingLabelInput
                                                    label="First Name"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                    icon={<FaUser />}
                                                    placeholder="Enter your first name"
                                                />
                                            </Col>
                                            <Col>
                                                <FloatingLabelInput
                                                    label="Last Name"
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                    icon={<FaUser />}
                                                    placeholder="Enter your last name"
                                                />
                                            </Col>
                                        </Row>

                                        <FloatingLabelInput
                                            label="Email Address"
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                            error={!!emailError}
                                            icon={<FaEnvelope />}
                                            placeholder="Enter your email"
                                        />

                                        {emailError && (
                                            <div style={{
                                                color: 'var(--color-error)',
                                                fontSize: '0.8rem',
                                                marginTop: '-1rem',
                                                marginBottom: '1rem',
                                                paddingLeft: '3rem',
                                                animation: 'shake 0.5s ease-in-out'
                                            }}>
                                                {emailError}
                                            </div>
                                        )}

                                        <FloatingLabelInput
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                            error={!!passwordError}
                                            showPasswordToggle={true}
                                            icon={<FaLock />}
                                            placeholder="Create a strong password"
                                        />

                                        {password && (
                                            <PasswordStrength
                                                password={password}
                                                strength={strength}
                                            />
                                        )}

                                        <FloatingLabelInput
                                            label="Confirm Password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            required
                                            error={!!passwordError}
                                            icon={<FaLock />}
                                            placeholder="Confirm your password"
                                        />

                                        {passwordError && (
                                            <div style={{
                                                color: 'var(--color-error)',
                                                fontSize: '0.8rem',
                                                marginTop: '-1rem',
                                                marginBottom: '1rem',
                                                paddingLeft: '3rem',
                                                animation: 'shake 0.5s ease-in-out'
                                            }}>
                                                {passwordError}
                                            </div>
                                        )}

                                        {invalidInput && !passwordError && !emailError && (
                                            <div style={{
                                                background: 'rgba(255, 59, 48, 0.1)',
                                                border: '1px solid rgba(255, 59, 48, 0.3)',
                                                borderRadius: '8px',
                                                padding: '0.75rem',
                                                marginBottom: '1rem',
                                                color: 'var(--color-error)',
                                                fontSize: '0.875rem',
                                                textAlign: 'center',
                                                animation: 'shake 0.5s ease-in-out'
                                            }}>
                                                ❌ Please accept the terms and conditions to continue.
                                            </div>
                                        )}

                                        <ModernButton
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            loading={isLoading}
                                            disabled={!isFormValid}
                                        >
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
                                        </ModernButton>
                                    </Form>

                                    <div className="auth-link-text">
                                        <p className='mb-1'>
                                            Already have an account? <Link to="/login">Log In</Link>
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;