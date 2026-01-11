import { useEffect, useState } from "react";
import api from "../../../api"; // ✅ axios instance (Render backend)

export default function StallOffers({ stallId }) {
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    if (!stallId) return;

    // 1️⃣ Load all offers
    api
      .get("/admin/offers")
      .then((res) => {
        setOffers(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("LOAD OFFERS ERROR:", err);
        setOffers([]);
      });

    // 2️⃣ Load already assigned offers for this stall
    api
      .get(`/admin/stall-offers/${stallId}`)
      .then((res) => {
        // expected: [{ offer_id: 1 }, ...]
        const data = Array.isArray(res.data) ? res.data : [];
        setSelected(data.map((o) => o.offer_id));
      })
      .catch((err) => {
        console.error("LOAD STALL OFFERS ERROR:", err);
        setSelected([]);
      });

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
        offerIds: selected
      });

      alert("Offers assigned to stall successfully");
    } catch (err) {
      console.error("SAVE STALL OFFERS ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to assign offers"
      );
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
