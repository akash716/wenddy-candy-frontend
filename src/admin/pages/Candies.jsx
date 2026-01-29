import { useEffect, useState } from "react";
import api from "../../api"; // adjust path if needed

// derive base url safely from axios instance
const BASE_URL = api.defaults.baseURL.replace("/api", "");

export default function Candies() {
  const [candies, setCandies] = useState([]);

  // create
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Milk");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // edit
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Milk");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);

  /* ---------- LOAD ---------- */
  const loadCandies = async () => {
    try {
      const res = await api.get("/admin/candies");
      setCandies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("CANDY LOAD ERROR:", err);
      alert("Failed to load candies");
    }
  };

  useEffect(() => {
    loadCandies();
  }, []);

  /* ---------- IMAGE UPLOAD ---------- */
  const uploadImage = async (id, file) => {
    const form = new FormData();
    form.append("image", file);

    await api.post(`/admin/candies/${id}/image`, form);
  };

  /* ---------- CREATE (FIXED) ---------- */
  const createCandy = async () => {
    // ✅ HARD FRONTEND VALIDATION
    if (!name || !price || !category) {
      alert("Name, category & price required");
      return;
    }

    try {
      const res = await api.post("/admin/candies", {
        name: name.trim(),
        category,
        price: Number(price)
      });

      const data = res.data;

      if (image) {
        await uploadImage(data.id, image);
      }

      // reset form
      setName("");
      setCategory("Milk");
      setPrice("");
      setImage(null);

      loadCandies();
    } catch (err) {
      console.error("CANDY CREATE ERROR:", err);
      alert("Failed to add candy");
    }
  };

  /* ---------- EDIT ---------- */
  const startEdit = (c) => {
    setEditId(c.id);
    setEditName(c.name);
    setEditCategory(c.category);
    setEditPrice(c.price);
    setEditImage(null);
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/admin/candies/${id}`, {
        name: editName,
        category: editCategory,
        price: Number(editPrice)
      });

      if (editImage) {
        await uploadImage(id, editImage);
      }

      setEditId(null);
      loadCandies();
    } catch (err) {
      console.error("CANDY UPDATE ERROR:", err);
      alert("Failed to update candy");
    }
  };

  return (
    <div style={styles.page}>
      <h2>🍫 Candy Master (Admin)</h2>

      {/* ===== CREATE CARD ===== */}
      <div style={styles.createCard}>
        <input
          placeholder="Candy name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Milk">Milk</option>
          <option value="Dark">Dark</option>
          <option value="Dragee">Dragee</option>
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />

        <button style={styles.primaryBtn} onClick={createCandy}>
          Add Candy
        </button>
      </div>

      {/* ===== GRID ===== */}
      <div style={styles.grid}>
        {candies.map(c => {
          const editing = editId === c.id;

          return (
            <div key={c.id} style={styles.card}>
              <div style={styles.imageWrap}>
                {c.image ? (
                  <img
                    src={`${BASE_URL}${c.image}`}
                    alt={c.name}
                    style={styles.image}
                  />
                ) : (
                  <span style={{ color: "#999", fontSize: 12 }}>
                    No Image
                  </span>
                )}
              </div>

              {editing ? (
                <>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />

                  <select value={editCategory} disabled>
                    <option>Milk</option>
                    <option>Dark</option>
                    <option>Dragee</option>
                  </select>

                  <input
                    type="number"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setEditImage(e.target.files[0])}
                  />

                  <button
                    style={styles.primaryBtn}
                    onClick={() => saveEdit(c.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <strong>{c.name}</strong>
                  <span style={styles.meta}>{c.category}</span>
                  <span style={styles.price}>₹{c.price}</span>

                  <button
                    style={styles.secondaryBtn}
                    onClick={() => startEdit(c)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: { padding: 20 },

  createCard: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    gap: 10,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 18
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 12,
    border: "1px solid #e5e5e5",
    display: "flex",
    flexDirection: "column",
    gap: 6
  },

  imageWrap: {
    height: 140,
    borderRadius: 10,
    background: "#f3f3f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 6
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  meta: {
    fontSize: 12,
    color: "#777"
  },

  price: {
    fontWeight: "bold"
  },

  primaryBtn: {
    marginTop: 6,
    padding: "8px 12px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },

  secondaryBtn: {
    marginTop: 6,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#000",
    color: "#fff",
    cursor: "pointer"
  }
};
