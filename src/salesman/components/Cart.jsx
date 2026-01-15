import React, { useEffect, useState } from "react";

export default function Cart({ cart, setCart, stallId, onSaleComplete }) {
  const [finalTotal, setFinalTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     🔥 FIND COMBO PRICES
  ========================= */
  const comboPrices = cart
    .filter(l => l.type === "COMBO")
    .map(l => Number(l.price));

  /* =========================
     🔥 PREVIEW (BACKEND TRUTH)
  ========================= */
  useEffect(() => {
    const preview = async () => {
      if (!cart.length) {
        setFinalTotal(null);
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/salesman/preview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: cart })
        }
      );

      const data = await res.json();
      setFinalTotal(Number(data.total));
    };

    preview();
  }, [cart]);

  const removeLine = (i) =>
    setCart(cart.filter((_, idx) => idx !== i));

  /* =========================
     🔥 CHECKOUT
  ========================= */
  const checkout = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/salesman/${stallId}/sell`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: cart })
        }
      );

      const data = await res.json();
      alert(`✅ Sale completed\nBill: ₹${data.total}`);

      setCart([]);
      onSaleComplete?.();
    } catch (e) {
      alert(e.message);
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
