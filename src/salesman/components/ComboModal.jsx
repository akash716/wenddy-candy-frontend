// src/components/ComboModal.jsx
import React, { useState } from "react";

export default function ComboModal({
  offer,
  candies,
  onClose,
  onAdd
}) {
  const [selected, setSelected] = useState([]);

  const toggle = (c) => {
    if (c.stock <= 0) return;

    const exists = selected.some(i => i.id === c.id);

    if (exists) {
      setSelected(selected.filter(i => i.id !== c.id));
      return;
    }

    if (selected.length >= offer.unique_count) return;

    setSelected([...selected, c]);
  };

  const complete = selected.length === offer.unique_count;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>
          Pick {offer.unique_count} chocolates
        </h3>

        <div style={grid}>
          {candies
            .filter(c => Number(c.price) === Number(offer.price))
            .map(c => {
              const active = selected.some(i => i.id === c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c)}
                  disabled={
                    c.stock <= 0 ||
                    (!active && selected.length === offer.unique_count)
                  }
                  style={{
                    padding: 10,
                    border: "1px solid #ccc",
                    background: active ? "#000" : "#fff",
                    color: active ? "#fff" : "#000"
                  }}
                >
                  {c.name}
                  <div style={{ fontSize: 12 }}>
                    ₹{c.price}
                  </div>
                </button>
              );
            })}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={!complete}
            style={{ marginLeft: 8 }}
            onClick={() =>
              onAdd({
                type: "COMBO",
                offer_id: offer.combo_offer_id,
                title: `Combo @ ₹${offer.offer_price}`,
                price: offer.offer_price,
                items: selected.map(c => ({
                  candy_id: c.id,
                  qty: 1,
                  price: c.price
                }))
              })
            }
          >
            Add Combo ₹{offer.offer_price}
          </button>
        </div>
      </div>
    </div>
  );
}

/* styles */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#fff",
  padding: 20,
  width: 420,
  borderRadius: 6
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 10,
  marginTop: 10
};
