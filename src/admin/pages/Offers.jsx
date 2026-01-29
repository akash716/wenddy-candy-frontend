import { useEffect, useState } from "react";
import api from "../../api"; // adjust path if needed

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [candies, setCandies] = useState([]);

  const [comboSize, setComboSize] = useState(3);
  const [offerPrice, setOfferPrice] = useState("");
  const [priceOn, setPriceOn] = useState("");
  const [comboType, setComboType] = useState("SAME");
  const [priceRows, setPriceRows] = useState([{ price: "", qty: "" }]);

  const [editingId, setEditingId] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    try {
      const offersRes = await api.get("/admin/combo-offer-rules");
      const candiesRes = await api.get("/admin/candies");

      setOffers(offersRes.data?.rules || []);
      setCandies(Array.isArray(candiesRes.data) ? candiesRes.data : []);
    } catch (err) {
      console.error("LOAD COMBO RULES ERROR:", err);
      alert("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- RESET ---------------- */
  const resetForm = () => {
    setComboSize(3);
    setOfferPrice("");
    setPriceOn("");
    setComboType("SAME");
    setPriceRows([{ price: "", qty: "" }]);
    setEditingId(null);
  };

  /* ---------------- DELETE ---------------- */
  const deleteOffer = async (id) => {
    const ok = window.confirm("Delete this combo rule?");
    if (!ok) return;

    try {
      await api.delete(`/admin/combo-offer-rules/${id}`);
      loadData();
    } catch (err) {
      console.error("DELETE RULE ERROR:", err);
      alert("Failed to delete");
    }
  };

  /* ---------------- EDIT ---------------- */
  const editOffer = (o) => {
    setEditingId(o.id);
    setComboSize(o.unique_count);
    setOfferPrice(o.offer_price);

    if (o.price !== null) {
      setComboType("SAME");
      setPriceOn(o.price);
      setPriceRows([{ price: "", qty: "" }]);
    } else {
      setComboType("MIXED");
      setPriceRows(
        o.price_pattern && o.price_pattern.length
          ? o.price_pattern.map(p => ({
              price: p.price,
              qty: p.qty
            }))
          : [{ price: "", qty: "" }]
      );
    }
  };

  /* ---------------- SAVE / UPDATE ---------------- */
  const saveOffer = async () => {
    if (!offerPrice) {
      alert("Offer price required");
      return;
    }

    if (!comboSize || Number(comboSize) <= 0) {
      alert("Combo size must be > 0");
      return;
    }

    let payload = {
      unique_count: Number(comboSize),
      offer_price: Number(offerPrice),
      price: null,
      price_pattern: null
    };

    if (comboType === "SAME") {
      if (!priceOn) {
        alert("Candy price required");
        return;
      }
      payload.price = Number(priceOn);
    } else {
      const cleaned = priceRows
        .map(r => ({
          price: r.price === "" ? "" : Number(r.price),
          qty: r.qty === "" ? "" : Number(r.qty)
        }))
        .filter(r => r.price !== "" && r.qty !== "");

      if (!cleaned.length) {
        alert("At least one price row required for mixed type");
        return;
      }

      const totalQty = cleaned.reduce((s, r) => s + Number(r.qty || 0), 0);
      if (totalQty !== Number(comboSize)) {
        alert("Total qty in price pattern must equal combo size");
        return;
      }

      payload.price_pattern = cleaned;
    }

    try {
      if (editingId) {
        await api.put(`/admin/combo-offer-rules/${editingId}`, payload);
      } else {
        await api.post("/admin/combo-offer-rules", payload);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("SAVE COMBO RULE ERROR:", err);
      alert("Failed to save rule");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      <h2>Combo Offer Rules</h2>

      <div style={styles.grid}>
        {/* LEFT */}
        <div style={styles.card}>
          <h3>{editingId ? "Edit Combo Rule" : "Create Combo Rule"}</h3>

          <div style={styles.radioRow}>
            <label>
              <input
                type="radio"
                checked={comboType === "SAME"}
                onChange={() => setComboType("SAME")}
              />{" "}
              Same Price
            </label>

            <label>
              <input
                type="radio"
                checked={comboType === "MIXED"}
                onChange={() => setComboType("MIXED")}
              />{" "}
              Mixed Price
            </label>
          </div>

          <input
            style={styles.input}
            type="number"
            value={comboSize}
            onChange={e => setComboSize(Number(e.target.value))}
            placeholder="Combo Size"
            min={1}
          />

          {comboType === "SAME" && (
            <input
              style={styles.input}
              type="number"
              placeholder="Candy Price"
              value={priceOn}
              onChange={e => setPriceOn(e.target.value)}
            />
          )}

          {comboType === "MIXED" &&
            priceRows.map((row, i) => (
              <div key={i} style={styles.patternRow}>
                <input
                  type="number"
                  placeholder="Price"
                  value={row.price}
                  onChange={e => {
                    const next = [...priceRows];
                    next[i].price = e.target.value;
                    setPriceRows(next);
                  }}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={row.qty}
                  onChange={e => {
                    const next = [...priceRows];
                    next[i].qty = e.target.value;
                    setPriceRows(next);
                  }}
                />
                <button
                  onClick={() => {
                    const next = priceRows.filter((_, idx) => idx !== i);
                    setPriceRows(next.length ? next : [{ price: "", qty: "" }]);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

          {comboType === "MIXED" && (
            <button
              onClick={() =>
                setPriceRows([...priceRows, { price: "", qty: "" }])
              }
              style={{ marginBottom: 10 }}
            >
              Add Row
            </button>
          )}

          <input
            style={styles.input}
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={e => setOfferPrice(e.target.value)}
          />

          <button style={styles.primaryBtn} onClick={saveOffer}>
            {editingId ? "Update Rule" : "Save Rule"}
          </button>

          {editingId && (
            <button style={styles.secondaryBtn} onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div>
          <h3>Existing Combo Rules</h3>

          {offers.map(o => (
            <div key={o.id} style={styles.offerCard}>
              <div>
                <strong>
                  Pick {o.unique_count} chocolates{" "}
                  {o.price ? `@ ₹${o.price}` : "(Mixed)"}
                </strong>
                <div>Offer ₹{o.offer_price}</div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => editOffer(o)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteOffer(o.id)}
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

const styles = {
  page: { padding: 20 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  card: { border: "1px solid #ddd", borderRadius: 8, padding: 16 },
  input: { width: "100%", padding: 10, marginBottom: 10 },
  radioRow: { display: "flex", gap: 20, marginBottom: 12 },
  patternRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: 10,
    alignItems: "center"
  },
  primaryBtn: { padding: 10, background: "#000", color: "#fff" },
  secondaryBtn: { marginTop: 8 },
  offerCard: {
    border: "1px solid #ddd",
    padding: 14,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between"
  },
  actions: { display: "flex", flexDirection: "column", gap: 6 },
  editBtn: { cursor: "pointer" },
  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    padding: 6
  }
};
