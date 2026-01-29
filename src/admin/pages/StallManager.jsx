import { useParams } from "react-router-dom";
import { useState } from "react";
import StallInventory from "./stall/StallInventory";
import StallCandies from "./stall/StallCandies";
// import StallOffers from "./stall/StallOffers";

export default function StallManager() {
  const { stallId } = useParams();
  const [tab, setTab] = useState("CANDIES");

  if (!stallId) {
    return <p style={{ padding: 20 }}>Invalid stall</p>;
  }

  const tabStyle = (active) => ({
    padding: "10px 18px",
    borderRadius: 10,
    border: "1px solid var(--border-color)",
    background: active
      ? "var(--btn-primary)"
      : "var(--card-bg)",
    color: active ? "#fff" : "var(--text-primary)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease"
  });

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>
        Manage Stall #{stallId}
      </h2>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginBottom: 24
        }}
      >
        <button
          onClick={() => setTab("CANDIES")}
          style={tabStyle(tab === "CANDIES")}
        >
          Candies
        </button>

        <button
          onClick={() => setTab("INVENTORY")}
          style={tabStyle(tab === "INVENTORY")}
        >
          Inventory
        </button>

        {/*
        <button
          onClick={() => setTab("OFFERS")}
          style={tabStyle(tab === "OFFERS")}
        >
          Offers
        </button>
        */}
      </div>

      {tab === "CANDIES" && <StallCandies stallId={stallId} />}
      {tab === "INVENTORY" && <StallInventory stallId={stallId} />}
      {/* {tab === "OFFERS" && <StallOffers stallId={stallId} />} */}
    </div>
  );
}
