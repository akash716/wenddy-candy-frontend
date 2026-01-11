import React from "react";
import api from "../../api"; // ✅ axios instance (Render backend)

export default function Cart({
  cart = [],
  setCart,
  stallId,
  onSaleComplete
}) {
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const checkout = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      // 1️⃣ BUILD LINES PAYLOAD
      const lines = cart.map((item) => {
        const isSingle = !item.items;

        // 🔹 SINGLE ITEM
        if (isSingle) {
          return {
            type: "SINGLE",
            price: Number(item.price),
            items: [
              {
                candy_id: item.candy_id || item.id,
                qty: 1
              }
            ]
          };
        }

        // 🔸 COMBO ITEM
        return {
          type: "COMBO",
          offer_id: item.offer_id || item.id,
          price: Number(item.price),
          items: item.items.map((c) => ({
            candy_id: c.candy_id || c.id,
            qty: 1
          }))
        };
      });

      // 2️⃣ FINAL PAYLOAD
      const payload = {
        bill: {
          total: cart.reduce(
            (sum, i) => sum + Number(i.price || 0),
            0
          )
        },
        lines
      };

      console.log("CHECKOUT PAYLOAD:", payload);

      // 3️⃣ API CALL (RENDER BACKEND)
      const res = await api.post(
        `/salesman/${stallId}/sell`,
        payload
      );

      if (!res.data) {
        throw new Error("Checkout failed");
      }

      alert("Sale completed successfully");

      setCart([]);
      onSaleComplete?.();

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Checkout failed"
      );
    }
  };

  return (
    <div style={{ padding: 16, borderLeft: "1px solid #ddd", minWidth: 280 }}>
      <h3>Cart</h3>

      {cart.length === 0 && <p>No items added</p>}

      {cart.map((item, idx) => {
        const isSingle = !item.items;

        return (
          <div
            key={idx}
            style={{
              border: "1px solid #eee",
              borderRadius: 6,
              padding: isSingle ? "6px 8px" : "10px",
              marginBottom: 8,
              position: "relative",
              background: "#fff"
            }}
          >
            {/* ❌ REMOVE BUTTON */}
            <button
              onClick={() => removeFromCart(idx)}
              style={{
                position: "absolute",
                right: 6,
                top: 6,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                color: "#ff4d6d"
              }}
            >
              ✕
            </button>

            {/* 🔹 SINGLE ITEM */}
            {isSingle && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingRight: 20
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 14 }}>
                  ₹{Number(item.price).toFixed(2)}
                </span>
              </div>
            )}

            {/* 🔸 COMBO ITEM */}
            {!isSingle && (
              <>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>
                  {item.items.map((i) => i.name).join(", ")}
                </div>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  ₹{Number(item.price).toFixed(2)}
                </div>
              </>
            )}
          </div>
        );
      })}

      <hr />

      <h4>Total: ₹{total.toFixed(2)}</h4>

      <button
        disabled={cart.length === 0}
        onClick={checkout}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          cursor: cart.length === 0 ? "not-allowed" : "pointer"
        }}
      >
        DONE
      </button>
    </div>
  );
}
