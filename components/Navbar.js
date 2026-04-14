import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("customerCart");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-4" style={{ 
      background: 'linear-gradient(135deg, #2c1810 0%, #3d2317 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="text-white fw-bold fs-3" style={{ 
            fontFamily: 'Poppins, sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            ☕ CafeBrew
          </span>
        </Link>
        
        <button className="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto d-flex gap-3">
            {!isLoggedIn ? (
              <>
                <Link to="/" className="btn btn-outline-light px-4 py-2 rounded-pill">
                  <i className="bi bi-person-plus me-2"></i>Register
                </Link>
                <Link to="/login" className="btn btn-outline-light px-4 py-2 rounded-pill">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login
                </Link>
              </>
            ) : (
              <>
                {user.role === "ADMIN" ? (
                  <Link to="/admin" className="btn btn-outline-light px-4 py-2 rounded-pill">
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </Link>
                ) : (
                  <Link to="/customer" className="btn btn-outline-light px-4 py-2 rounded-pill">
                    <i className="bi bi-shop me-2"></i>Menu
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-danger px-4 py-2 rounded-pill">
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;