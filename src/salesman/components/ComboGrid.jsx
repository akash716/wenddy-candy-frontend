import React from "react";

export default function ComboGrid({ offers = [], onSelect }) {
  return (
    <div>
      <h3>Combos</h3>

      {offers.length === 0 && <p>No combos available</p>}

      {offers.map(offer => {
        // ✅ Count candies with stock > 0
        const availableCount = offer.allowed_candies.filter(
          c => c.stock > 0
        ).length;

        const disabled = availableCount < offer.combo_size;

        return (
          <div
            key={offer.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              opacity: disabled ? 0.5 : 1
            }}
          >
            <strong>{offer.title}</strong>

            <div>
              Pick {offer.combo_size} different chocolates
            </div>

            <div>₹{offer.price}</div>

            {disabled && (
              <div style={{ color: "red", fontSize: 12 }}>
                Combo unavailable (insufficient stock)
              </div>
            )}

            <button
              style={{ marginTop: 8 }}
              disabled={disabled}
              onClick={() => onSelect(offer)}
            >
              Select
            </button>
          </div>
        );
      })}
    </div>
  );
}
