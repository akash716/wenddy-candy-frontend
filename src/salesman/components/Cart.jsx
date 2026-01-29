import React, { useEffect, useState } from "react";
import api from "../../api"; // adjust path if needed

export default function Cart({ cart, setCart, stallId, onSaleComplete }) {
  const [finalTotal, setFinalTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const preview = async () => {
      if (!cart.length) {
        setFinalTotal(null);
        return;
      }

      try {
        const res = await api.post("/salesman/preview", {
          lines: cart
        });

        setFinalTotal(Number(res.data?.total || 0));
      } catch (e) {
        console.error("Preview error:", e);
        setFinalTotal(null);
      }
    };

    preview();
  }, [cart]);

  const removeLine = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const checkout = async () => {
    if (!stallId) {
      alert("Invalid stall");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/salesman/${stallId}/sell`, {
        lines: cart
      });

      if (finalTotal === null || isNaN(finalTotal)) {
        throw new Error("Invalid bill amount");
      }

      alert(`✅ Sale completed\nBill: ₹${finalTotal.toFixed(2)}`);

      setCart([]);
      onSaleComplete?.();
    } catch (e) {
      alert(e.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 10,
        background: "var(--panel-bg)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-color)"
      }}
    >
      <h3 style={{ marginTop: 0 }}>🛒 Cart</h3>

      {cart.map((l, i) => {
        /* ================= COMBO ================= */
        if (l.type === "COMBO") {
          const label =
            l.source === "BIG_COMBO" && l.items?.[0]?.name
              ? l.items[0].name
              : "Combo Applied";

          return (
            <div
              key={`combo-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                fontWeight: 600,
                color: "var(--offer-text)",
                background: "var(--offer-bg)",
                padding: "6px 8px",
                borderRadius: 6
              }}
            >
              <span>🎉 {label}</span>

              <div style={{ display: "flex", gap: 8 }}>
                <span>₹{Number(l.price).toFixed(2)}</span>
                <button
                  onClick={() => removeLine(i)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "var(--danger)"
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        }

        /* ================= ITEM ================= */
        if (l.type === "ITEM" && Array.isArray(l.items)) {
          const it = l.items[0];
          if (!it) return null;

          return (
            <div
              key={`item-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
                color: "var(--text-primary)"
              }}
            >
              <span>
                {it.name} ₹{Number(it.price).toFixed(2)}
              </span>

              <button
                onClick={() => removeLine(i)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "var(--danger)"
                }}
              >
                ✕
              </button>
            </div>
          );
        }

        return null;
      })}

      <hr style={{ borderColor: "var(--border-color)" }} />

      {finalTotal !== null && (
        <h3 style={{ marginBottom: 12 }}>
          Total ₹{finalTotal.toFixed(2)}
        </h3>
      )}

      <button
        onClick={checkout}
        disabled={!cart.length || loading}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "none",
          background: "var(--btn-primary)",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? "PROCESSING..." : "DONE"}
      </button>
    </div>
  );
}
