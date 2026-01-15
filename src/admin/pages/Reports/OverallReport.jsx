import React, { useState } from "react";

export default function OverallReport({ startDate, endDate }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOverall = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:5000/api/admin/reports/overall/summary?start_date=${startDate}&end_date=${endDate}`
    );
    setRows(await res.json());
    setLoading(false);
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
                <td>₹{r.total_revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
