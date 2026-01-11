import React, { useState } from "react";
import api from "../../../api"; // ✅ axios instance (Render backend)

export default function Bills() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");

  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BILLS ================= */
  const loadBills = async () => {
    setLoading(true);
    setSelectedBill(null);
    setBillItems([]);

    try {
      const res = await api.get("/admin/reports/bills", {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });

      setBills(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("BILLS LOAD ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to load bills"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD BILL DETAILS ================= */
  const openBill = async (bill) => {
    setSelectedBill(bill);
    setBillItems([]);

    try {
      const res = await api.get(
        `/admin/reports/bills/${bill.id}`
      );

      setBillItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("BILL DETAIL ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to load bill details"
      );
    }
  };

  return (
    <div>
      <h3>🧾 Bills</h3>

      {/* ================= FILTER ================= */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={loadBills}>Load Bills</button>
      </div>

      {loading && <p>Loading bills...</p>}

      {/* ================= BILLS LIST ================= */}
      {!loading && bills.length > 0 && (
        <table border="1" cellPadding="8" width="600">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Stall</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr
                key={b.id}
                style={{ cursor: "pointer" }}
                onClick={() => openBill(b)}
              >
                <td>{b.id}</td>
                <td>{b.stall}</td>
                <td>₹{Number(b.total).toFixed(2)}</td>
                <td>{b.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= BILL DETAILS ================= */}
      {selectedBill && billItems.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h4>📄 Bill #{selectedBill.id} Details</h4>

          <table border="1" cellPadding="8" width="600">
            <thead>
              <tr>
                <th>Type</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.type}</td>
                  <td>
                    {it.type === "COMBO"
                      ? it.combo_title
                      : it.candy_name}
                  </td>
                  <td>{it.qty || 1}</td>
                  <td>₹{Number(it.display_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && bills.length === 0 && (
        <p>No bills found for selected period.</p>
      )}
    </div>
  );
}
