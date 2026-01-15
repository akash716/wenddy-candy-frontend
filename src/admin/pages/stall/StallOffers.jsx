import { useEffect, useState } from "react";
import api from "../../../api";

export default function StallOffers({ stallId }) {
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!stallId) return;

    const loadData = async () => {
      try {
        // 1️⃣ Load all offers
        const offersRes = await api.get("/admin/offers");
        setOffers(offersRes.data || []);

        // 2️⃣ Load assigned offers for this stall
        const assignedRes = await api.get(`/admin/stall-offers/${stallId}`);
        setSelected((assignedRes.data || []).map(o => o.offer_id));
      } catch (err) {
        console.error("LOAD OFFERS ERROR:", err);
        alert("Failed to load offers");
      }
    };

    loadData();
  }, [stallId]);

  /* ---------------- TOGGLE ---------------- */
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ---------------- SAVE ---------------- */
  const save = async () => {
    if (!stallId) {
      alert("Stall ID missing");
      return;
    }

    try {
      await api.post(`/admin/stall-offers/${stallId}`, {
        offerIds: selected,
      });

      alert("Offers assigned to stall");
    } catch (err) {
      console.error("SAVE OFFERS ERROR:", err);
      alert("Failed to save offers");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h3>Assign Offers</h3>

      {offers.length === 0 && <p>No offers created yet</p>}

      {offers.map((o) => (
        <label key={o.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selected.includes(o.id)}
            onChange={() => toggle(o.id)}
          />
          {o.title}
        </label>
      ))}

      <br />
      <button onClick={save}>Save</button>
    </div>
  );
}
