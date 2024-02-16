import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingSpinner from './loadingSpinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/authenticate`, { username, password });
      localStorage.setItem('token', response.headers['authorization']);
      axios.defaults.headers.common['Authorization'] = response.headers['authorization'];
      navigate("/institutions")
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <LoadingSpinner />}
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="text-center">
            <img src="./mdsl.png" alt="Logo" className='login-logo' />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>
            {error && <div className="error-validation">{error}</div>}
            <Button variant="primary" type="submit" block className="mt-3" disabled={loading}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
