import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      setMessage("All fields required");
      setShow(true);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:9999/users/login",
        user
      );

      console.log(res.data);

      if (res.data && res.data.id) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setMessage("Login Successful");
        setShow(true);

        setTimeout(() => {
          if (res.data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/customer");
          }
        }, 1500);

      } else {
        setMessage("Invalid credentials");
        setShow(true);
      }

    } catch (error) {
      console.log(error);
      setMessage("Server error");
      setShow(true);
    }
  };

  return (
    <>
      {/* Navigation Bar - Sticky */}
      <Navbar 
        expand="lg" 
        className="py-3" 
        style={{ 
          backgroundColor: '#2C1810', 
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%'
        }}
      >
        <Container>
          <Navbar.Brand href="/" className="text-white fw-bold fs-3">CafeBrew</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-white" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-3">
              <Nav.Link href="/" className="text-white">Home</Nav.Link>
              <Nav.Link href="/register" className="text-white">Register</Nav.Link>
              <Nav.Link href="/" className="btn btn-outline-light px-3 py-1 ms-2">Back to Cafe</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section with Background Image */}
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        marginTop: '-76px',
        paddingTop: '76px'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.65)' 
        }} />
        
        <Container className="position-relative">
          <Row className="justify-content-center">
            <Col lg={5} md={7}>
              {/* Login Card */}
              <div className="bg-white rounded-4 shadow-lg p-4 p-md-5" style={{ borderTop: '4px solid #C49A6C' }}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2C1810' }}>Welcome Back</h2>
                  <p className="text-muted">Login to continue your coffee journey</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      style={{ borderColor: '#E0D0C0' }}
                      onChange={handleChange}
                      value={user.email}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      style={{ borderColor: '#E0D0C0' }}
                      onChange={handleChange}
                      value={user.password}
                    />
                  </div>

                  <div className="text-end mb-3">
                    <a href="#!" className="text-decoration-none small" style={{ color: '#C49A6C' }}>
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-2 fw-bold mb-3"
                    style={{ 
                      backgroundColor: '#C49A6C', 
                      color: 'white', 
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#A87C4F'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#C49A6C'}
                  >
                    Login
                  </button>

                  <hr className="my-4" style={{ borderColor: '#E0D0C0' }} />

                  <div className="text-center">
                    <p className="text-muted">
                      Don't have an account?{' '}
                      <a href="/register" className="fw-bold text-decoration-none" style={{ color: '#C49A6C' }}>
                        Create Account
                      </a>
                    </p>
                  </div>

                  {/* Demo Credentials */}
                  <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#F8F5F0' }}>
                    <p className="small text-center mb-1 fw-semibold" style={{ color: '#2C1810' }}>
                      Demo Credentials
                    </p>
                    <p className="small text-center text-muted mb-0">
                      Email: customer@cafebrew.com<br />
                      Password: 123456
                    </p>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ borderBottomColor: '#E0D0C0' }}>
          <Modal.Title style={{ color: '#2C1810' }}>Login Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            {message === "Login Successful" ? (
              <div className="text-success">
                <h3>✓</h3>
              </div>
            ) : (
              <div className="text-danger">
                <h3>!</h3>
              </div>
            )}
          </div>
          <h5 className={message === "Login Successful" ? "text-success" : "text-danger"}>
            {message}
          </h5>
          {message === "Login Successful" && (
            <p className="text-muted mt-3 small">
              Redirecting you to your dashboard...
            </p>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTopColor: '#E0D0C0' }}>
          <Button 
            onClick={() => setShow(false)}
            style={{ backgroundColor: '#C49A6C', border: 'none' }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;