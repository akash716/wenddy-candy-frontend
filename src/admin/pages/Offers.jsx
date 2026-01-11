import { useEffect, useState } from "react";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [candies, setCandies] = useState([]);

  const [title, setTitle] = useState("");
  const [comboSize, setComboSize] = useState(2);
  const [price, setPrice] = useState("");
  const [selectedCandies, setSelectedCandies] = useState([]);

  const [editing, setEditing] = useState(null);

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {
    const offersRes = await fetch("http://localhost:5000/api/admin/offers");
    const offersData = await offersRes.json();

    const candiesRes = await fetch("http://localhost:5000/api/admin/candies");
    const candiesData = await candiesRes.json();

    setOffers(offersData);
    setCandies(candiesData);
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
    setTitle("");
    setComboSize(2);
    setPrice("");
    setSelectedCandies([]);
  };

  /* ---------------- SAVE ---------------- */

  const saveOffer = async () => {
    if (!title || !price || selectedCandies.length < comboSize) {
      alert(`Select at least ${comboSize} candies`);
      return;
    }

    const payload = {
      title,
      combo_size: comboSize,
      price,
      candyIds: selectedCandies
    };

    if (editing) {
      await fetch(
        `http://localhost:5000/api/admin/offers/${editing.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    resetForm();
    loadData();
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <h2>Offers / Combos</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start"
        }}
      >
        {/* ================= LEFT: CREATE / EDIT ================= */}
        <div style={card}>
          <h3>{editing ? "Edit Combo Offer" : "Create Combo Offer"}</h3>

          <input
            style={input}
            placeholder="Offer Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div style={{ display: "flex", gap: 10 }}>
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
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

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
                  <div style={{ fontSize: 12 }}>₹{c.price}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <button onClick={saveOffer}>
              {editing ? "Update Offer" : "Save Offer"}
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

        {/* ================= RIGHT: EXISTING OFFERS ================= */}
        <div>
          <h3>Existing Offers</h3>

          {offers.length === 0 && <p>No offers created yet</p>}

          {offers.map((o) => (
            <div key={o.id} style={offerCard}>
              <strong>{o.title}</strong>
              <div>Pick {o.combo_size} chocolates</div>
              <div>Price: ₹{o.price}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Candies: {o.candies?.map((c) => c.name).join(", ")}
              </div>

              <button
                style={{ marginTop: 10 }}
                onClick={() => {
                  setEditing(o);
                  setTitle(o.title);
                  setComboSize(o.combo_size);
                  setPrice(o.price);
                  setSelectedCandies(o.candies.map((c) => c.id));
                }}
              >
                Edit
              </button>
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
