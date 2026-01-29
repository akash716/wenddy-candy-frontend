import React, { useEffect, useState } from "react";
import api from "../../../api"; // adjust path if needed

export default function StallCandies({ stallId }) {
  const [candies, setCandies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stallId) return;

    setLoading(true);

    api
      .get(`/admin/stalls/${stallId}/candies`)
      .then(res => {
        const data = res.data || {};

        // ✅ SORT BY PRICE ASCENDING
        const sorted = Array.isArray(data.allCandies)
          ? [...data.allCandies].sort(
              (a, b) => Number(a.price) - Number(b.price)
            )
          : [];

        setCandies(sorted);
        setSelected(Array.isArray(data.assignedCandyIds) ? data.assignedCandyIds : []);
      })
      .catch(err => {
        console.error("STALL CANDIES LOAD ERROR:", err);
        alert("Failed to load stall candies");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stallId]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const save = async () => {
    try {
      await api.post(`/admin/stalls/${stallId}/candies`, {
        candyIds: selected
      });

      alert("Candies assigned successfully");
    } catch (err) {
      console.error("STALL CANDIES SAVE ERROR:", err);
      alert("Failed to save candy assignment");
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)" }}>Loading candies…</p>;
  }

  return (
    <div
      style={{
        maxWidth: 520,
        background: "var(--panel-bg)",
        padding: 16,
        borderRadius: 12,
        border: "1px solid var(--border-color)"
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>
        Assign Candies
      </h3>

      {/* LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 420,
          overflowY: "auto",
          paddingRight: 4
        }}
      >
        {candies.map(c => {
          const checked = selected.includes(c.id);

          return (
            <label
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                background: checked
                  ? "var(--card-selected)"
                  : "var(--card-bg)",
                border: "1px solid var(--border-color)",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(c.id)}
                />
                <span
                  style={{
                    fontWeight: 500,
                    color: "var(--text-primary)"
                  }}
                >
                  {c.name}
                </span>
              </div>

              <span
                style={{
                  fontWeight: 600,
                  color: "var(--text-muted)"
                }}
              >
                ₹{Number(c.price).toFixed(0)}
              </span>
            </label>
          );
        })}
      </div>

      {/* ACTION */}
      <button
        onClick={save}
        style={{
          marginTop: 16,
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "none",
          background: "var(--btn-primary)",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
