import React, { useState, memo } from "react";

const FoodCard = memo(({ item, addToCart }) => {
  const [added, setAdded] = useState(false);
  
  // Memoize the image URL so it doesn't change on re-renders
  const imageUrl = React.useMemo(() => {
    const images = [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591"
    ];
    
    // Use item.id for consistent image selection
    const imageIndex = item.id % images.length;
    return `${images[imageIndex]}?w=300&h=200&fit=crop`;
  }, [item.id]); // Only recalculate if item.id changes

  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="col-md-3 mb-4">
      <div className="card p-0 mb-3 shadow text-center overflow-hidden h-100">
        <img 
          src={imageUrl}
          alt={item.name}
          style={{ height: '180px', objectFit: 'cover' }}
          loading="lazy"
        />
        <div className="p-3">
          <h5 className="mb-2">{item.name}</h5>
          <p className="text-muted mb-3">
            <span className="fw-bold" style={{ color: '#c49a6c', fontSize: '1.2rem' }}>
              ₹{item.price}
            </span>
          </p>
          <button
            className="btn w-100 rounded-pill"
            style={{ 
              background: added ? '#28a745' : 'linear-gradient(135deg, #fc8019, #e56f12)',
              color: 'white',
              fontWeight: '600',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onClick={handleAddToCart}
          >
            {added ? '✓ Added!' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the item data actually changed
  return prevProps.item.id === nextProps.item.id && 
         prevProps.item.price === nextProps.item.price &&
         prevProps.item.name === nextProps.item.name;
});

export default FoodCard;