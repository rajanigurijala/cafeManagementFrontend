import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
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
    try {
      const res = await axios.post(
        "http://localhost:9999/users/login",
        user
      );

      console.log(res.data);

      // ✅ SUCCESS LOGIN
      if (res.data && res.data.id) {
        // store user
        localStorage.setItem("user", JSON.stringify(res.data));

        setMessage("Login Successful ✅");
        setShow(true);

        // redirect based on role
        setTimeout(() => {
          if (res.data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/customer");
          }
        }, 1500);

      } else {
        // ❌ INVALID LOGIN
        setMessage("Invalid credentials ❌");
        setShow(true);
      }

    } catch (error) {
      console.log(error);
      setMessage("Server error ❌");
      setShow(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center mb-3">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <button className="btn btn-success w-100" onClick={handleLogin}>
          Login
        </button>
      </div>

      {/* ✅ CENTER DIALOG */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>{message}</Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShow(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;