// src/SalesmanApp.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import useSalesmanConfig from "./hooks/useSalesmanConfig";
import Tabs from "./components/Tabs";
import SingleGrid from "./components/SingleGrid";
import ComboGrid from "./components/ComboGrid";
import BigComboGrid from "./components/BigComboGrid";
import Cart from "./components/Cart";

export default function SalesmanApp() {
  const { stallId } = useParams();

  if (!stallId) {
    return <p style={{ padding: 20 }}>Invalid stall</p>;
  }

  const { config, candies, reloadCandies, loading } =
    useSalesmanConfig(stallId);

  const [tab, setTab] = useState("SINGLE");
  const [cart, setCart] = useState([]);

  // buffer shared for COMBO & BIG_COMBO selection flow
  const [comboBuffer, setComboBuffer] = useState([]);

  if (loading) return <p>Loading...</p>;
  if (!config) return <p>Error loading config</p>;

  /* ================= SINGLE ================= */
  function handleSingleSelect(item) {
    if (item.stock <= 0) return alert("Out of stock");

    setCart(prev => [
      ...prev,
      {
        type: "ITEM",
        price: Number(item.price),
        items: [
          {
            candy_id: item.id,
            name: item.name,
            price: Number(item.price),
            qty: 1
          }
        ]
      }
    ]);
  }

  /* ================= COMBO HELPERS ================= */
  function getPriceCount(items) {
    const map = {};
    for (const c of items) {
      const p = Number(c.price);
      map[p] = (map[p] || 0) + 1;
    }
    return map;
  }

  function findMatchingOffer(selected) {
    if (!selected || !selected.length) return null;

    const count = getPriceCount(selected);

    // 1) MIXED PRICE RULES
    for (const o of config.offers) {
      if (o.price === null && Array.isArray(o.price_pattern)) {
        let ok = true;
        for (const p of o.price_pattern) {
          const needQty = Number(p.qty);
          const have = Number(count[Number(p.price)] || 0);
          if (have !== needQty) {
            ok = false;
            break;
          }
        }
        if (ok && selected.length === Number(o.unique_count)) {
          return o;
        }
      }
    }

    // 2) SAME PRICE RULES
    for (const o of config.offers) {
      if (o.price !== null && o.price !== undefined) {
        const need = Number(o.unique_count);
        const have = Number(count[Number(o.price)] || 0);
        if (have === need) {
          return o;
        }
      }
    }

    return null;
  }

  /* ================= COMBO SELECT ================= */
  function handleComboSelect(candy, meta = {}) {
    if (meta.unselect) {
      setComboBuffer(prev => prev.filter(c => c.id !== candy.id));
      return;
    }

    if (comboBuffer.some(c => c.id === candy.id)) return;

    const maxUnique =
      config.offers.length > 0
        ? Math.max(...config.offers.map(o => Number(o.unique_count)))
        : 0;

    if (comboBuffer.length >= maxUnique) return;

    const next = [...comboBuffer, candy];
    setComboBuffer(next);

    const offer = findMatchingOffer(next);
    if (!offer) return;

    if (next.length === Number(offer.unique_count)) {
      setCart(prev => [
        ...prev,
        {
          type: "COMBO",
          source: tab === "BIG_COMBO" ? "BIG_COMBO" : "AUTO_COMBO",
          offer_id: offer.id,
          price: Number(offer.offer_price),
          items: next.map(c => ({
            candy_id: c.id,
            name: c.name,
            qty: 1
          }))
        }
      ]);

      setComboBuffer([]);
    }
  }

  /* ================= RENDER ================= */
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
      <div>
        <Tabs active={tab} onChange={setTab} />

        {tab === "SINGLE" && (
          <SingleGrid candies={candies} onSelect={handleSingleSelect} />
        )}

        {tab === "COMBO" && (
          <ComboGrid
            offers={config.offers}
            candies={candies}
            selectedIds={comboBuffer.map(c => c.id)}
            onSelect={handleComboSelect}
          />
        )}

        {tab === "BIG_COMBO" && (
          <BigComboGrid
            candies={candies}
            selectedIds={comboBuffer.map(c => c.id)}
            onSelect={handleComboSelect}
          />
        )}
      </div>

      <Cart
        cart={cart}
        setCart={setCart}
        stallId={stallId}
        onSaleComplete={() => {
          reloadCandies();
          setCart([]);
          setComboBuffer([]);
        }}
      />
    </div>
  );
}
