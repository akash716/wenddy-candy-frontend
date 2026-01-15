import React, { useState } from "react";
import { useParams } from "react-router-dom";
import StallCandies from "./stall/StallCandies";
import StallInventory from "./stall/StallInventory";
// import StallOffers from "./stall/StallOffers";

export default function StallManager() {
  const { stallId } = useParams();
  const [tab, setTab] = useState("CANDIES");

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Stall #{stallId}</h2>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("CANDIES")}>Candies</button>
        <button onClick={() => setTab("INVENTORY")}>Inventory</button>
        {/* <button onClick={() => setTab("OFFERS")}>Offers</button> */}
      </div>

      {tab === "CANDIES" && <StallCandies stallId={stallId} />}
      {tab === "INVENTORY" && <StallInventory stallId={stallId} />}
      {/* {tab === "OFFERS" && <StallOffers stallId={stallId} />} */}
    </div>
  );
}
