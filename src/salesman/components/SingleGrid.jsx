import React from "react";
import api from "../../api"; // adjust path if needed

// derive base url safely from axios instance
const BASE_URL = api.defaults.baseURL.replace("/api", "");

export default function SingleGrid({ candies = [], onSelect }) {
  if (!candies.length) {
    return (
      <p style={{ color: "var(--text-secondary)" }}>
        No candies available
      </p>
    );
  }

  /* ===============================
     SORTING LOGIC
     - price ascending
     - Hazelnut ALWAYS LAST
  =============================== */
  const sorted = [...candies].sort((a, b) => {
    if (a.name === "Hazelnut") return 1;
    if (b.name === "Hazelnut") return -1;
    return Number(a.price) - Number(b.price);
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
        gap: 16
      }}
    >
      {sorted.map(c => {
        const outOfStock = (c.stock ?? 0) <= 0;

        return (
          <div
            key={c.id}
            onClick={() => {
              if (!outOfStock) onSelect({ ...c });
            }}
            style={{
              borderRadius: 14,
              overflow: "hidden",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              cursor: outOfStock ? "not-allowed" : "pointer",
              opacity: outOfStock ? 0.45 : 1,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 6px 14px rgba(0,0,0,0.25)"
            }}
          >
            {/* ================= IMAGE ================= */}
            <div
              style={{
                position: "relative",
                height: 150,
                background: "var(--image-bg)"
              }}
            >
              {c.image ? (
                <img
                  src={`${BASE_URL}${c.image}`}
                  alt={c.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    fontSize: 13
                  }}
                >
                  No Image
                </div>
              )}

              {/* PRICE */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: "#000",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                ₹{Number(c.price).toFixed(0)}
              </div>

              {/* STOCK */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: outOfStock ? "#c00" : "#0a8",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600
                }}
              >
                {outOfStock ? "OUT" : `Stock ${c.stock}`}
              </div>
            </div>

            {/* ================= NAME ================= */}
            <div
              style={{
                padding: "10px 12px",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "var(--text-primary)"
                }}
              >
                {c.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
