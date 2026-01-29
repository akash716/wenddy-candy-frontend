import React, { useEffect, useState } from "react";
import api from "../../../api"; // adjust path if needed

export default function StallInventory({ stallId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!stallId) return;

    setLoading(true);

    api
      .get(`/admin/inventory/${stallId}`)
      .then(res => {
        setItems(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("INVENTORY LOAD ERROR:", err);
        alert("Failed to load inventory");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stallId]);

  const handleChange = (candyId, value) => {
    setItems(prev =>
      prev.map(i =>
        i.candy_id === candyId
          ? { ...i, stock: Number(value) }
          : i
      )
    );
  };

  /* ===============================
     SAVE ALL STOCKS
  =============================== */
  const saveAll = async () => {
    try {
      setSaving(true);

      await api.post(
        `/admin/inventory/${stallId}/bulk`,
        {
          items: items.map(i => ({
            candyId: i.candy_id,
            stock: Number(i.stock)
          }))
        }
      );

      alert("Inventory updated successfully");
    } catch (e) {
      console.error("INVENTORY SAVE ERROR:", e);
      alert("Failed to save inventory");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)" }}>Loading inventory…</p>;
  }

  return (
    <div
      style={{
        background: "var(--panel-bg)",
        padding: 16,
        borderRadius: 12,
        border: "1px solid var(--border-color)"
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 16 }}>
        Stall Inventory
      </h3>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14
        }}
      >
        {items.map(i => (
          <div
            key={i.candy_id}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid var(--border-color)",
              background: "var(--card-bg)",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            {/* NAME */}
            <div
              style={{
                fontWeight: 600,
                color: "var(--text-primary)"
              }}
            >
              {i.name}
            </div>

            {/* PRICE */}
            <div
              style={{
                fontSize: 14,
                color: "var(--text-muted)"
              }}
            >
              ₹{Number(i.price).toFixed(0)}
            </div>

            {/* STOCK INPUT */}
            <input
              type="number"
              min="0"
              value={i.stock}
              onChange={e =>
                handleChange(i.candy_id, e.target.value)
              }
              style={{
                marginTop: 6,
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid var(--border-color)",
                background: "var(--bg-main)",
                color: "var(--text-primary)"
              }}
            />
          </div>
        ))}
      </div>

      {/* SAVE ALL */}
      <button
        onClick={saveAll}
        disabled={saving}
        style={{
          marginTop: 18,
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "none",
          background: "var(--btn-primary)",
          color: "#fff",
          fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1
        }}
      >
        {saving ? "Saving…" : "Save All Changes"}
      </button>
    </div>
  );
}
