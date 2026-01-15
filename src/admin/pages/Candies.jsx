import React, { useEffect, useState } from "react";
import api from "../../api";

export default function Candies() {
  const [candies, setCandies] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Milk");
  const [price, setPrice] = useState("");

  /* ================= LOAD CANDIES ================= */
  const loadCandies = async () => {
    try {
      const res = await api.get("/admin/candies");

      if (Array.isArray(res.data)) {
        setCandies(res.data);
      } else {
        console.error("Invalid response:", res.data);
        setCandies([]);
      }
    } catch (err) {
      console.error("LOAD CANDIES ERROR:", err);
      alert("Failed to load candies");
    }
  };

  useEffect(() => {
    loadCandies();
  }, []);

  /* ================= CREATE CANDY ================= */
  const createCandy = async () => {
    if (!name || !price) {
      alert("Name & price required");
      return;
    }

    try {
      const res = await api.post("/admin/candies", {
        name,
        category,
        price: Number(price),
      });

      if (!res.data) {
        alert("Failed to create candy");
        return;
      }

      setName("");
      setPrice("");
      loadCandies();
    } catch (err) {
      console.error("CREATE CANDY ERROR:", err);
      alert(err.response?.data?.error || "Failed to create candy");
    }
  };

  return (
    <div>
      <h2>Candy Master</h2>

      {/* CREATE CANDY */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Candy name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Milk</option>
          <option>Dark</option>
          <option>Dragee</option>
        </select>

        <input
          placeholder="Price"
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={createCandy}>Add Candy</button>
      </div>

      {/* LIST */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {candies.length === 0 && (
            <tr>
              <td colSpan="3">No candies found</td>
            </tr>
          )}

          {candies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.category}</td>
              <td>₹{c.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
