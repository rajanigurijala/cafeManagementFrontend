import React, { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import OrderCard from "../components/OrderCard";
import { Modal, Button, Alert } from "react-bootstrap";
import API from "../services/api";

function CustomerHome() {
  const [cart, setCart] = useState([]);
  const [foods, setFoods] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("customerCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (e) {
        console.error("Error parsing cart:", e);
        localStorage.removeItem("customerCart");
      }
    }
    fetchFoods();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("customerCart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("customerCart");
    }
  }, [cart]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/food/available");
      setFoods(res.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to load menu. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel your entire order?")) {
      setCart([]);
      setMessage("Order Cancelled ❌");
      setMessageType("danger");
      setShow(true);
      localStorage.removeItem("customerCart");
    }
  };

  // FIXED: Add to cart function - properly handles multiple items
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Item doesn't exist, add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    // Show temporary feedback
    setMessage(`${item.name} added to cart!`);
    setMessageType("success");
    setShow(true);
    setTimeout(() => setShow(false), 1500);
  };

  const increaseQty = (id) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(prevCart => {
      const itemToDecrease = prevCart.find(item => item.id === id);
      
      if (itemToDecrease && itemToDecrease.quantity === 1) {
        // Ask for confirmation before removing
        if (window.confirm(`Remove ${itemToDecrease.name} from cart?`)) {
          return prevCart.filter(item => item.id !== id);
        }
        return prevCart;
      } else {
        // Decrease quantity
        return prevCart.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty!");
      setMessageType("warning");
      setShow(true);
      return;
    }

    setSubmitting(true);
    
    try {
      // Get user from localStorage (set during login)
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setMessage("Please login to place order");
        setMessageType("danger");
        setShow(true);
        setSubmitting(false);
        return;
      }

      const user = JSON.parse(userStr);
      
      // Prepare order data
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        orderDate: new Date().toISOString(),
        status: "PENDING"
      };

      // Send order to backend
      const response = await API.post("/orders", orderData);
      
      if (response.data) {
        setMessage("Order placed successfully! ✅");
        setMessageType("success");
        setShow(true);
        setCart([]);
        localStorage.removeItem("customerCart");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      if (err.response) {
        setMessage(err.response.data?.message || "Failed to place order. Please try again.");
      } else if (err.request) {
        setMessage("Cannot connect to server. Please check if backend is running.");
      } else {
        setMessage("Error placing order. Please try again.");
      }
      setMessageType("danger");
      setShow(true);
    } finally {
      setSubmitting(false);
    }
  };

  const clearCart = () => {
    if (cart.length > 0 && window.confirm("Clear entire cart?")) {
      setCart([]);
      setMessage("Cart cleared!");
      setMessageType("info");
      setShow(true);
      setTimeout(() => setShow(false), 1500);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p className="text-center mt-3" style={{ color: '#2c1810' }}>Loading delicious menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          <h4>⚠️ {error}</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="position-relative" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '300px',
        marginBottom: '40px',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(44,24,16,0.85) 0%, rgba(0,0,0,0.7) 100%)'
        }} />
        <div className="position-relative h-100 d-flex flex-column justify-content-center align-items-center text-white text-center">
          <h1 className="display-4 fw-bold mb-3">
            Our Special Menu
          </h1>
          <p className="lead fs-4">
            Freshly brewed with love ❤️
          </p>
        </div>
      </div>

      <div className="container mt-4">
        <h2 className="text-center mb-5" style={{ position: 'relative' }}>
          🍽️ Explore Our Delicious Menu
        </h2>

        {foods.length === 0 ? (
          <div className="text-center py-5">
            <h4>No items available at the moment</h4>
            <p>Please check back later!</p>
          </div>
        ) : (
          <div className="row">
            {foods.map((item) => (
              <FoodCard key={item.id} item={item} addToCart={addToCart} />
            ))}
          </div>
        )}

        {/* Cart Section */}
        {cart.length > 0 && (
          <div className="mt-5 pt-4" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '40px',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 style={{ color: '#2c1810' }}>
                🛒 Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h3>
              <button 
                className="btn btn-outline-danger btn-sm rounded-pill"
                onClick={clearCart}
              >
                Clear All
              </button>
            </div>

            <OrderCard
              cart={cart}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
            />

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <div>
                <h4 className="mb-0" style={{ color: '#c49a6c' }}>
                  Total: ₹{total}
                </h4>
                <small className="text-muted">Including all taxes</small>
              </div>
              <div>
                <button
                  className="btn btn-success px-4 py-2 me-3 rounded-pill"
                  onClick={placeOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Place Order
                    </>
                  )}
                </button>
                <button
                  className="btn btn-danger px-4 py-2 rounded-pill"
                  onClick={cancelOrder}
                  disabled={submitting}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty Cart Message */}
        {cart.length === 0 && foods.length > 0 && (
          <div className="text-center py-5 my-5">
            <i className="bi bi-cart" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h4 className="mt-3 text-muted">Your cart is empty</h4>
            <p>Add some delicious items from our menu!</p>
          </div>
        )}

        {/* Order Status Modal */}
        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton style={{ 
            borderBottomColor: messageType === 'success' ? '#28a745' : messageType === 'danger' ? '#dc3545' : '#ffc107'
          }}>
            <Modal.Title style={{ color: '#2c1810' }}>
              {messageType === 'success' && '🎉 Success!'}
              {messageType === 'danger' && '❌ Error!'}
              {messageType === 'warning' && '⚠️ Warning!'}
              {messageType === 'info' && 'ℹ️ Information'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <div className="mb-3">
              {messageType === 'success' && (
                <div className="text-success">
                  <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem' }}></i>
                </div>
              )}
              {messageType === 'danger' && (
                <div className="text-danger">
                  <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '3rem' }}></i>
                </div>
              )}
              {messageType === 'warning' && (
                <div className="text-warning">
                  <i className="bi bi-exclamation-circle-fill" style={{ fontSize: '3rem' }}></i>
                </div>
              )}
              {messageType === 'info' && (
                <div className="text-info">
                  <i className="bi bi-info-circle-fill" style={{ fontSize: '3rem' }}></i>
                </div>
              )}
            </div>
            <h5 className={`text-${messageType}`}>
              {message}
            </h5>
            {messageType === 'success' && message.includes("placed") && (
              <p className="text-muted mt-3 small">
                Thank you for your order! Your food will be prepared soon.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer style={{ borderTopColor: '#E0D0C0' }}>
            <Button 
              onClick={() => setShow(false)}
              variant={messageType === 'success' ? 'success' : messageType === 'danger' ? 'danger' : 'primary'}
              className="rounded-pill"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default CustomerHome;