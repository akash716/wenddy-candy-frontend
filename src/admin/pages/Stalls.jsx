import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Stalls() {
  const [stalls, setStalls] = useState([]);
  const [form, setForm] = useState({
    name: "",
    company: "",
    location: ""
  });

  const navigate = useNavigate();

  /* ---------------- LOAD STALLS ---------------- */

  const loadStalls = async () => {
    const res = await fetch("http://localhost:5000/api/admin/stalls");
    const data = await res.json();
    setStalls(data);
  };

  useEffect(() => {
    loadStalls();
  }, []);

  /* ---------------- CREATE STALL ---------------- */

  const createStall = async () => {
    if (!form.name || !form.company) {
      alert("Stall name and company are required");
      return;
    }

    await fetch("http://localhost:5000/api/admin/stalls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", company: "", location: "" });
    loadStalls();
  };

  /* ---------------- ACTIVATE / DEACTIVATE ---------------- */

  const toggleStatus = async (stall) => {
    await fetch(`http://localhost:5000/api/admin/stalls/${stall.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_active: stall.is_active ? 0 : 1
      })
    });

    loadStalls();
  };

  /* ---------------- REMOVE (ARCHIVE) STALL ---------------- */

  const removeStall = async (stall) => {
    const ok = window.confirm(
      `Remove "${stall.name}" from UI?\n\nSales & history will be preserved.`
    );
    if (!ok) return;

    await fetch(
      `http://localhost:5000/api/admin/stalls/${stall.id}/archive`,
      { method: "PUT" }
    );

    loadStalls();
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <h2>Stalls</h2>

      {/* ---------- CREATE STALL FORM ---------- */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 6,
          marginBottom: 24,
          maxWidth: 600
        }}
      >
        <h3>Add New Stall</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Stall name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />
          <button onClick={createStall}>Add</button>
        </div>
      </div>

      {/* ---------- STALL TABLE ---------- */}
      <table
        width="100%"
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Location</th>
            <th>Status</th>
            <th width="320">Actions</th>
          </tr>
        </thead>

        <tbody>
          {stalls.map((stall) => (
            <tr key={stall.id}>
              <td>{stall.name}</td>
              <td>{stall.company}</td>
              <td>{stall.location}</td>

              <td>
                {stall.is_active ? (
                  <span style={{ color: "green" }}>Active</span>
                ) : (
                  <span style={{ color: "gray" }}>Inactive</span>
                )}
              </td>

              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleStatus(stall)}>
                    {stall.is_active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/stalls/${stall.id}`)
                    }
                  >
                    Manage
                  </button>

                  <a
                    href={`/salesman/${stall.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button>Dashboard</button>
                  </a>

                  <button
                    onClick={() => removeStall(stall)}
                    style={{
                      color: "white",
                      background: "red",
                      border: "none"
                    }}
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {stalls.length === 0 && (
            <tr>
              <td colSpan="5" align="center">
                No stalls found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
