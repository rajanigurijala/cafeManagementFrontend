import React, { useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import OrderCard from "../components/OrderCard";
import { Modal, Button } from "react-bootstrap";
import API from "../services/api";

function CustomerHome() {
  const [cart, setCart] = useState([]);
  const [foods, setFoods] = useState([]); // ✅ FROM DB
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ FETCH AVAILABLE FOOD FROM DB
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/food/available"); // ✅ ONLY AVAILABLE ITEMS
      setFoods(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ CANCEL ORDER
  const cancelOrder = () => {
    setMessage("Order Cancelled ❌");
    setShow(true);
    setCart([]);
  };

  // ADD ITEM
  const addToCart = (item) => {
    const exist = cart.find((c) => c.id === item.id);

    if (exist) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // INCREASE
  const increaseQty = (id) => {
    setCart(
      cart.map((c) =>
        c.id === id ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  // DECREASE
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((c) =>
          c.id === id ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  // TOTAL
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // PLACE ORDER
  const placeOrder = () => {
    setMessage("Order placed successfully! ✅");
    setShow(true);
    setCart([]);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Cafe Menu</h2>

      {/* ✅ SHOW DB FOOD */}
      <div className="row">
        {foods.map((item) => (
          <FoodCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>

      <h3 className="mt-4">Cart</h3>

      <OrderCard
        cart={cart}
        increaseQty={increaseQty}
        decreaseQty={decreaseQty}
      />

      <h4 className="mt-3">Total: ₹{total}</h4>

      {/* PLACE ORDER */}
      <button
        className="btn btn-success mt-2"
        onClick={placeOrder}
        disabled={cart.length === 0}
      >
        Place Order
      </button>

      {/* CANCEL ORDER */}
      <button
        className="btn btn-danger mt-2 mx-2"
        onClick={cancelOrder}
        disabled={cart.length === 0}
      >
        Cancel Order
      </button>

      {/* DIALOG */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CustomerHome;