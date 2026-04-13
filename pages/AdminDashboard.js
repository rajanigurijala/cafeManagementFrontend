import { useEffect, useState } from "react";
import API from "../services/api";
import "../App.css";

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "",
    available: true
  });

  const [editFood, setEditFood] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = () => {
    API.get("/food").then(res => setFoods(res.data));
  };

  const addFood = async () => {
    await API.post("/food", newFood);
    setNewFood({ name: "", price: "", category: "", available: true });
    fetchFoods();
  };

  const deleteFood = async (id) => {
    await API.delete(`/food/${id}`);
    fetchFoods();
  };

  const startEdit = (food) => {
    setEditFood(food);
  };

  const updateFood = async () => {
    await API.put(`/food/${editFood.id}`, editFood);
    setEditFood(null);
    fetchFoods();
  };

  const toggleAvailability = async (id) => {
    await API.put(`/food/toggle/${id}`);
    fetchFoods();
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <h2 className="text-center fw-bold mb-4">
        🍽️ Admin Dashboard
      </h2>

      {/* ADD FOOD */}
      <div className="card shadow-lg p-4 mb-4 border-0">
        <h4>➕ Add New Food</h4>

        <div className="row">
          <div className="col-md-4">
            <input
              placeholder="Food Name"
              className="form-control"
              value={newFood.name}
              onChange={(e) =>
                setNewFood({ ...newFood, name: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <input
              placeholder="Price"
              className="form-control"
              value={newFood.price}
              onChange={(e) =>
                setNewFood({ ...newFood, price: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <input
              placeholder="Category"
              className="form-control"
              value={newFood.category}
              onChange={(e) =>
                setNewFood({ ...newFood, category: e.target.value })
              }
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={addFood}>
          ➕ Add Food
        </button>
      </div>

      {/* 🔥 NEW SWIGGY STYLE GRID */}
      <div className="food-grid">
        {foods.map((f) => (
          <div className="food-card" key={f.id}>

            {/* IMAGE */}
            <img
              src="https://source.unsplash.com/300x200/?food"
              alt={f.name}
              className="food-img"
            />

            <div className="food-content">

              {/* EDIT MODE */}
              {editFood && editFood.id === f.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={editFood.name}
                    onChange={(e) =>
                      setEditFood({ ...editFood, name: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    value={editFood.price}
                    onChange={(e) =>
                      setEditFood({ ...editFood, price: e.target.value })
                    }
                  />

                  <input
                    className="form-control mb-2"
                    value={editFood.category}
                    onChange={(e) =>
                      setEditFood({ ...editFood, category: e.target.value })
                    }
                  />

                  <div className="actions">
                    <button onClick={updateFood}>💾</button>
                    <button onClick={() => setEditFood(null)}>❌</button>
                  </div>
                </>
              ) : (
                <>
                  {/* FOOD INFO */}
                  <h5>{f.name}</h5>
                  <p className="category">{f.category}</p>

                  <div className="food-bottom">
                    <span className="price">₹{f.price}</span>

                    <span
                      className={`badge ${
                        f.available ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {f.available ? "Available" : "Not Available"}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="actions">
                    <button onClick={() => startEdit(f)}>✏️</button>
                    <button onClick={() => toggleAvailability(f.id)}>🔄</button>
                    <button onClick={() => deleteFood(f.id)}>🗑</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminDashboard;