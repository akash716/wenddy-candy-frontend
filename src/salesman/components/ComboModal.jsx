import React, { useState } from "react";

export default function ComboModal({ offer, candies, onClose, onAdd }) {
  const [selected, setSelected] = useState([]);

  const toggle = (candy) => {
    // ❌ Block out-of-stock candies
    if (candy.stock <= 0) return;

    const exists = selected.find(i => i.id === candy.id);

    if (exists) {
      // remove
      setSelected(selected.filter(i => i.id !== candy.id));
    } else {
      // add only if combo not full
      if (selected.length < offer.combo_size) {
        setSelected([...selected, candy]);
      }
    }
  };

  const isComplete = selected.length === offer.combo_size;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{offer.title}</h3>
        <p>Select exactly {offer.combo_size} different chocolates</p>

        <div style={gridStyle}>
          {candies.map(candy => {
            const isSelected = selected.some(i => i.id === candy.id);

            const isOutOfStock = candy.stock <= 0;
            const comboFull = selected.length === offer.combo_size;

            const disabled =
              isOutOfStock || (!isSelected && comboFull);

            return (
              <button
                key={candy.id}
                disabled={disabled}
                onClick={() => toggle(candy)}
                style={{
                  padding: 10,
                  border: "1px solid #ccc",
                  background: isSelected ? "#000" : "#fff",
                  color: isSelected ? "#fff" : "#000",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: isOutOfStock ? 0.4 : 1
                }}
              >
                {candy.name}
                <div style={{ fontSize: 12 }}>
                  {isOutOfStock ? "Out of stock" : `Stock: ${candy.stock}`}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={!isComplete}
            style={{ marginLeft: 10 }}
            onClick={() => {
              // 🛑 Safety check
              if (!isComplete) {
                alert(`Select ${offer.combo_size} chocolates`);
                return;
              }

              onAdd({
                type: "COMBO",
                offer_id: offer.id,
                title: offer.title,
                price: Number(offer.price),
                items: selected
              });
            }}
          >
            Add Combo (₹{offer.price})
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  padding: 20,
  width: 420,
  borderRadius: 6
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
  marginTop: 10
};
