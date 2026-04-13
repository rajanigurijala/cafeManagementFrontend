import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <h3 className="text-white">Cafe App</h3>
      <div>
        <Link to="/" className="btn btn-outline-light mx-2">Register</Link>
        <Link to="/login" className="btn btn-outline-light">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;