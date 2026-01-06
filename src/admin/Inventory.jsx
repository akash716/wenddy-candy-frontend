import React, { useEffect, useState } from "react";
import api from "../api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/inventory")
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Inventory fetch error:", err);
        setLoading(false);
      });
  }, []);

  const updateStock = (id, stock) => {
    api
      .put(`/admin/inventory/${id}`, { stock })
      .then(() => alert("Stock updated"))
      .catch(() => alert("Failed to update stock"));
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Candy</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>₹{item.mrp}</td>
              <td>
                <input
                  type="number"
                  defaultValue={item.stock}
                  id={`stock-${item.id}`}
                />
              </td>
              <td>
                <button
                  onClick={() =>
                    updateStock(
                      item.id,
                      document.getElementById(`stock-${item.id}`).value
                    )
                  }
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
