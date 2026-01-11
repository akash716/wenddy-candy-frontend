import React from "react";

export default function SingleGrid({ candies = [], onAdd }) {
  if (!candies.length) {
    return <p>No candies available</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {candies.map(c => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 6,
            width: 180
          }}
        >
          <strong>{c.name}</strong>
          <div>₹{c.price}</div>
          <div>Stock: {c.stock}</div>

          <button
            disabled={c.stock <= 0}
            style={{ marginTop: 8 }}
            onClick={() => {
              console.log("ADDING SINGLE:", c); // 🔍 DEBUG (optional)

              onAdd({
                type: "SINGLE",     // 🔥 REQUIRED
                candy_id: c.id,     // 🔥 REQUIRED (NOT c.candy_id)
                name: c.name,
                price: c.price,
                stock: c.stock
              });
            }}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
