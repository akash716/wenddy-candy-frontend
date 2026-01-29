import React, { useEffect, useState } from "react";
import OverallReport from "./OverallReport";
import Bills from "./Bills";
import api from "../../../api"; // adjust path if needed

export default function Reports() {
  /* ================= TAB ================= */
  const [activeTab, setActiveTab] = useState("STALL");

  /* ================= FILTERS ================= */
  const [stalls, setStalls] = useState([]);
  const [stallId, setStallId] = useState("");
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");

  /* ================= DATA ================= */
  const [summary, setSummary] = useState(null);
  const [candies, setCandies] = useState([]);
  const [combos, setCombos] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD STALLS ================= */
  useEffect(() => {
    api
      .get("/admin/stalls")
      .then(res => setStalls(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("STALL LOAD ERROR:", err);
        alert("Failed to load stalls");
      });
  }, []);

  /* ================= LOAD REPORT ================= */
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
      const s = await api.get(
        `/admin/reports/stall/summary?stall_id=${stallId}&start_date=${startDate}&end_date=${endDate}`
      );

      const c = await api.get(
        `/admin/reports/stall/candies?stall_id=${stallId}&start_date=${startDate}&end_date=${endDate}`
      );

      const cb = await api.get(
        `/admin/reports/stall/combos?stall_id=${stallId}&start_date=${startDate}&end_date=${endDate}`
      );

      const i = await api.get(
        `/admin/reports/stall/inventory?stall_id=${stallId}`
      );

      setSummary(s.data || null);
      setCandies(Array.isArray(c.data) ? c.data : []);
      setCombos(Array.isArray(cb.data) ? cb.data : []);
      setInventory(Array.isArray(i.data) ? i.data : []);
    } catch (err) {
      console.error("STALL REPORT ERROR:", err);
      alert("Failed to load stall report");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <h2 style={{ marginBottom: 16 }}>📊 Reports</h2>

      {/* ===== TABS ===== */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {["STALL", "OVERALL", "BILLS"].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: activeTab === t ? "#000" : "#fff",
              color: activeTab === t ? "#fff" : "#000",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {t === "STALL" && "🏪 Stall Reports"}
            {t === "OVERALL" && "🏢 Overall Reports"}
            {t === "BILLS" && "🧾 Bills"}
          </button>
        ))}
      </div>

      {/* ================= STALL REPORT ================= */}
      {activeTab === "STALL" && (
        <>
          {/* FILTER CARD */}
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: 16,
              borderRadius: 12,
              border: "1px solid #ddd",
              marginBottom: 24
            }}
          >
            <select value={stallId} onChange={e => setStallId(e.target.value)}>
              <option value="">Select Stall</option>
              {stalls.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />

            <button
              onClick={loadReport}
              style={{
                padding: "8px 14px",
                background: "#000",
                color: "#fff",
                borderRadius: 8,
                border: "none"
              }}
            >
              Load Report
            </button>
          </div>

          {loading && <p>Loading report…</p>}

          {/* SUMMARY CARDS */}
          {summary && (
            <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
              {[
                ["Total Bills", summary.total_bills],
                ["Total Revenue", `₹${summary.total_revenue}`],
                ["Avg Bill", `₹${summary.avg_bill}`]
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #ddd"
                  }}
                >
                  <div style={{ color: "#666", fontSize: 14 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
                </div>
              ))}
            </div>
          )}

          {/* TABLE SECTIONS */}
          {[
            ["🍫 Candy Sales", candies, ["Candy", "Qty Sold"], c => [c.name, c.qty_sold]],
            ["🎁 Combo Sales", combos, ["Combo", "Sold"], c => [c.title, c.sold]],
            ["📦 Inventory Snapshot", inventory, ["Candy", "Stock"], i => [i.name, i.stock]]
          ].map(
            ([title, rows, headers, mapFn]) =>
              rows.length > 0 && (
                <div
                  key={title}
                  style={{
                    marginBottom: 28,
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #ddd"
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{title}</h3>
                  <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f5f5f5" }}>
                      <tr>
                        {headers.map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => {
                        const cols = mapFn(r);
                        return (
                          <tr key={idx}>
                            {cols.map((v, i) => (
                              <td key={i}>{v}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
          )}
        </>
      )}

      {activeTab === "OVERALL" && (
        <OverallReport startDate={startDate} endDate={endDate} />
      )}

      {activeTab === "BILLS" && <Bills />}
    </div>
  );
}
