import React, { useEffect, useState } from "react";
import api from "../../api";

export default function Cart({ cart, setCart, stallId, onSaleComplete }) {
  const [finalTotal, setFinalTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     🔥 FIND COMBO PRICES
  ========================= */
  const comboPrices = cart
    .filter((l) => l.type === "COMBO")
    .map((l) => Number(l.price));

  /* =========================
     🔥 PREVIEW (BACKEND TRUTH)
  ========================= */
  useEffect(() => {
    const preview = async () => {
      if (!cart.length) {
        setFinalTotal(null);
        return;
      }

      try {
        const res = await api.post("/salesman/preview", {
          lines: cart,
        });

        setFinalTotal(Number(res.data.total));
      } catch (err) {
        console.error("PREVIEW ERROR:", err);
        setFinalTotal(null);
      }
    };

    preview();
  }, [cart]);

  const removeLine = (i) =>
    setCart(cart.filter((_, idx) => idx !== i));

  /* =========================
     🔥 CHECKOUT
  ========================= */
  const checkout = async () => {
    if (!stallId) {
      alert("Stall not selected");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        `/salesman/${stallId}/sell`,
        { lines: cart }
      );

      alert(`✅ Sale completed\nBill: ₹${res.data.total}`);

      setCart([]);
      onSaleComplete?.();
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      alert(
        err.response?.data?.error ||
          "Failed to complete sale"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🔥 RENDER (UI ONLY)
  ========================= */
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid var(--border-color)",
        background: "var(--panel-bg)",
        width: 300
      }}
    >
      <h3 style={{ marginBottom: 10 }}>🛒 Cart</h3>

      {/* ✅ OFFER APPLIED (UI ONLY) */}
      {cart.some((l) => l.type === "COMBO") && (
        <div
          style={{
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 6,
            background: "var(--offer-bg)",
            color: "var(--offer-text)",
            marginBottom: 12,
            display: "inline-block"
          }}
        >
          🎉 Offer Applied
        </div>
      )}

      {cart.map((line, i) => {
        /* ---------- COMBO ---------- */
        if (line.type === "COMBO") {
          return (
            <div key={i} style={rowStyle}>
              <strong>
                Combo Offer ₹{Number(line.price).toFixed(2)}
              </strong>
              <button
                onClick={() => removeLine(i)}
                style={removeBtnStyle}
              >
                ✕
              </button>
            </div>
          );
        }

        /* ---------- ITEM ---------- */
        const it = line.items[0];
        const itemPrice = Number(it.price);

        // 🔥 hide ONLY if same-price combo exists
        if (comboPrices.includes(itemPrice)) {
          return null;
        }

        return (
          <div key={i} style={rowStyle}>
            <span>
              {it.name} ₹{itemPrice.toFixed(2)}
            </span>
            <button
              onClick={() => removeLine(i)}
              style={removeBtnStyle}
            >
              ✕
            </button>
          </div>
        );
      })}

      <hr style={{ margin: "12px 0", borderColor: "var(--border-color)" }} />

      {/* ✅ TOTAL (UNCHANGED LOGIC, BETTER UI) */}
      {finalTotal !== null && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            marginBottom: 12
          }}
        >
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      )}

      <button
        onClick={checkout}
        disabled={!cart.length || loading}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          fontWeight: 600
        }}
      >
        {loading ? "PROCESSING..." : "DONE"}
      </button>
    </div>
  );
}

/* =========================
   🎨 UI-ONLY STYLES
========================= */
const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10
};

const removeBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "1px solid var(--border-color)",
  background: "transparent",
  color: "var(--danger)",
  fontSize: 16,
  lineHeight: "26px",
  cursor: "pointer",
  flexShrink: 0
};
