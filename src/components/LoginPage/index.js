import React, { useEffect, useRef, useContext } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Badge } from "react-bootstrap";
import './Login.css'; // Custom styles
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginStateContext } from "../../context/loginStateContext";
const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate=useNavigate();
  const {token,pending,error,setLoginError,setLoginPending,setToken}=useContext(LoginStateContext);
const fetchLoginInfo= async () => {
  try {
    setLoginPending(true);
    const response = await axios.post('https://dummyjson.com/auth/login', {
      username: emailRef.current.value,
      password: passwordRef.current.value,
      expiresInMins: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Request");
    setToken(response.data.token);
    setLoginPending(false);
    localStorage.setItem('token',JSON.stringify(response.data.token));
  } catch (error) {
    setLoginError(error.response.data.message);
    setLoginPending(false);
  }
};

  const handleLogin = (e) => {
    e.preventDefault();
    fetchLoginInfo();
  };
  useEffect(()=>{
    if(token)
    {
      navigate('/');
    }
  },[token,navigate])
  return (
    <Container fluid className="login-container bg-gradient">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 login-card">
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter email"
                    ref={emailRef}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={pending} className="w-100">
                  {pending?<Spinner/>:"Login"}
                </Button>
              </Form>
              {error?<Badge bg="danger">{error}</Badge>:null}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
