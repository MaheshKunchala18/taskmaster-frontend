import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import axios from "axios";
import './LoginSignup.css';



function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showImage, setShowImage] = useState(true);         // When the device-width is < 700px. It removes the image.
    const [invalidInput, setInvalidInput] = useState(false);  // When Password and Confirm Password not matches, boxes animate.
    const [strength, setStrength] = useState(0);              // Whenever user enters password, progress bar changes.
    const [showPassword, setShowPassword] = useState(false);  // Flips EyeIcon to show/hide password.

    const navigate = useNavigate();  // Redirects to another page upon successful signup
    const { setUserId } = useContext(AuthContext);  // Assuming you have setUserId in context


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
    if (strength <= 1) variant = 'danger'; // very weak
    else if (strength <= 2) variant = 'warning'; // weak
    else if (strength <= 3) variant = 'info'; // good
    else variant = 'success'; // strong

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
                localStorage.setItem('userId', userId); // Store userId in local storage
                setUserId(userId); // Update context
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
            <Row style={{ height: '100vh' }}>
                {showImage && (<Col className='bg-img' xs={12} sm={3} md={5} />)}
                <Col xs={12} sm={showImage ? 9 : 12} md={showImage ? 7 : 12} className="form-container">
                    <Container>
                        <Row className="justify-content-center">
                            <Col className="text-center mt-2 mb-1">
                                <img src="./LockIcon.png" alt="Lock Icon" width={64} />
                                <h1 className="form-heading">Sign Up</h1>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formBasicFirstName">
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
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formBasicLastName">
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
                                        </Form.Group>
                                    </Row>
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
                                            className="input-container"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
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

                                    <p style={{marginBottom: '2px', fontSize: '15px', fontWeight: '400'}} >Password Strength</p>
                                    <ProgressBar className="mb-3" striped variant={variant} now={(strength / 4) * 100} label={passwordStrengthMessage} />


                                    <Form.Group className="mb-4" controlId="formConfirmPassword">
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
                                    </Form.Group>

                                    <Button variant="primary" type="submit" size="lg" className="submit-button">
                                        SIGN UP
                                    </Button>
                                </Form>
                                <Row className="mt-3">
                                    <Col className="text-center">
                                        <p className="mb-2" style={{ fontSize: '1.5rem' }}>Already have an account? <Link to="/login">Log In</Link></p>
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


export default Signup;