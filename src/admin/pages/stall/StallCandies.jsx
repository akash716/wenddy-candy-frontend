import React, { useEffect, useState } from "react";
import api from "../../../api"; // ✅ axios instance (Render backend)

export default function StallCandies({ stallId }) {
  const [candies, setCandies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD STALL CANDIES ================= */
  useEffect(() => {
    if (!stallId) return;

    setLoading(true);

    api
      .get(`/admin/stalls/${stallId}/candies`)
      .then((res) => {
        setCandies(res.data.allCandies || []);
        setSelected(res.data.assignedCandyIds || []);
      })
      .catch((err) => {
        console.error("STALL CANDIES LOAD ERROR:", err);
        setCandies([]);
        setSelected([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stallId]);

  /* ================= TOGGLE ================= */
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      await api.post(`/admin/stalls/${stallId}/candies`, {
        candyIds: selected
      });

      alert("Candies assigned successfully");
    } catch (err) {
      console.error("SAVE STALL CANDIES ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to assign candies"
      );
    }
  };

  if (loading) return <p>Loading candies...</p>;

  return (
    <div>
      <h3>Assign Candies</h3>

      {candies.length === 0 && <p>No candies available</p>}

      {candies.map((c) => (
        <div key={c.id}>
          <label>
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            {c.name} (₹{Number(c.price).toFixed(2)})
          </label>
        </div>
      ))}

      <br />
      <button onClick={save}>Save</button>
    </div>
  );
}
