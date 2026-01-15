// src/components/SingleGrid.jsx
import React from "react";

export default function SingleGrid({ candies = [], onAdd }) {
  if (!candies || candies.length === 0) {
    return <p>No candies available</p>;
  }

  const sorted = [...candies].sort((a, b) => Number(a.price) - Number(b.price));

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {sorted.map(c => (
        <div key={c.id} style={{
          border: "1px solid #ccc", padding: 12, borderRadius: 6, width: 180, background: "#fff"
        }}>
          <strong>{c.name}</strong>
          <div>₹{Number(c.price).toFixed(2)}</div>
          <div>Stock: {c.stock ?? 0}</div>

          <button
            disabled={(c.stock ?? 0) <= 0}
            style={{ marginTop: 8 }}
            onClick={() => onAdd({ ...c })}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
