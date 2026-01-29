import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // adjust path if needed

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
    try {
      const res = await api.get("/admin/stalls");
      setStalls(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("STALL LOAD ERROR:", err);
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
      console.error("STALL CREATE ERROR:", err);
      alert("Failed to create stall");
    }
  };

  /* ---------------- ACTIVATE / DEACTIVATE ---------------- */
  const toggleStatus = async (stall) => {
    try {
      await api.put(`/admin/stalls/${stall.id}`, {
        is_active: stall.is_active ? 0 : 1
      });
      loadStalls();
    } catch (err) {
      console.error("STALL STATUS ERROR:", err);
      alert("Failed to update stall status");
    }
  };

  /* ---------------- REMOVE STALL ---------------- */
  const removeStall = async (stall) => {
    const ok = window.confirm(
      `Remove "${stall.name}" from UI?\n\nSales & history will be preserved.`
    );
    if (!ok) return;

    try {
      await api.put(`/admin/stalls/${stall.id}/archive`);
      loadStalls();
    } catch (err) {
      console.error("STALL REMOVE ERROR:", err);
      alert("Failed to remove stall");
    }
  };

  /* ---------------- COPY DASHBOARD LINK ---------------- */
  const copyDashboardLink = async (stallId) => {
    try {
      const link = `${window.location.origin}/salesman/${stallId}`;
      await navigator.clipboard.writeText(link);
      alert("Dashboard link copied!");
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: 20 }}>
      <h2>Stalls</h2>

      {/* ---------- ADD STALL ---------- */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          maxWidth: 650
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
          <button className="btn-primary" onClick={createStall}>
            Add
          </button>
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
            <th width="420">Actions</th>
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

              {/* ---------- ACTIONS ---------- */}
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                  }}
                >
                  {/* ROW 1 */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-primary"
                      onClick={() => toggleStatus(stall)}
                    >
                      {stall.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      className="btn-primary"
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
                      <button className="btn-primary">
                        Dashboard
                      </button>
                    </a>
                  </div>

                  {/* ROW 2 */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        copyDashboardLink(stall.id)
                      }
                    >
                      Copy Link
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => removeStall(stall)}
                    >
                      Remove
                    </button>
                  </div>
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
