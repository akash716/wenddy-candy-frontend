import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function StallCandies({ stallId }) {
  const [candies, setCandies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CANDIES ================= */
  useEffect(() => {
    if (!stallId) return;

    const loadCandies = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/stalls/${stallId}/candies`);
        setCandies(res.data.allCandies || []);
        setSelected(res.data.assignedCandyIds || []);
      } catch (err) {
        console.error("LOAD CANDIES ERROR:", err);
        alert("Failed to load candies");
      } finally {
        setLoading(false);
      }
    };

    loadCandies();
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
        candyIds: selected,
      });

      alert("Candies assigned successfully");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save candies");
    }
  };

  if (loading) return <p>Loading candies...</p>;

  return (
    <div>
      <h3>Assign Candies</h3>

      {candies.map((c) => (
        <div key={c.id}>
          <label>
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggle(c.id)}
            />
            {c.name} (₹{c.price})
          </label>
        </div>
      ))}

      <br />
      <button onClick={save}>Save</button>
    </div>
  );
}
