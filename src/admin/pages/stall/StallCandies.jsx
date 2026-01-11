import React, { useEffect, useState } from "react";

export default function StallCandies({ stallId }) {
  const [candies, setCandies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/stalls/${stallId}/candies`)
      .then(res => res.json())
      .then(data => {
        setCandies(data.allCandies);
        setSelected(data.assignedCandyIds);
        setLoading(false);
      });
  }, [stallId]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const save = async () => {
    await fetch(`http://localhost:5000/api/admin/stalls/${stallId}/candies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candyIds: selected })
    });

    alert("Candies assigned successfully");
  };

  if (loading) return <p>Loading candies...</p>;

  return (
    <div>
      <h3>Assign Candies</h3>

      {candies.map(c => (
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
