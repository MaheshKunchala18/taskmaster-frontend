import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './LoginSignup.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showImage, setShowImage] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [invalidInput, setInvalidInput] = useState(false);
    const { setUserId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleResize = () => {
        setShowImage(window.innerWidth >= 700);
    };

    const handlePasswordChange = (event) => {
        const password = event.target.value;
        setPassword(password);
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userId', data.userId);
                setUserId(data.userId);
                navigate('/tasks');
            } else {
                console.error('Login failed');
                setInvalidInput(true);
                setTimeout(() => setInvalidInput(false), 1000);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

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
                                👋
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Sign in to access your productivity dashboard and manage your tasks efficiently.</p>
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
                                            🔓
                                        </div>
                                        <h1 className="form-heading">Log In</h1>
                                    </div>
                                <Form onSubmit={handleSubmit}>
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
                                            className={`input-container ${invalidInput ? 'shake' : ''}`}
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
                                    </div>

                                    <Form.Group className="mb-4" controlId="formBasicCheckbox">
                                        <Form.Check
                                            type="checkbox"
                                            label={<span style={{ fontSize: '1.2rem' }}>Remember me</span>}
                                            className='custom-checkbox'
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" size="lg" className="submit-button">
                                        LOG IN
                                    </Button>
                                </Form>

                                    <div className="text-center auth-link-text">
                                        <p>
                                            Don't have an account? <Link to="/signup">Sign Up</Link>
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

export default Login;