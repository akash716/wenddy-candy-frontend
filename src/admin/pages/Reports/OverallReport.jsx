import React, { useState } from "react";
import api from "../../../api"; // ✅ axios instance (Render backend)

export default function OverallReport({ startDate, endDate }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOverall = async () => {
    setLoading(true);
    setRows([]);

    try {
      const res = await api.get(
        "/admin/reports/overall/summary",
        {
          params: {
            start_date: startDate,
            end_date: endDate
          }
        }
      );

      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("OVERALL REPORT ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to load overall report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>🏢 Overall Reports</h3>

      <button onClick={loadOverall}>Load Overall Report</button>

      {loading && <p>Loading...</p>}

      {rows.length > 0 && (
        <table border="1" cellPadding="8" width="500">
          <thead>
            <tr>
              <th>Company</th>
              <th>Total Bills</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.company}</td>
                <td>{r.total_bills}</td>
                <td>₹{Number(r.total_revenue).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && rows.length === 0 && (
        <p>No data found for selected period.</p>
      )}
    </div>
  );
}
