import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

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
      setMessage("All fields required ❌");
      setShow(true);
      return;
    }

    try {
      const res = await API.post("/users/register", user);
      setMessage(res.data + " ✅");
      setShow(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setMessage("Error while registering ❌");
      setShow(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center">Register</h2>

        <input className="form-control my-2" placeholder="Name"
          onChange={(e)=>setUser({...user,name:e.target.value})} />

        <input className="form-control my-2" placeholder="Email"
          onChange={(e)=>setUser({...user,email:e.target.value})} />

        <input type="password" className="form-control my-2" placeholder="Password"
          onChange={(e)=>setUser({...user,password:e.target.value})} />

        {/* ✅ ROLE SELECT */}
        <select className="form-control my-2"
          onChange={(e)=>setUser({...user,role:e.target.value})}>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          Register
        </button>
      </div>

      {/* ✅ DIALOG */}
      <Modal
  show={show}
  onHide={() => setShow(false)}
  centered
  size="md"
>
        <Modal.Header closeButton>
          <Modal.Title>Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Register;