import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button, Container, Row, Col, Card } from "react-bootstrap";

function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name.trim()) return setMessage("Please enter your full name") & setShow(true);
    if (!user.email.trim()) return setMessage("Please enter your email") & setShow(true);
    if (!user.password || user.password.length < 6) return setMessage("Password must be at least 6 characters") & setShow(true);
    setLoading(true);
    try {
      await API.post("/users/register", user);
      setMessage("Registration successful!");
      setShow(true);
      setTimeout(() => { setShow(false); navigate("/login"); }, 2000);
    } catch (err) {
      setMessage(err.response?.data || "Registration failed");
      setShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (sectionId) => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* Hero Section */}
      <div id="home" className="min-vh-100 d-flex align-items-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3")',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} />
        <Container className="position-relative text-white text-center">
          <h1 className="display-2 fw-bold mb-3">Welcome to CafeBrew</h1>
          <p className="lead fs-3 mb-5">Where every cup tells a story</p>
          <button onClick={() => handleScroll('register')} className="btn btn-lg px-5 py-3 rounded-pill" style={{ backgroundColor: '#C49A6C', color: 'white', fontWeight: 'bold' }}>
            Join Our Community
          </button>
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
              <p className="lead mb-4">Founded in 2020, CafeBrew is a sanctuary for coffee lovers...</p>
              <div className="mt-4 d-flex gap-4 flex-wrap">
                <div><strong>☕ Artisan Coffee</strong><br />Freshly roasted</div>
                <div><strong>🥐 Fresh Pastries</strong><br />Baked daily</div>
                <div><strong>💻 Cozy Ambiance</strong><br />With free WiFi</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Menu Preview */}
      <section id="menu" className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5" style={{ color: '#2C1810' }}>Our Signature Brews</h2>
          <Row>
            {[{ name: "Caramel Macchiato", desc: "Espresso, vanilla, caramel, steamed milk", price: "$4.50", img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2" },
              { name: "Hazelnut Latte", desc: "Smooth espresso with hazelnut and creamy milk", price: "$4.25", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735" },
              { name: "Iced Americano", desc: "Rich espresso poured over chilled water", price: "$3.75", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c" }].map((item, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="h-100 border-0 shadow-sm text-center overflow-hidden">
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
        </Container>
      </section>

      {/* Registration Form */}
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
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input type="text" name="name" className="form-control" value={user.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input type="email" name="email" className="form-control" value={user.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password *</label>
                    <input type="password" name="password" className="form-control" value={user.password} onChange={handleChange} required minLength="6" />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Register as</label>
                    <select name="role" className="form-select" value={user.role} onChange={handleChange}>
                      <option value="CUSTOMER">☕ Coffee Lover (Customer)</option>
                      <option value="ADMIN">👑 Cafe Manager (Admin)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn w-100 py-2 fw-bold mb-3 rounded-pill" style={{ backgroundColor: '#C49A6C', color: 'white' }} disabled={loading}>
                    {loading ? "Registering..." : "Join CafeBrew Now"}
                  </button>
                  <div className="text-center">
                    <p className="text-muted">Already a coffee lover? <Link to="/login" className="fw-bold" style={{ color: '#C49A6C' }}>Login here</Link></p>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>{message.includes("successful") ? "🎉 Success!" : "Info"}</Modal.Title></Modal.Header>
        <Modal.Body className="text-center"><h5 className={message.includes("successful") ? "text-success" : "text-danger"}>{message}</h5></Modal.Body>
        <Modal.Footer><Button onClick={() => setShow(false)} style={{ backgroundColor: '#C49A6C', border: 'none' }}>OK</Button></Modal.Footer>
      </Modal>
    </>
  );
}

export default Register;