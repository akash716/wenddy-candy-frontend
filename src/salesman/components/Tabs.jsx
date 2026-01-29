import React from "react";

export default function Tabs({ active, onChange }) {
  const tabStyle = (isActive) => ({
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid var(--border-color)",
    background: isActive
      ? "var(--btn-primary)"
      : "var(--card-bg)",
    color: isActive
      ? "#fff"
      : "var(--text-primary)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: 110,
    textAlign: "center"
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        marginBottom: 14
      }}
    >
      <button
        onClick={() => onChange("SINGLE")}
        style={tabStyle(active === "SINGLE")}
      >
        Singles
      </button>

      <button
        onClick={() => onChange("COMBO")}
        style={tabStyle(active === "COMBO")}
      >
        Combos
      </button>

      <button
        onClick={() => onChange("BIG_COMBO")}
        style={tabStyle(active === "BIG_COMBO")}
      >
        Big Combos
      </button>
    </div>
  );
}
