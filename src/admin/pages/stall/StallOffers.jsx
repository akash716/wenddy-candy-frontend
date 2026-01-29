import { useEffect, useState } from "react";
import api from "../../../api"; // adjust path if needed

export default function StallOffers({ stallId }) {
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!stallId) return;

    // 1️⃣ Load all offers
    api
      .get("/admin/offers")
      .then(res => {
        setOffers(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("OFFERS LOAD ERROR:", err);
        alert("Failed to load offers");
      });

    // 2️⃣ Load already assigned offers for this stall
    api
      .get(`/admin/stall-offers/${stallId}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        // data = [{ offer_id: 1 }, ...]
        setSelected(data.map(o => o.offer_id));
      })
      .catch(err => {
        console.error("STALL OFFERS LOAD ERROR:", err);
        alert("Failed to load stall offers");
      });
  }, [stallId]);

  /* ---------------- TOGGLE ---------------- */
  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
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
        offerIds: selected
      });

      alert("Offers assigned to stall");
    } catch (err) {
      console.error("STALL OFFERS SAVE ERROR:", err);
      alert("Failed to save stall offers");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div>
      <h3>Assign Offers</h3>

      {offers.length === 0 && <p>No offers created yet</p>}

      {offers.map(o => (
        <label key={o.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selected.includes(o.id)}
            onChange={() => toggle(o.id)}
          />
          {" "}
          {o.title}
        </label>
      ))}

      <br />
      <button onClick={save}>Save</button>
    </div>
  );
}
