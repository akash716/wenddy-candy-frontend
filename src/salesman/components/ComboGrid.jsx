import React from "react";

export default function ComboGrid({
  offers = [],
  selectedIds = [],
  onSelect
}) {
  if (!offers.length) {
    return (
      <p style={{ color: "var(--text-muted)" }}>
        No combo offers available
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {offers.map((offer) => (
        <div key={offer.id}>
          {/* ===== OFFER HEADER ===== */}
          <div style={{ marginBottom: 10 }}>
            <strong style={{ color: "var(--text-primary)" }}>
              Pick {offer.unique_count} chocolates @ ₹{offer.price}
            </strong>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Offer ₹{offer.offer_price}
            </div>
          </div>

          {/* ===== GRID ===== */}
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
    border: selected
      ? "2px solid var(--btn-primary)"
      : "1px solid var(--border-color)",
    padding: 12,
    borderRadius: 8,
    width: 180,
    background: selected
      ? "var(--card-selected)"
      : "var(--card-bg)",
    color: "var(--text-primary)",
    cursor: outOfStock ? "not-allowed" : "pointer",
    opacity: outOfStock ? 0.5 : 1,
    transition: "all 0.2s ease"
  }}
>
  <strong>{c.name}</strong>
  <div>₹{Number(c.price).toFixed(2)}</div>
  <div style={{ fontSize: 13 }}>
    Stock: {c.stock ?? 0}
  </div>
</div>

              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
