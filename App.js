import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomerHome from "./pages/CustomerHome";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import "./App.css"; // 👈 Import global styles

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;
  const user = JSON.parse(userStr);
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/customer"} replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/customer" 
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;