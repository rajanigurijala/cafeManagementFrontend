import React, { useState } from "react";
import FoodCard from "../components/FoodCard";
import OrderCard from "../components/OrderCard";
import { Modal, Button } from "react-bootstrap";

const foodItems = [
  { id: 1, name: "Coffee", price: 50 },
  { id: 2, name: "Tea", price: 30 },
  { id: 3, name: "Pizza", price: 150 },
  { id: 4, name: "Burger", price: 120 },
  { id: 5, name: "Ice Cream", price: 80 },
  { id: 6, name: "Soft Drink", price: 60 },
  { id: 7, name: "Milk", price: 40 },
  { id: 8, name:  "french Fries", price:60},
];

function CustomerHome() {
  const [cart, setCart] = useState([]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

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

      <div className="row">
        {foodItems.map((item) => (
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

      {/* ✅ PLACE ORDER */}
      <button
        className="btn btn-success mt-2"
        onClick={placeOrder}
        disabled={cart.length === 0}
      >
        Place Order
      </button>

      {/* ✅ CANCEL ORDER (ADDED HERE) */}
      <button
        className="btn btn-danger mt-2 mx-2"
        onClick={cancelOrder}
        disabled={cart.length === 0}
      >
        Cancel Order
      </button>

      {/* ✅ DIALOG BOX */}
      <Modal
  show={show}
  onHide={() => setShow(false)}
  centered
  size="md"
>
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