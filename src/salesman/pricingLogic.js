export function calculateTotal(items) {
  let total = 0;

  // Count by price
  const counts = {};
  items.forEach(i => {
    counts[i.price] = (counts[i.price] || 0) + 1;
  });

  /* -----------------------------
     1️⃣ MIXED OFFER
     2 × 80 + 1 × 65 → 220
  -------------------------------- */
  const mixedCombos = Math.min(
    Math.floor((counts[80] || 0) / 2),
    Math.floor((counts[65] || 0) / 1)
  );

  if (mixedCombos > 0) {
    total += mixedCombos * 220;
    counts[80] -= mixedCombos * 2;
    counts[65] -= mixedCombos * 1;
  }

  /* -----------------------------
     2️⃣ OFFER: 3 × 80 → 230
  -------------------------------- */
  if ((counts[80] || 0) >= 3) {
    const combos = Math.floor(counts[80] / 3);
    total += combos * 230;
    counts[80] -= combos * 3;
  }

  /* -----------------------------
     3️⃣ OFFER: 3 × 65 → 180
  -------------------------------- */
  if ((counts[65] || 0) >= 3) {
    const combos = Math.floor(counts[65] / 3);
    total += combos * 180;
    counts[65] -= combos * 3;
  }

  /* -----------------------------
     4️⃣ Remaining items at MRP
  -------------------------------- */
  Object.keys(counts).forEach(price => {
    total += counts[price] * Number(price);
  });

  return total;
}
