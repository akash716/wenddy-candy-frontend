import React, { useState } from "react";
import menu from "./menuData";
import ChocolateCard from "./ChocolateCard";
import OfferBanner from "./OfferBanner";
import { calculateTotal } from "./pricingLogic";
import api from "../api";

export default function Salesman() {
  const [selected, setSelected] = useState([]);
  const [uiCounts, setUiCounts] = useState({});
  const [loading, setLoading] = useState(false);

  const addItem = (item) => {
    setSelected(prev => [...prev, item]);
    setUiCounts(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeItem = (item) => {
    const idx = selected.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      const copy = [...selected];
      copy.splice(idx, 1);
      setSelected(copy);
    }

    setUiCounts(prev => ({
      ...prev,
      [item.id]: Math.max((prev[item.id] || 0) - 1, 0)
    }));
  };

  const total = calculateTotal(selected);

  const buildCheckoutPayload = () => {
    const counts = {};
    selected.forEach(i => counts[i.id] = (counts[i.id] || 0) + 1);

    const lines = [];

    Object.entries(counts).forEach(([id, qty]) => {
      const item = selected.find(i => i.id === id);
      if (item.price === 65 && qty >= 3) {
        const n = Math.floor(qty / 3);
        lines.push({
          type: "COMBO",
          price: n * 180,
          items: [{ id, qty: n * 3 }]
        });
        counts[id] -= n * 3;
      }
    });

    Object.entries(counts).forEach(([id, qty]) => {
      if (qty > 0) {
        const item = selected.find(i => i.id === id);
        lines.push({
          type: "SINGLE",
          price: item.price * qty,
          items: [{ id, qty }]
        });
      }
    });

    return { bill: { total }, lines };
  };

  const handleCheckout = async () => {
    if (selected.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);
    const payload = buildCheckoutPayload();

    try {
      await api.post("/sales/checkout", payload);
      alert("Sale completed successfully");
      setSelected([]);
      setUiCounts({});
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos">
      <div className="menu">
        <OfferBanner />
        {menu.map(section => (
          <div key={section.category}>
            <h2>{section.category}</h2>
            <div className="grid">
              {section.items.map(item => (
                <ChocolateCard
                  key={item.id}
                  item={item}
                  count={uiCounts[item.id] || 0}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {selected.map((i, idx) => (
          <div key={idx}>{i.name} — ₹{i.price}</div>
        ))}
        <h3>Total: ₹{total}</h3>
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? "Processing..." : "DONE"}
        </button>
      </div>
    </div>
  );
}
