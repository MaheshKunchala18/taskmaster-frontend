import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import FloatingLabelInput from '../../components/FloatingLabelInput/FloatingLabelInput';
import ModernButton from '../../components/ModernButton/ModernButton';
import './LoginSignup.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showImage, setShowImage] = useState(true);
    const [invalidInput, setInvalidInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { setUserId } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setInvalidInput(false);

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
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                setUserId(data.userId);
                
                // Add a small delay for better UX
                setTimeout(() => {
                    navigate('/tasks');
                }, 800);
            } else {
                console.error('Login failed');
                setInvalidInput(true);
                setTimeout(() => setInvalidInput(false), 3000);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setInvalidInput(true);
            setTimeout(() => setInvalidInput(false), 3000);
        } finally {
            setIsLoading(false);
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
                            <p>Sign in to access your productivity dashboard and manage your tasks efficiently with our modern interface.</p>
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
                                        <h1 className="form-heading">Welcome Back</h1>
                                        <p style={{ 
                                            color: 'var(--color-text-secondary)', 
                                            margin: '0.5rem 0 0 0',
                                            fontSize: '0.95rem',
                                            opacity: 0.8
                                        }}>
                                            Sign in to continue to your account
                                        </p>
                                    </div>

                                    <Form onSubmit={handleSubmit}>
                                        <FloatingLabelInput
                                            label="Email Address"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            error={invalidInput}
                                            icon={<FaEnvelope />}
                                            placeholder="Enter your email"
                                        />

                                        <FloatingLabelInput
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            error={invalidInput}
                                            showPasswordToggle={true}
                                            icon={<FaLock />}
                                            placeholder="Enter your password"
                                        />

                                        <Form.Group className="mb-4" controlId="formBasicCheckbox">
                                            <Form.Check
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                label={
                                                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                                                        Remember me for 30 days
                                                    </span>
                                                }
                                                className='custom-checkbox'
                                            />
                                        </Form.Group>

                                        {invalidInput && (
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
                                                ❌ Invalid email or password. Please try again.
                                            </div>
                                        )}

                                        <ModernButton
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            loading={isLoading}
                                            disabled={!email || !password}
                                        >
                                            {isLoading ? 'Signing In...' : 'Sign In'}
                                        </ModernButton>
                                    </Form>

                                    <div className="auth-link-text">
                                        <p>
                                            Don't have an account? <Link to="/signup">Create Account</Link>
                                        </p>
                                        <p style={{ marginTop: '0.5rem' }}>
                                            <Link to="/forgot-password" style={{ fontSize: '0.875rem' }}>
                                                Forgot your password?
                                            </Link>
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