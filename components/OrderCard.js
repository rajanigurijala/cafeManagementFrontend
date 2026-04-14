import React from "react";

function OrderCard({ cart, increaseQty, decreaseQty }) {
  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#ccc' }}></i>
        <p className="mt-2 text-muted">Your cart is empty</p>
        <p className="small text-muted">Add some delicious items from our menu! 🍕</p>
      </div>
    );
  }

  return (
    <ul className="list-group">
      {cart.map((item) => (
        <li
          key={`cart-item-${item.id}`}
          className="list-group-item d-flex justify-content-between align-items-center"
          style={{ 
            borderRadius: '15px', 
            marginBottom: '10px',
            transition: 'all 0.3s ease',
            border: '1px solid #e8dcc8'
          }}
        >
          <div className="flex-grow-1">
            <strong style={{ color: '#2c1810', fontSize: '1rem' }}>{item.name}</strong>
            <br />
            <small style={{ color: '#c49a6c', fontWeight: '600' }}>
              ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
            </small>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-danger btn-sm rounded-circle"
              onClick={() => decreaseQty(item.id)}
              style={{ width: '32px', height: '32px', padding: '0', fontSize: '1.2rem', fontWeight: 'bold' }}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              -
            </button>
            <span className="mx-2 fw-bold" style={{ 
              minWidth: '35px', 
              textAlign: 'center',
              fontSize: '1.1rem',
              color: '#2c1810'
            }}>
              {item.quantity}
            </span>
            <button
              className="btn btn-success btn-sm rounded-circle"
              onClick={() => increaseQty(item.id)}
              style={{ width: '32px', height: '32px', padding: '0', fontSize: '1.2rem', fontWeight: 'bold' }}
              aria-label={`Increase quantity of ${item.name}`}
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