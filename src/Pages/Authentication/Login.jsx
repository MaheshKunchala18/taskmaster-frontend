import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import './LoginSignup.css';



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showImage, setShowImage] = useState(true);
    const [showPassword, setShowPassword] = useState(false);  // Flips EyeIcon to show/hide password.

    const [invalidInput, setInvalidInput] = useState(false);  // When Email and Password not match, boxes animate.
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
                body: JSON.stringify({ email, password }) // Send email and password to server
            });

            if (response.ok) { // Check if response status is 200
                const data = await response.json();
                localStorage.setItem('userId', data.userId); // Save the user ID in local storage
                setUserId(data.userId); // Update the context state
                navigate('/tasks'); // Redirect to /tasks page
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
            <Row style={{ height: '100vh' }}>
                {showImage && (<Col className='bg-img' xs={12} sm={3} md={5} />)}
                <Col xs={12} sm={showImage ? 9 : 12} md={showImage ? 7 : 12} className="form-container">
                    <Container>
                        <Row className="justify-content-center">
                            <Col className="text-center mb-3">
                                <img src="./LockIcon.png" alt="Lock Icon" width={64} />
                                <h1 className="form-heading">Log In</h1>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8}>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
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
                                    </Form.Group>


                                    <Form.Group className="mb-4" controlId="formBasicPassword">
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
                                    </Form.Group>


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

                                <Row className="mt-3">
                                    <Col className="text-center">
                                        <p style={{ fontSize: '1.5rem' }}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}


export default Login;