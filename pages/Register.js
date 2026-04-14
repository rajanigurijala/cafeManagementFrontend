import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      setMessage("All fields required");
      setShow(true);
      return;
    }
    try {
      const res = await API.post("/users/register", user);
      setMessage(res.data);
      setShow(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("Error while registering");
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
              <Nav.Link href="#home" className="text-white">Home</Nav.Link>
              <Nav.Link href="#menu" className="text-white">Menu</Nav.Link>
              <Nav.Link href="#about" className="text-white">About</Nav.Link>
              <Nav.Link href="#contact" className="text-white">Contact</Nav.Link>
              <Nav.Link href="/login" className="btn btn-outline-light px-3 py-1 ms-2">Sign In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section with Background Image */}
      <div id="home" className="min-vh-100 d-flex align-items-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />
        <Container className="position-relative text-white text-center">
          <h1 className="display-2 fw-bold mb-3">Welcome to CafeBrew</h1>
          <p className="lead fs-3 mb-5">Where every cup tells a story</p>
          <a href="#register" className="btn btn-lg px-5 py-3" style={{ backgroundColor: '#C49A6C', color: 'white', fontWeight: 'bold' }}>Join Our Community</a>
        </Container>
      </div>

      {/* About Section */}
      <section id="about" className="py-5" style={{ backgroundColor: '#F8F5F0' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb" alt="Cafe interior" className="img-fluid rounded-4 shadow" />
            </Col>
            <Col lg={6}>
              <h2 className="fw-bold mb-3" style={{ color: '#2C1810' }}>Our Story</h2>
              <p className="lead mb-4" style={{ color: '#4A3B32' }}>Founded in 2020, CafeBrew is a sanctuary for coffee lovers. We source our beans directly from ethical farms and roast them in-house to bring you the perfect cup.</p>
              <p style={{ color: '#6B5A4E' }}>Our cozy space is designed for connection, creativity, and relaxation. Whether you need a morning boost or an afternoon retreat, we invite you to make our cafe your second home.</p>
              <div className="mt-4 d-flex gap-4">
                <div><strong style={{ color: '#2C1810' }}>Artisan Coffee</strong><br />Freshly roasted</div>
                <div><strong style={{ color: '#2C1810' }}>Fresh Pastries</strong><br />Baked daily</div>
                <div><strong style={{ color: '#2C1810' }}>Cozy Ambiance</strong><br />With free WiFi</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5" style={{ color: '#2C1810' }}>Our Signature Brews</h2>
          <Row>
            {[
              { name: "Caramel Macchiato", desc: "Espresso, vanilla, caramel, steamed milk", price: "$4.50", img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2" },
              { name: "Hazelnut Latte", desc: "Smooth espresso with hazelnut and creamy milk", price: "$4.25", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735" },
              { name: "Iced Americano", desc: "Rich espresso poured over chilled water", price: "$3.75", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c" }
            ].map((item, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="h-100 border-0 shadow-sm text-center">
                  <Card.Img variant="top" src={item.img} style={{ height: '220px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title className="fw-bold" style={{ color: '#2C1810' }}>{item.name}</Card.Title>
                    <Card.Text className="text-muted">{item.desc}</Card.Text>
                    <h5 style={{ color: '#C49A6C' }}>{item.price}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <a href="#!" className="btn px-4 py-2" style={{ backgroundColor: '#2C1810', color: 'white' }}>View Full Menu</a>
          </div>
        </Container>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="py-5" style={{ backgroundColor: '#F8F5F0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} xl={6}>
              <div className="bg-white rounded-4 shadow-lg p-4 p-md-5" style={{ borderTop: '4px solid #C49A6C' }}>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#2C1810' }}>Join CafeBrew</h2>
                  <p className="text-muted">Become a member and get special perks</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter your full name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Email Address</label>
                    <input type="email" className="form-control" placeholder="Enter your email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Password</label>
                    <input type="password" className="form-control" placeholder="Create a password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2C1810' }}>Register as</label>
                    <select className="form-select" onChange={(e) => setUser({ ...user, role: e.target.value })}>
                      <option value="CUSTOMER">Coffee Lover (Customer)</option>
                      <option value="ADMIN">Cafe Manager (Admin)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn w-100 py-2 fw-bold mb-3" style={{ backgroundColor: '#C49A6C', color: 'white', border: 'none' }}>Join CafeBrew Now</button>
                  <div className="text-center">
                    <p className="text-muted">Already a coffee lover? <a href="/login" className="fw-bold" style={{ color: '#C49A6C' }}>Login here</a></p>
                  </div>
                  <hr className="my-4" />
                  <div className="text-center">
                    <p className="text-muted small mb-0">Join now and get a free coffee on your first visit</p>
                    <p className="text-muted small mt-2">By registering, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-5" style={{ backgroundColor: '#2C1810', color: '#F8F5F0' }}>
        <Container>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <h3 className="fw-bold">CafeBrew</h3>
              <p>Where every cup tells a story</p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <h5>Visit Us</h5>
              <p>123 Coffee Street<br />Brewtown, BT 12345</p>
              <p>Open daily: 8am - 10pm</p>
            </Col>
            <Col md={4}>
              <h5>Contact</h5>
              <p>hello@cafebrew.com<br />(555) 123-4567</p>
            </Col>
          </Row>
          <hr className="mt-4" style={{ backgroundColor: '#C49A6C' }} />
          <div className="text-center pt-3 small">
            &copy; 2025 CafeBrew. All rights reserved.
          </div>
        </Container>
      </footer>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#2C1810' }}>Registration Status</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <h5 className={message === "Error while registering" ? "text-danger" : "text-success"}>{message}</h5>
          {message !== "Error while registering" && message !== "All fields required" && (
            <p className="text-muted mt-3 small">Your first coffee is waiting for you</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)} style={{ backgroundColor: '#C49A6C', border: 'none' }}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Register;