import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [candies, setCandies] = useState([]);

  const [comboSize, setComboSize] = useState(2);
  const [offerPrice, setOfferPrice] = useState("");
  const [priceOn, setPriceOn] = useState(""); // 🔥 candy price
  const [selectedCandies, setSelectedCandies] = useState([]);

  const [editing, setEditing] = useState(null);

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {
    const offersRes = await fetch(
      `${API_BASE}/api/admin/combo-offer-rules`
    );
    const offersData = await offersRes.json();

    const candiesRes = await fetch(
      `${API_BASE}/api/admin/candies`
    );
    const candiesData = await candiesRes.json();

    setOffers(offersData.rules || []);
    setCandies(candiesData || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const toggleCandy = (id) => {
    setSelectedCandies((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const resetForm = () => {
    setEditing(null);
    setComboSize(2);
    setOfferPrice("");
    setPriceOn("");
    setSelectedCandies([]);
  };

  /* ---------------- SAVE ---------------- */

  const saveOffer = async () => {
    if (
      !offerPrice ||
      !priceOn ||
      selectedCandies.length < comboSize
    ) {
      alert(`Fill all fields correctly`);
      return;
    }

    const payload = {
      unique_count: comboSize,
      offer_price: Number(offerPrice),
      price: Number(priceOn), // 🔥 IMPORTANT
      candy_ids: selectedCandies,
      valid_from: null,
      valid_to: null
    };

    if (editing) {
      await fetch(
        `${API_BASE}/api/admin/combo-offer-rules/${editing.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             offer_price: payload.offer_price,
            valid_from: null,
            valid_to: null,
            candy_ids: selectedCandies   // 🔥 REQUIRED
          })
        }
      );

    } else {
      await fetch(
        `${API_BASE}/api/admin/combo-offer-rules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
    }

    resetForm();
    loadData();
  };

  /* ---------------- TOGGLE ACTIVE ---------------- */

  const toggleStatus = async (offer) => {
    await fetch(
      `${API_BASE}/api/admin/combo-offer-rules/${offer.id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !offer.is_active })
      }
    );
    loadData();
  };

  /* ---------------- DELETE RULE ---------------- */

  const deleteRule = async (id) => {
    const ok = window.confirm("Delete this combo rule?");
    if (!ok) return;

    await fetch(
      `${API_BASE}/api/admin/combo-offer-rules/${id}`,
      { method: "DELETE" }
    );

    loadData();
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <h2>Combo Offer Rules</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24
        }}
      >
        {/* ================= LEFT ================= */}
        <div style={card}>
          <h3>{editing ? "Edit Combo Rule" : "Create Combo Rule"}</h3>

          <input
            style={input}
            type="number"
            min="1"
            value={comboSize}
            onChange={(e) => setComboSize(Number(e.target.value))}
            placeholder="Combo Size"
          />

          <input
            style={input}
            type="number"
            placeholder="Candy Price (e.g. 65)"
            value={priceOn}
            onChange={(e) => setPriceOn(e.target.value)}
          />

          <input
            style={input}
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
          />

          <h4>Select Allowed Candies</h4>

          <div style={candyGrid}>
            {candies.map((c) => {
              const selected = selectedCandies.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCandy(c.id)}
                  style={{
                    ...candyCard,
                    background: selected ? "#000" : "#fff",
                    color: selected ? "#fff" : "#000"
                  }}
                >
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: 12 }}>
                    ₹{c.price}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <button onClick={saveOffer}>
              {editing ? "Update Rule" : "Save Rule"}
            </button>

            {editing && (
              <button
                style={{ marginLeft: 10 }}
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div>
          <h3>Existing Combo Rules</h3>

          {offers.length === 0 && <p>No rules created yet</p>}

          {offers.map((o) => (
            <div key={o.id} style={offerCard}>
              <strong>
                Pick {o.unique_count} chocolates @ ₹{o.price}
              </strong>

              <div>Offer Price: ₹{o.offer_price}</div>

              <div style={{ fontSize: 13, marginTop: 6 }}>
                Candies: {o.candies?.map(c => c.name).join(", ")}
              </div>

              <div style={{ marginTop: 8 }}>
                Status:{" "}
                <b>{o.is_active ? "ACTIVE" : "INACTIVE"}</b>
              </div>

              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => {
                    setEditing(o);
                    setComboSize(o.unique_count);
                    setOfferPrice(o.offer_price);
                    setPriceOn(o.price);
                    setSelectedCandies(
                      o.candies.map((c) => c.id)
                    );
                  }}
                >
                  Edit
                </button>

                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => toggleStatus(o)}
                >
                  {o.is_active ? "Disable" : "Enable"}
                </button>

                <button
                  style={{ marginLeft: 8, color: "white", background: "red" }}
                  onClick={() => deleteRule(o.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: 16
};

const input = {
  width: "100%",
  padding: 8,
  marginBottom: 10
};

const candyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10
};

const candyCard = {
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: 10,
  cursor: "pointer",
  textAlign: "center"
};

const offerCard = {
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: 14,
  marginBottom: 12
};
