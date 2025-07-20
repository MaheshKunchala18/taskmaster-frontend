import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
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
    const [strength, setStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { setUserId } = useContext(AuthContext);

    const calculateStrength = (password) => {
        let strength = 0;
        const criteria = [
            (password) => password.length > 4,
            (password) => /\d/.test(password),
            (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/.test(password),
            (password) => /[A-Z]/.test(password),
        ];
        criteria.forEach((test) => test(password) && strength++);
        return strength;
    };

    const handlePasswordChange = (event) => {
        const password = event.target.value;
        setPassword(password);
        setStrength(calculateStrength(password));
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    let variant;
    if (strength <= 1) variant = 'danger';
    else if (strength <= 2) variant = 'warning';
    else if (strength <= 3) variant = 'info';
    else variant = 'success';

    const passwordStrengthMessage =
        strength === 0 ? 'Password Strength' : strength === 1 ? 'Very Weak' : strength === 2 ? 'Weak' : strength === 3 ? 'Good' : 'Strong';

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setInvalidInput(true);
            setTimeout(() => setInvalidInput(false), 1000);
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
                navigate('/tasks');
            } else {
                console.error('Signup failed');
            }

        } catch (error) {
            console.error('Error signing up:', error);
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

    return (
        <Container fluid>
            <div className="theme-toggle-container">
                <ThemeToggle />
            </div>
            <Row style={{ height: '100vh' }}>
                {showImage && (
                    <Col className='bg-img' xs={12} sm={3} md={5}>
                        <div className="auth-particles">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="auth-particle"></div>
                            ))}
                        </div>
                        <div className="auth-illustration">
                            <div className="auth-illustration-icon">
                                🚀
                            </div>
                            <h2>Join TaskMaster</h2>
                            <p>Create your account to start organizing your tasks and boost your productivity today.</p>
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
                                        <h1 className="form-heading">Sign Up</h1>
                                    </div>
                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Col>
                                            <div className="modern-input-group">
                                                <Form.Label>
                                                    <span className="required-field">First Name</span> <span style={{ color: 'red' }}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter first name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                    className="input-container"
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="modern-input-group">
                                                <Form.Label>
                                                    <span className="required-field">Last Name</span> <span style={{ color: 'red' }}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                    className="input-container"
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="modern-input-group">
                                        <Form.Label>
                                            <span className="required-field">Email Address</span> <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="input-container"
                                        />
                                    </div>

                                    <div className="modern-input-group">
                                        <Form.Label>
                                            <span className="required-field">Password</span> <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                required
                                                className={`input-container ${invalidInput ? 'shake' : ''}`}
                                            />
                                            <div className="password-toggle-icon" onClick={handleTogglePasswordVisibility}>
                                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                                            </div>
                                        </div>
                                        <p style={{marginBottom: '4px', fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)'}} >Password Strength</p>
                                        <ProgressBar className="mb-1" striped variant={variant} now={(strength / 4) * 100} label={passwordStrengthMessage} style={{height: '6px'}} />
                                    </div>

                                    <div className="modern-input-group">
                                        <Form.Label>
                                            <span className="required-field">Confirm Password</span> <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className={`input-container ${invalidInput ? 'shake' : ''}`}
                                        />
                                    </div>

                                    <Button variant="primary" type="submit" size="lg" className="submit-button">
                                        SIGN UP
                                    </Button>
                                </Form>
                                    <div className="text-center auth-link-text">
                                        <p>
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