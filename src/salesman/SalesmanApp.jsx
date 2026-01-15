import React, { useState } from "react";
import { useParams } from "react-router-dom";

import useSalesmanConfig from "./hooks/useSalesmanConfig";
import Tabs from "./components/Tabs";
import SingleGrid from "./components/SingleGrid";
import ComboGrid from "./components/ComboGrid";
import Cart from "./components/Cart";

export default function SalesmanApp() {
  const { stallId } = useParams();
  const { config, candies, reloadCandies, loading } =
    useSalesmanConfig(stallId);

  const [tab, setTab] = useState("SINGLE");

  // ✅ cart is ARRAY (simple & safe)
  const [cart, setCart] = useState([]);

  // 🔥 selection per offer (offerId → candies[])
  const [selectedMap, setSelectedMap] = useState({});

  if (loading) return <p>Loading...</p>;
  if (!config) return <p>Error loading config</p>;

  /* ===============================
     SINGLE ADD
     - NO BLOCKING
     - backend decides offer
  =============================== */
  function handleSingleAdd(item) {
    if (item.stock <= 0) {
      alert("Out of stock");
      return;
    }

    setCart(prev => [
      ...prev,
      {
        type: "ITEM",
        items: [
          {
            candy_id: item.id,
            name: item.name,              // ✅ FIX
            price: Number(item.price),
            qty: 1
          }
        ]
      }
    ]);
  }

  /* ===============================
     COMBO SELECT
     - per offer selection
     - NO BLOCKING
  =============================== */
  function handleComboSelect(candy, offer) {
    const offerId = offer.id;
    const selected = selectedMap[offerId] || [];

    // unique candy only
    if (selected.some(c => c.id === candy.id)) return;

    const next = [...selected, candy];

    // update temp selection
    setSelectedMap(prev => ({
      ...prev,
      [offerId]: next
    }));

    // 🔥 combo completed
    if (next.length === offer.unique_count) {
      setCart(prev => [
        ...prev,
        {
          type: "COMBO",
          offer_id: offer.id,
          price: Number(offer.offer_price),
          items: next.map(c => ({
            candy_id: c.id,
            name: c.name,                // ✅ FIX
            qty: 1
          }))
        }
      ]);

      // reset only this offer selection
      setSelectedMap(prev => ({
        ...prev,
        [offerId]: []
      }));
    }
  }

  /* ===============================
     RENDER
  =============================== */
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: 16
      }}
    >
      <div>
        <Tabs active={tab} onChange={setTab} />

        {/* SINGLE TAB */}
        {tab === "SINGLE" && (
          <SingleGrid
            candies={candies}
            onAdd={handleSingleAdd}
          />
        )}

        {/* COMBO TAB */}
        {tab === "COMBO" && (
          <ComboGrid
            offers={config.offers || []}
            selectedIds={Object.values(selectedMap)
              .flat()
              .map(c => c.id)}
            onSelect={handleComboSelect}
          />
        )}
      </div>

      {/* CART */}
      <Cart
        cart={cart}
        setCart={setCart}
        stallId={stallId}
        onSaleComplete={() => {
          reloadCandies();
          setCart([]);
          setSelectedMap({});
        }}
      />
    </div>
  );
}
