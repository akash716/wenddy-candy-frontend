import React, { useEffect, useState } from "react";
import api from "../../../api"; // ✅ axios instance (Render backend)

export default function StallInventory({ stallId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD INVENTORY ================= */
  useEffect(() => {
    if (!stallId) return;

    setLoading(true);

    api
      .get(`/admin/inventory/${stallId}`)
      .then((res) => {
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("INVENTORY LOAD ERROR:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stallId]);

  /* ================= HANDLE STOCK CHANGE ================= */
  const handleChange = (candyId, value) => {
    setItems((prev) =>
      prev.map((i) =>
        i.candy_id === candyId
          ? { ...i, stock: Number(value) }
          : i
      )
    );
  };

  /* ================= SAVE STOCK ================= */
  const saveStock = async (candyId, stock) => {
    try {
      await api.post(`/admin/inventory/${stallId}`, {
        candyId,
        stock: Number(stock)
      });

      alert("Stock updated successfully");
    } catch (err) {
      console.error("SAVE INVENTORY ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to update stock"
      );
    }
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div>
      <h3>Stall Inventory</h3>

      {items.length === 0 && <p>No inventory found</p>}

      {items.length > 0 && (
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
                <td>₹{Number(i.price).toFixed(2)}</td>
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
      )}
    </div>
  );
}
