import React from "react";

function OrderCard({ cart, increaseQty, decreaseQty }) {
  if (cart.length === 0) {
    return <p>No items in cart</p>;
  }

  return (
    <ul className="list-group">
      {cart.map((item) => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {item.name} (₹{item.price})

          <div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => decreaseQty(item.id)}
            >
              -
            </button>

            {/* ✅ CORRECT PLACE */}
            <span className="mx-2 fw-bold">{item.quantity}</span>

            <button
              className="btn btn-success btn-sm"
              onClick={() => increaseQty(item.id)}
            >
              +
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default OrderCard;