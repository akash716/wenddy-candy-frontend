import React, { useState } from "react";
import { useParams } from "react-router-dom";

import useSalesmanConfig from "./hooks/useSalesmanConfig";
import Tabs from "./components/Tabs";
import SingleGrid from "./components/SingleGrid";
import ComboGrid from "./components/ComboGrid";
import Cart from "./components/Cart";
import ComboModal from "./components/ComboModal";

export default function SalesmanApp() {
  const { stallId } = useParams();

  const {
    config,
    candies,
    reloadCandies,
    loading
  } = useSalesmanConfig(stallId);

  const [tab, setTab] = useState("SINGLE");
  const [cart, setCart] = useState([]);
  const [activeOffer, setActiveOffer] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (!config) return <p>Error loading config</p>;

  return (
    <div className="pos-layout">
      <Tabs active={tab} onChange={setTab} />

      {/* ---------- SINGLE SALE ---------- */}
      {tab === "SINGLE" && (
        <SingleGrid
          candies={candies}
          onAdd={(item) => {
            if (item.stock <= 0) {
              alert("Out of stock");
              return;
            }
            // keep your existing behavior
            setCart([...cart, item]);
          }}
        />
      )}

      {/* ---------- COMBO SALE ---------- */}
      {tab === "COMBO" && (
        <ComboGrid
          offers={config.offers}
          onSelect={(offer) => setActiveOffer(offer)}
        />
      )}

      {/* ---------- CART ---------- */}
      <Cart
        cart={cart}
        setCart={setCart}   // ✅ THIS FIXES THE CRASH
        stallId={stallId}
        onSaleComplete={() => {
          reloadCandies();
        }}
      />

      {/* ---------- COMBO MODAL ---------- */}
      {activeOffer && (
        <ComboModal
          offer={activeOffer}
          candies={activeOffer.allowed_candies}
          onClose={() => setActiveOffer(null)}
          onAdd={(combo) => {
            setCart([...cart, combo]);
            setActiveOffer(null);
          }}
        />
      )}
    </div>
  );
}
