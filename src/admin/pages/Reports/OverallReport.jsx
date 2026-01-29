import React, { useState } from "react";
import api from "../../../api"; // adjust path if needed

export default function OverallReport({ startDate, endDate }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOverall = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/admin/reports/overall/summary?start_date=${startDate}&end_date=${endDate}`
      );

      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("OVERALL REPORT ERROR:", err);
      alert("Failed to load overall report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        padding: 20,
        borderRadius: 12,
        border: "1px solid #ddd"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16
        }}
      >
        <h3 style={{ margin: 0 }}>🏢 Overall Reports</h3>

        <button
          onClick={loadOverall}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: "#000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Load Report
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p style={{ color: "#666" }}>Loading overall report…</p>
      )}

      {/* TABLE */}
      {rows.length > 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            overflow: "hidden"
          }}
        >
          <table
            width="100%"
            cellPadding="10"
            style={{ borderCollapse: "collapse" }}
          >
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                <th align="left">Company</th>
                <th>Total Bills</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.company}>
                  <td>{r.company}</td>
                  <td align="center">{r.total_bills}</td>
                  <td align="center">
                    ₹{Number(r.total_revenue || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && rows.length === 0 && (
        <p style={{ color: "#999", marginTop: 12 }}>
          No data loaded yet.
        </p>
      )}
    </div>
  );
}
