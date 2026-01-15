import React from "react";

export default function ComboGrid({
  offers = [],
  selectedIds = [],
  onSelect
}) {
  if (!offers.length) {
    return <p>No combo offers available</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {offers.map((offer) => (
        <div key={offer.id}>
          {/* ===== OFFER HEADER ===== */}
          <div style={{ marginBottom: 10 }}>
            <strong>
              Pick {offer.unique_count} chocolates @ ₹{offer.price}
            </strong>
            <div style={{ fontSize: 13, color: "#555" }}>
              Offer ₹{offer.offer_price}
            </div>
          </div>

          {/* ===== SAME LAYOUT AS SINGLE GRID ===== */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {offer.candies.map((c) => {
              const selected = selectedIds.includes(c.id);
              const outOfStock = (c.stock ?? 0) <= 0;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    if (!outOfStock) onSelect(c, offer);
                  }}
                  style={{
                    border: "1px solid #ccc",
                    padding: 12,
                    borderRadius: 6,
                    width: 180,
                    background: selected ? "#000" : "#fff",
                    color: selected ? "#fff" : "#000",
                    cursor: outOfStock ? "not-allowed" : "pointer",
                    opacity: outOfStock ? 0.4 : 1
                  }}
                >
                  <strong>{c.name}</strong>
                  <div>₹{Number(c.price).toFixed(2)}</div>
                  <div>Stock: {c.stock ?? 0}</div>

                  {outOfStock && (
                    <div style={{ fontSize: 12, color: "red", marginTop: 4 }}>
                      Out of stock
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
