import React, { useState } from "react";

export default function ComboModal({ offer, candies, onAdd, onClose }) {
  const [selected, setSelected] = useState({});

  const addFlavour = (candy) => {
    const copy = { ...selected };
    copy[candy.id] = (copy[candy.id] || 0) + 1;
    setSelected(copy);
  };

  const totalQty = Object.values(selected).reduce((a, b) => a + b, 0);

  const confirm = () => {
    if (totalQty !== 3) {
      alert("Select exactly 3 chocolates");
      return;
    }

    const flavours = Object.entries(selected).map(([id, qty]) => ({
      candyId: id,
      qty,
    }));

    onAdd({
      type: "COMBO",
      offerId: offer.id,
      flavours,
      price: offer.price,
    });
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Select 3 Chocolates</h3>

        {candies.map((c) => (
          <button key={c.id} onClick={() => addFlavour(c)}>
            {c.name}
          </button>
        ))}

        <p>Selected: {totalQty} / 3</p>

        <button onClick={confirm}>Add Combo</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
