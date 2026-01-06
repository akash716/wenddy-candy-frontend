import React, { useState } from "react";

export default function OfferForm({ products, onSave, editing }) {
  const [title, setTitle] = useState(editing?.title || "");
  const [packSize, setPackSize] = useState(editing?.packSize || 3);
  const [active, setActive] = useState(editing?.active ?? true);
  const [allowed, setAllowed] = useState(editing?.allowedProducts || []);

  const toggleProduct = (id) => {
    setAllowed(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const submit = () => {
    onSave({
      ...editing,
      title,
      packSize,
      active,
      allowedProducts: allowed
    });

    setTitle("");
    setPackSize(3);
    setActive(true);
    setAllowed([]);
  };

  return (
    <div className="admin-card">
      <h3>Offers</h3>

      <label>Offer Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} />

      <label>Pack Size</label>
      <input
        type="number"
        value={packSize}
        min={2}
        onChange={e => setPackSize(Number(e.target.value))}
      />

      <div>
        <input
          type="checkbox"
          checked={active}
          onChange={() => setActive(!active)}
        />
        <label> Active</label>
      </div>

      <h4>Allowed Products</h4>
      {products.map(p => (
        <div key={p.id}>
          <input
            type="checkbox"
            checked={allowed.includes(p.id)}
            onChange={() => toggleProduct(p.id)}
          />
          <label>
            {p.name} (₹{p.price})
          </label>
        </div>
      ))}

      <button onClick={submit}>Save Offer</button>
    </div>
  );
}
