// src/components/SingleGrid.jsx
import React from "react";

export default function SingleGrid({ candies = [], onAdd }) {
  if (!candies || candies.length === 0) {
    return (
      <p style={{ color: "var(--text-muted)" }}>
        No candies available
      </p>
    );
  }

  const sorted = [...candies].sort(
    (a, b) => Number(a.price) - Number(b.price)
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {sorted.map((c) => {
        const outOfStock = (c.stock ?? 0) <= 0;

        return (
          <div
            key={c.id}
            style={{
              border: "1px solid var(--border-color)",
              padding: 12,
              borderRadius: 8,
              width: 180,
              background: "var(--card-bg)",
              color: "var(--text-primary)",
              transition: "all 0.2s ease"
            }}
          >
            <strong>{c.name}</strong>
            <div>₹{Number(c.price).toFixed(2)}</div>
            <div style={{ fontSize: 13 }}>
              Stock: {c.stock ?? 0}
            </div>

            <button
              disabled={outOfStock}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "6px 0",
                borderRadius: 4,
                border: "none",
                background: outOfStock
                  ? "var(--btn-disabled)"
                  : "var(--btn-primary)",
                color: outOfStock ? "#888" : "#fff",
                cursor: outOfStock ? "not-allowed" : "pointer"
              }}
              onClick={() => onAdd({ ...c })}
            >
              {outOfStock ? "Out of stock" : "Add"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
