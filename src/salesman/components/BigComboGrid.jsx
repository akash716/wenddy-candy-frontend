import React from "react";
import api from "../../api"; // adjust path if needed

// derive base url safely from axios instance
const BASE_URL = api.defaults.baseURL.replace("/api", "");

export default function BigComboGrid({
  candies = [],
  selectedIds = [],
  onSelect
}) {
  const bigCombos = candies
    .filter(c => Number(c.price) === 180 || Number(c.price) === 230)
    .sort((a, b) => {
      if (Number(a.price) !== Number(b.price)) {
        return Number(a.price) - Number(b.price);
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      {/* INFO */}
      <div
        style={{
          marginBottom: 12,
          color: "var(--text-muted)"
        }}
      >
        Tap chocolates to build big combo (tap again to remove)
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16
        }}
      >
        {bigCombos.map(c => {
          const selected = selectedIds.includes(c.id);
          const outOfStock = (c.stock ?? 0) <= 0;

          return (
            <div
              key={c.id}
              onClick={() => {
                if (outOfStock) return;
                onSelect(c, { unselect: selected });
              }}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: selected
                  ? "3px solid var(--btn-primary)"
                  : "1px solid var(--border-color)",
                background: "var(--card-bg)",
                cursor: outOfStock ? "not-allowed" : "pointer",
                opacity: outOfStock ? 0.45 : 1,
                transform: selected ? "scale(1.03)" : "scale(1)",
                transition: "all 0.15s ease"
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  height: 140,
                  position: "relative",
                  background: "var(--image-bg)"
                }}
              >
                {c.image ? (
                  <img
                    src={`${BASE_URL}${c.image}`}
                    alt={c.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)"
                    }}
                  >
                    No Image
                  </div>
                )}

                {/* PRICE BADGE */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: "var(--btn-primary)",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  ₹{Number(c.price).toFixed(0)}
                </div>
              </div>

              {/* NAME */}
              <div
                style={{
                  padding: 10,
                  textAlign: "center",
                  fontWeight: 700,
                  color: "var(--text-primary)"
                }}
              >
                {c.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
