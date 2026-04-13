import React from "react";
function FoodCard({ item, addToCart }) {
  return (
    <div className="col-md-3">
      <div className="card p-3 mb-3 shadow text-center">
        <h5>{item.name}</h5>
        <p>₹{item.price}</p>

        {/* ✅ ADD BUTTON */}
        <button
          className="btn btn-primary w-100"
          onClick={() => addToCart(item)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
export default FoodCard;