import React, { useEffect, useState } from "react";

export default function StallInventory({ stallId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/inventory/${stallId}`)
      .then(res => res.json())
      .then(data => {
        setItems(data || []);
        setLoading(false);
      });
  }, [stallId]);

  const handleChange = (candyId, value) => {
    setItems(prev =>
      prev.map(i =>
        i.candy_id === candyId
          ? { ...i, stock: value }
          : i
      )
    );
  };

  const saveStock = async (candyId, stock) => {
    await fetch(`http://localhost:5000/api/admin/inventory/${stallId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candyId,
        stock: Number(stock)
      })
    });

    alert("Stock updated");
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
          {items.map(i => (
            <tr key={i.candy_id}>
              <td>{i.name}</td>
              <td>₹{i.price}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={i.stock}
                  onChange={e =>
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
