import React from "react";

export default function ChocolateCard({ item, count, onAdd, onRemove }) {
  return (
    <div className="card">
      <h4>{item.name}</h4>
      <p className="code">({item.id})</p>
      <p className="price">₹{item.price}</p>

      <div className="counter">
        <button onClick={onRemove} disabled={count === 0}>−</button>
        <span>{count}</span>
        <button onClick={onAdd}>+</button>
      </div>
    </div>
  );
}
