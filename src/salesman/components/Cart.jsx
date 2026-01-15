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
     🔥 RENDER
  ========================= */
  return (
    <div style={{ padding: 16 }}>
      <h3>🛒 Cart</h3>

      {cart.map((line, i) => {
        /* ---------- COMBO ---------- */
        if (line.type === "COMBO") {
          return (
            <div key={i} style={{ marginBottom: 8 }}>
              <b>Combo Offer ₹{Number(line.price).toFixed(2)}</b>
              <button onClick={() => removeLine(i)}>✕</button>
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
          <div key={i} style={{ marginBottom: 6 }}>
            {it.name} ₹{itemPrice.toFixed(2)}
            <button onClick={() => removeLine(i)}>✕</button>
          </div>
        );
      })}

      <hr />

      {finalTotal !== null && (
        <h3>Total ₹{finalTotal.toFixed(2)}</h3>
      )}

      <button onClick={checkout} disabled={!cart.length || loading}>
        {loading ? "PROCESSING..." : "DONE"}
      </button>
    </div>
  );
}
