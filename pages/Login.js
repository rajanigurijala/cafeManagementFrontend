import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
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
      const res = await axios.post("http://localhost:9999/users/login", user);
      if (res.data && res.data.id) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setMessage("Login Successful");
        setShow(true);
        setTimeout(() => {
          if (res.data.role === "ADMIN") navigate("/admin");
          else navigate("/customer");
        }, 1500);
      } else {
        setMessage("Invalid credentials");
        setShow(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again.");
      setShow(true);
    }
  };

  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)' }} />
        <Container className="position-relative">
          <Row className="justify-content-center">
            <Col lg={5} md={7}>
              <div className="bg-white rounded-4 shadow-lg p-4 p-md-5" style={{ borderTop: '4px solid #C49A6C' }}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2C1810' }}>Welcome Back</h2>
                  <p className="text-muted">Login to continue your coffee journey</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Email Address</label>
                    <input type="email" name="email" className="form-control form-control-lg" placeholder="Enter your email" onChange={handleChange} value={user.email} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Password</label>
                    <input type="password" name="password" className="form-control form-control-lg" placeholder="Enter your password" onChange={handleChange} value={user.password} />
                  </div>
                  <button type="submit" className="btn w-100 py-2 fw-bold mb-3" style={{ backgroundColor: '#C49A6C', color: 'white', border: 'none', fontSize: '1.1rem' }}>
                    Login
                  </button>
                  <hr className="my-4" style={{ borderColor: '#E0D0C0' }} />
                  <div className="text-center">
                    <p className="text-muted">Don't have an account?{' '}
                      <Link to="/" className="fw-bold text-decoration-none" style={{ color: '#C49A6C' }}>Create Account</Link>
                    </p>
                  </div>
                  <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#F8F5F0' }}>
                    <p className="small text-center mb-1 fw-semibold" style={{ color: '#2C1810' }}>Demo Credentials</p>
                    <p className="small text-center text-muted mb-0">Email: customer@cafebrew.com<br />Password: 123456</p>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ borderBottomColor: '#E0D0C0' }}>
          <Modal.Title style={{ color: '#2C1810' }}>Login Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <h5 className={message === "Login Successful" ? "text-success" : "text-danger"}>{message}</h5>
          {message === "Login Successful" && <p className="text-muted mt-3 small">Redirecting...</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)} style={{ backgroundColor: '#C49A6C', border: 'none' }}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Login;