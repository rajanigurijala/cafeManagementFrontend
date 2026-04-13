import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({ name:"", price:"", category:"" });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = () => {
    API.get("/food").then(res => setFoods(res.data));
  };

  const addFood = async () => {
    await API.post("/food", newFood);
    fetchFoods();
  };

  const deleteFood = async (id) => {
    await API.delete(`/food/${id}`);
    fetchFoods();
  };

  return (
    <div className="container">
      <h2 className="mt-3">Admin Dashboard</h2>

      <div className="card p-3">
        <h4>Add Food</h4>

        <input placeholder="Name" className="form-control my-1"
          onChange={(e)=>setNewFood({...newFood,name:e.target.value})} />

        <input placeholder="Price" className="form-control my-1"
          onChange={(e)=>setNewFood({...newFood,price:e.target.value})} />

        <input placeholder="Category" className="form-control my-1"
          onChange={(e)=>setNewFood({...newFood,category:e.target.value})} />

        <button className="btn btn-primary mt-2" onClick={addFood}>
          Add
        </button>
      </div>

      <div className="row mt-4">
        {foods.map(f => (
          <div className="col-md-3" key={f.id}>
            <div className="card p-2 shadow">
              <h5>{f.name}</h5>
              <p>₹{f.price}</p>
              <button className="btn btn-danger"
                onClick={()=>deleteFood(f.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;