import React, { useEffect, useState } from "react";
import api from "../../../api"; // ✅ axios instance (Render backend)
import OverallReport from "./OverallReport";
import Bills from "./Bills";

export default function Reports() {
  /* ================= TAB ================= */
  const [activeTab, setActiveTab] = useState("STALL");

  /* ================= FILTERS ================= */
  const [stalls, setStalls] = useState([]);
  const [stallId, setStallId] = useState("");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");

  /* ================= REPORT DATA ================= */
  const [summary, setSummary] = useState(null);
  const [candies, setCandies] = useState([]);
  const [combos, setCombos] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD STALLS ================= */
  useEffect(() => {
    api
      .get("/admin/stalls")
      .then((res) => setStalls(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("STALL LOAD ERROR:", err);
        setStalls([]);
      });
  }, []);

  /* ================= LOAD STALL REPORT ================= */
  const loadReport = async () => {
    if (!stallId) {
      alert("Please select a stall");
      return;
    }

    setLoading(true);
    setSummary(null);
    setCandies([]);
    setCombos([]);
    setInventory([]);

    try {
      /* ---------- SUMMARY ---------- */
      const summaryRes = await api.get(
        "/admin/reports/stall/summary",
        {
          params: {
            stall_id: stallId,
            start_date: startDate,
            end_date: endDate
          }
        }
      );
      setSummary(summaryRes.data || null);

      /* ---------- CANDIES ---------- */
      const candyRes = await api.get(
        "/admin/reports/stall/candies",
        {
          params: {
            stall_id: stallId,
            start_date: startDate,
            end_date: endDate
          }
        }
      );
      setCandies(Array.isArray(candyRes.data) ? candyRes.data : []);

      /* ---------- COMBOS ---------- */
      const comboRes = await api.get(
        "/admin/reports/stall/combos",
        {
          params: {
            stall_id: stallId,
            start_date: startDate,
            end_date: endDate
          }
        }
      );
      setCombos(Array.isArray(comboRes.data) ? comboRes.data : []);

      /* ---------- INVENTORY ---------- */
      const inventoryRes = await api.get(
        "/admin/reports/stall/inventory",
        {
          params: { stall_id: stallId }
        }
      );
      setInventory(Array.isArray(inventoryRes.data) ? inventoryRes.data : []);

    } catch (err) {
      console.error("REPORT ERROR:", err);
      alert(
        err.response?.data?.error ||
        err.message ||
        "Failed to load report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>📊 Reports</h2>

      {/* ================= TABS ================= */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("STALL")}
          style={{ fontWeight: activeTab === "STALL" ? "bold" : "normal" }}
        >
          🏪 Stall Reports
        </button>

        <button
          onClick={() => setActiveTab("OVERALL")}
          style={{ fontWeight: activeTab === "OVERALL" ? "bold" : "normal" }}
        >
          🏢 Overall Reports
        </button>

        <button
          onClick={() => setActiveTab("BILLS")}
          style={{ fontWeight: activeTab === "BILLS" ? "bold" : "normal" }}
        >
          🧾 Bills
        </button>
      </div>

      {/* ================= STALL REPORT ================= */}
      {activeTab === "STALL" && (
        <>
          {/* FILTERS */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <select value={stallId} onChange={(e) => setStallId(e.target.value)}>
              <option value="">Select Stall</option>
              {stalls.map((stall) => (
                <option key={stall.id} value={stall.id}>
                  {stall.name}
                </option>
              ))}
            </select>

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

            <button onClick={loadReport}>Load Report</button>
          </div>

          {loading && <p>Loading report...</p>}

          {/* SUMMARY */}
          {summary && (
            <div style={{ maxWidth: 400, marginBottom: 32 }}>
              <h3>📌 Stall Summary</h3>
              <table border="1" cellPadding="8" width="100%">
                <tbody>
                  <tr>
                    <td>Total Bills</td>
                    <td>{summary.total_bills || 0}</td>
                  </tr>
                  <tr>
                    <td>Total Revenue</td>
                    <td>₹{Number(summary.total_revenue || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Average Bill</td>
                    <td>₹{Number(summary.avg_bill || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* CANDIES */}
          {candies.length > 0 && (
            <>
              <h3>🍫 Candy Sales</h3>
              <table border="1" cellPadding="8" width="400">
                <thead>
                  <tr>
                    <th>Candy</th>
                    <th>Qty Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {candies.map((c, i) => (
                    <tr key={i}>
                      <td>{c.name}</td>
                      <td>{c.qty_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* COMBOS */}
          {combos.length > 0 && (
            <>
              <h3>🎁 Combo Sales</h3>
              <table border="1" cellPadding="8" width="400">
                <thead>
                  <tr>
                    <th>Combo</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {combos.map((c, i) => (
                    <tr key={i}>
                      <td>{c.title}</td>
                      <td>{c.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* INVENTORY */}
          {inventory.length > 0 && (
            <>
              <h3>📦 Inventory Snapshot</h3>
              <table border="1" cellPadding="8" width="400">
                <thead>
                  <tr>
                    <th>Candy</th>
                    <th>Stock Left</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((i, idx) => (
                    <tr key={idx}>
                      <td>{i.name}</td>
                      <td>{i.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      {/* ================= OVERALL REPORT ================= */}
      {activeTab === "OVERALL" && (
        <OverallReport startDate={startDate} endDate={endDate} />
      )}

      {/* ================= BILLS ================= */}
      {activeTab === "BILLS" && <Bills />}
    </div>
  );
}
