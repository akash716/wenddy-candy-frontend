import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Stalls() {
  const [stalls, setStalls] = useState([]);
  const [form, setForm] = useState({
    name: "",
    company: "",
    location: "",
  });

  const navigate = useNavigate();

  /* ---------------- LOAD STALLS ---------------- */

  const loadStalls = async () => {
    try {
      const res = await api.get("/admin/stalls");
      setStalls(res.data || []);
    } catch (err) {
      console.error("LOAD STALLS ERROR:", err);
      alert("Failed to load stalls");
    }
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

    try {
      await api.post("/admin/stalls", form);
      setForm({ name: "", company: "", location: "" });
      loadStalls();
    } catch (err) {
      console.error("CREATE STALL ERROR:", err);
      alert("Failed to create stall");
    }
  };

  /* ---------------- ACTIVATE / DEACTIVATE ---------------- */

  const toggleStatus = async (stall) => {
    try {
      await api.put(`/admin/stalls/${stall.id}`, {
        is_active: stall.is_active ? 0 : 1,
      });
      loadStalls();
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      alert("Failed to update status");
    }
  };

  /* ---------------- REMOVE (ARCHIVE) STALL ---------------- */

  const removeStall = async (stall) => {
    const ok = window.confirm(
      `Remove "${stall.name}" from UI?\n\nSales & history will be preserved.`
    );
    if (!ok) return;

    try {
      await api.put(`/admin/stalls/${stall.id}/archive`);
      loadStalls();
    } catch (err) {
      console.error("ARCHIVE ERROR:", err);
      alert("Failed to remove stall");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <h2>Stalls</h2>

      {/* CREATE STALL */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 6,
          marginBottom: 24,
          maxWidth: 600,
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

      {/* STALL TABLE */}
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
                      border: "none",
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
