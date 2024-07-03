import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';


function Home() {
    return (
        <div className="App">
            <Container className="text-center">
                <h1 className="text-white fade-in-down">
                    Welcome to TaskMaster - Your Ultimate Todo List App
                </h1>
                <p className="text-white fade-in-up paragraph-gap">
                    Take control of your day like never before. TaskMaster empowers you to
                    organize your tasks seamlessly, so you can focus on what truly matters. 
                    Whether it's conquering your daily chores, meeting project deadlines, or 
                    planning your next adventure, TaskMaster is your trusted companion.
                </p>
                <Row className="mt-4 fade-in-up">
                    <Col xs={12} md={6} className="mb-4 mb-md-0">
                        <h2 className="text-white">New to TaskMaster?</h2>
                        <p className="text-white">
                            Join with the users who have transformed their productivity 
                            with TaskMaster. Sign up now!
                        </p>
                        <Link to="/signup">
                            <Button variant="light" className="custom-button">Signup</Button>
                        </Link>
                    </Col>
                    <Col xs={12} md={6} className="mb-4 mb-md-0">
                        <h2 className="text-white">Already using TaskMaster?</h2>
                        <p className="text-white">
                            Welcome back! Dive into your tasks and let TaskMaster guide you 
                            through your journey towards success.
                        </p>
                        <Link to="/login">
                            <Button variant="light" className="custom-button">Login</Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;