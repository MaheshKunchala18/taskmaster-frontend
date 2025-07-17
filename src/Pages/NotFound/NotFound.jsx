import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found-page">
            <Container className="text-center">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={8}>
                        <div className="not-found-content">
                            <h1 className="not-found-title">404</h1>
                            <h2 className="not-found-subtitle">Page Not Found</h2>
                            <p className="not-found-text">
                                Oops! The page you're looking for doesn't exist. 
                                It might have been moved, deleted, or you entered the wrong URL.
                            </p>
                            <div className="not-found-buttons">
                                <Link to="/">
                                    <Button variant="primary" size="lg" className="mx-3">
                                        Go Home
                                    </Button>
                                </Link>
                                <Link to="/tasks">
                                    <Button variant="primary" size="lg" className="mx-3">
                                        View Tasks
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default NotFound; 