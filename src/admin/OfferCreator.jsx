import React, { useState } from "react";
import api from "../api";

export default function OfferCreator({ eventId }) {
  const [price, setPrice] = useState("");

  const createOffer = async () => {
    await api.post("/offers", {
      eventId,
      name: "Any 3 Chocolates",
      comboSize: 3,
      price,
    });
    alert("Offer created");
  };

  return (
    <div className="card">
      <h3>Create Combo Offer (Buy 3)</h3>
      <input
        placeholder="Combo Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={createOffer}>Create Offer</button>
    </div>
  );
}
