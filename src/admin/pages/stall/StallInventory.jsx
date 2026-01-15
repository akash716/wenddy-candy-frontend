import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function StallInventory({ stallId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD INVENTORY ================= */
  useEffect(() => {
    if (!stallId) return;

    const loadInventory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/inventory/${stallId}`);
        setItems(res.data || []);
      } catch (err) {
        console.error("INVENTORY LOAD ERROR:", err);
        alert("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [stallId]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (candyId, value) => {
    setItems((prev) =>
      prev.map((i) =>
        i.candy_id === candyId
          ? { ...i, stock: value }
          : i
      )
    );
  };

  /* ================= SAVE STOCK ================= */
  const saveStock = async (candyId, stock) => {
    try {
      await api.post(`/admin/inventory/${stallId}`, {
        candyId,
        stock: Number(stock),
      });

      alert("Stock updated");
    } catch (err) {
      console.error("STOCK UPDATE ERROR:", err);
      alert("Failed to update stock");
    }
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div>
      <h3>Stall Inventory</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Candy</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => (
            <tr key={i.candy_id}>
              <td>{i.name}</td>
              <td>₹{i.price}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={i.stock}
                  onChange={(e) =>
                    handleChange(i.candy_id, e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  onClick={() =>
                    saveStock(i.candy_id, i.stock)
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
