// src/components/Tabs.jsx
import React from "react";

export default function Tabs({ active, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={() => onChange("SINGLE")}
        style={{
          marginRight: 8,
          fontWeight: active === "SINGLE" ? "bold" : "normal"
        }}
      >
        Singles
      </button>

      <button
        onClick={() => onChange("COMBO")}
        style={{
          fontWeight: active === "COMBO" ? "bold" : "normal"
        }}
      >
        Combos
      </button>
    </div>
  );
}
