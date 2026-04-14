import { useEffect, useState } from "react";
import API from "../services/api";
import { Modal, Button, Toast, ToastContainer } from "react-bootstrap";

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  });
  
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "",
    available: true,
    imageUrl: ""
  });
  const [editFood, setEditFood] = useState(null);

  // Get unique categories
  const categories = ["all", ...new Set(foods.map(f => f.category).filter(Boolean))];

  // Filter foods based on search and category
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchFoods();
    fetchOrders();
    fetchStats();
  }, []);

  const fetchFoods = () => {
    setLoading(true);
    API.get("/food").then(res => {
      setFoods(res.data);
      setLoading(false);
    });
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const foodRes = await API.get("/food");
      const ordersRes = await API.get("/orders");
      
      const availableItems = foodRes.data.filter(f => f.available).length;
      const pendingOrders = ordersRes.data.filter(o => o.status === "PENDING").length;
      const revenue = ordersRes.data.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      setStats({
        totalItems: foodRes.data.length,
        availableItems: availableItems,
        totalOrders: ordersRes.data.length,
        pendingOrders: pendingOrders,
        revenue: revenue
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/status/${orderId}?status=${status}`);
      fetchOrders();
      fetchStats();
      showNotification(`Order #${orderId} status updated to ${status}`, "success");
    } catch (err) {
      showNotification("Failed to update order status", "error");
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server or convert to base64
  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addFood = async () => {
    if (!newFood.name || !newFood.price || !newFood.category) {
      showNotification("Please fill all fields", "error");
      return;
    }
    
    setUploading(true);
    
    try {
      let imageUrl = "";
      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      
      const foodData = {
        ...newFood,
        price: parseFloat(newFood.price),
        imageUrl: imageUrl
      };
      
      await API.post("/food", foodData);
      setNewFood({ name: "", price: "", category: "", available: true, imageUrl: "" });
      setSelectedImage(null);
      setImagePreview(null);
      fetchFoods();
      fetchStats();
      showNotification(`${newFood.name} added successfully!`, "success");
    } catch (err) {
      showNotification("Failed to add food item", "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await API.delete(`/food/${id}`);
        fetchFoods();
        fetchStats();
        showNotification("Food item deleted successfully", "success");
      } catch (err) {
        showNotification("Failed to delete food item", "error");
      }
    }
  };

  const startEdit = (food) => {
    setEditFood(food);
    if (food.imageUrl) {
      setImagePreview(food.imageUrl);
    }
  };

  const updateFood = async () => {
    try {
      await API.put(`/food/${editFood.id}`, editFood);
      setEditFood(null);
      setImagePreview(null);
      fetchFoods();
      showNotification(`${editFood.name} updated successfully`, "success");
    } catch (err) {
      showNotification("Failed to update food item", "error");
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await API.put(`/food/toggle/${id}`);
      fetchFoods();
      fetchStats();
      showNotification("Availability toggled", "success");
    } catch (err) {
      showNotification("Failed to toggle availability", "error");
    }
  };

  const showNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getStatusBadge = (status) => {
    const variants = {
      'PENDING': { bg: 'warning', text: 'Pending', icon: '⏳' },
      'CONFIRMED': { bg: 'info', text: 'Confirmed', icon: '✓' },
      'PREPARING': { bg: 'primary', text: 'Preparing', icon: '👨‍🍳' },
      'READY': { bg: 'success', text: 'Ready', icon: '✅' },
      'DELIVERED': { bg: 'success', text: 'Delivered', icon: '🚚' },
      'CANCELLED': { bg: 'danger', text: 'Cancelled', icon: '❌' }
    };
    return variants[status] || { bg: 'secondary', text: status, icon: '📦' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Beverage': '☕',
      'Coffee': '☕',
      'Tea': '🍵',
      'Snack': '🍿',
      'Fast Food': '🍔',
      'Burger': '🍔',
      'Pizza': '🍕',
      'Pasta': '🍝',
      'Dessert': '🍰',
      'Salad': '🥗'
    };
    return icons[category] || '🍽️';
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <p className="text-center mt-3" style={{ color: '#2c1810' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header style={{ backgroundColor: toastType === 'success' ? '#28a745' : '#dc3545', color: 'white' }}>
            <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Header with Stats */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1 className="header-title">🍽️ Admin Dashboard</h1>
            <p className="header-subtitle">Manage your cafe menu, track orders, and monitor sales</p>
          </div>
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-value">{stats.totalItems}</div>
              <div className="stat-label">Total Items</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{stats.availableItems}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">{stats.pendingOrders}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card revenue-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">₹{stats.revenue.toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${!showOrders ? 'active' : ''}`}
              onClick={() => setShowOrders(false)}
            >
              📋 Manage Menu
            </button>
            <button 
              className={`tab-btn ${showOrders ? 'active' : ''}`}
              onClick={() => setShowOrders(true)}
            >
              📊 View Orders
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {!showOrders ? (
          <>
            {/* Add Food Form with Image Upload */}
            <div className="add-food-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-icon">➕</span>
                  Add New Food Item
                </h2>
              </div>
              
              <div className="add-food-form">
                <div className="form-group">
                  <input
                    placeholder="Food Name"
                    className="form-input"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    className="form-input"
                    value={newFood.price}
                    onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    placeholder="Category (e.g., Pizza, Burger, Coffee)"
                    className="form-input"
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  />
                </div>
                
                {/* Image Upload Section */}
                <div className="form-group image-upload-group">
                  <label className="image-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-area">
                      {imagePreview ? (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" />
                          <button 
                            className="remove-image"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="upload-icon">📸</span>
                          <p>Click to upload food image</p>
                          <small>PNG, JPG up to 2MB</small>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                
                <div className="form-group">
                  <button 
                    className="submit-btn" 
                    onClick={addFood}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "➕ Add Food Item"}
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="search-filter-section">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="filter-tabs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'All Items' : `${getCategoryIcon(cat)} ${cat}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="menu-header">
              <h2 className="section-title">
                <span className="title-icon">📋</span>
                Menu Items
                <span className="item-count">{filteredFoods.length} items</span>
              </h2>
            </div>
            
            <div className="menu-grid">
              {filteredFoods.length === 0 ? (
                <div className="no-results">
                  <span className="no-results-icon">🔍</span>
                  <h3>No items found</h3>
                  <p>Try adjusting your search or filter</p>
                </div>
              ) : (
                filteredFoods.map((food, index) => (
                  <div className="menu-card" key={food.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="menu-card-image">
                      <img
                        src={food.imageUrl || `https://source.unsplash.com/400x300/?${food.category || 'food'},restaurant`}
                        alt={food.name}
                      />
                      {!food.available && (
                        <div className="out-of-stock-badge">
                          <span>Out of Stock</span>
                        </div>
                      )}
                      <div className="category-tag">
                        {getCategoryIcon(food.category)} {food.category}
                      </div>
                    </div>
                    
                    <div className="menu-card-content">
                      {editFood && editFood.id === food.id ? (
                        <div className="edit-mode">
                          <input
                            className="edit-input"
                            value={editFood.name}
                            onChange={(e) => setEditFood({ ...editFood, name: e.target.value })}
                            placeholder="Name"
                          />
                          <input
                            type="number"
                            className="edit-input"
                            value={editFood.price}
                            onChange={(e) => setEditFood({ ...editFood, price: e.target.value })}
                            placeholder="Price"
                          />
                          <input
                            className="edit-input"
                            value={editFood.category}
                            onChange={(e) => setEditFood({ ...editFood, category: e.target.value })}
                            placeholder="Category"
                          />
                          <div className="edit-actions">
                            <button className="save-btn" onClick={updateFood}>💾 Save</button>
                            <button className="cancel-btn" onClick={() => setEditFood(null)}>❌ Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="menu-card-header">
                            <h3 className="food-name">{food.name}</h3>
                            <div className={`status-badge ${food.available ? 'available' : 'unavailable'}`}>
                              {food.available ? 'Available' : 'Out of Stock'}
                            </div>
                          </div>
                          
                          <div className="food-price">
                            <span className="currency">₹</span>
                            <span className="amount">{food.price}</span>
                          </div>
                          
                          <div className="card-actions">
                            <button className="action-btn edit" onClick={() => startEdit(food)}>
                              ✏️ Edit
                            </button>
                            <button className="action-btn toggle" onClick={() => toggleAvailability(food.id)}>
                              🔄 Toggle
                            </button>
                            <button className="action-btn delete" onClick={() => deleteFood(food.id)}>
                              🗑 Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Orders Section */}
            <div className="orders-section">
              <div className="section-header">
                <h2 className="section-title">
                  <span className="title-icon">📊</span>
                  Customer Orders
                </h2>
                <button className="refresh-btn" onClick={fetchOrders}>
                  🔄 Refresh
                </button>
              </div>
              
              {orders.length === 0 ? (
                <div className="no-results">
                  <span className="no-results-icon">📭</span>
                  <h3>No orders yet</h3>
                  <p>Orders will appear here once customers place them</p>
                </div>
              ) : (
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const statusInfo = getStatusBadge(order.status);
                        return (
                          <tr key={order.id}>
                            <td className="order-id">#{order.id}</td>
                            <td>
                              <div className="customer-name">{order.user?.name || 'N/A'}</div>
                              <div className="customer-email">{order.user?.email}</div>
                            </td>
                            <td>
                              <button className="view-items-btn" onClick={() => setSelectedOrder(order)}>
                                📋 View ({order.items?.length || 0} items)
                              </button>
                            </td>
                            <td className="order-total">₹{order.totalAmount}</td>
                            <td>
                              <span className={`status-badge order-status ${order.status.toLowerCase()}`}>
                                {statusInfo.icon} {statusInfo.text}
                              </span>
                            </td>
                            <td className="order-date">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>
                              <select 
                                className="status-select"
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              >
                                <option value="PENDING">⏳ Pending</option>
                                <option value="CONFIRMED">✓ Confirmed</option>
                                <option value="PREPARING">👨‍🍳 Preparing</option>
                                <option value="READY">✅ Ready</option>
                                <option value="DELIVERED">🚚 Delivered</option>
                                <option value="CANCELLED">❌ Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                   </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal show={selectedOrder} onHide={() => setSelectedOrder(null)} size="lg" centered className="order-modal">
        <Modal.Header closeButton>
          <Modal.Title>📋 Order #{selectedOrder?.id} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="order-info-grid">
                <div className="info-card">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.user?.phone || 'N/A'}</p>
                </div>
                <div className="info-card">
                  <h4>Order Information</h4>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge order-status ${selectedOrder.status.toLowerCase()} ms-2`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <h4 className="mt-4 mb-3">Order Items</h4>
              <div className="order-items-table">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>₹{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                      <td><strong className="total-amount">₹{selectedOrder.totalAmount}</strong></td>
                    </tr>
                  </tfoot>
                 </table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedOrder(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;