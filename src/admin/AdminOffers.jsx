import React, { useState } from "react";
import OfferForm from "./OfferForm";
import OfferTable from "./OfferTable";

import {
  getOffers,
  saveOffer,
  updateOffer,
  deleteOffer
} from "./offerService";

const PRODUCTS = [
  { id: "MC1", name: "Creamy", price: 65 },
  { id: "MC2", name: "Crunchy", price: 65 },
  { id: "MC3", name: "Zesty", price: 65 },
  { id: "DC1", name: "65% Dark", price: 65 },
  { id: "DC2", name: "Zest Orange", price: 65 },
  { id: "DC3", name: "72% Dark", price: 80 },
  { id: "DC4", name: "Dark Almond", price: 80 },
  { id: "DC5", name: "85% Dark", price: 80 }
];

export default function AdminOffers() {
  const [offers, setOffers] = useState(getOffers());
  const [editing, setEditing] = useState(null);

  const save = (offer) => {
    if (offer.id) {
      updateOffer(offer);
    } else {
      saveOffer(offer);
    }
    setOffers([...getOffers()]);
    setEditing(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Offers</h2>

      <OfferForm
        products={PRODUCTS}
        onSave={save}
        editing={editing}
      />

      <OfferTable
        offers={offers}
        onEdit={setEditing}
        onDelete={(id) => {
          deleteOffer(id);
          setOffers([...getOffers()]);
        }}
      />
    </div>
  );
}
