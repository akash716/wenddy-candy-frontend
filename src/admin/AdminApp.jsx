import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminOffers from "./AdminOffers";
import Inventory from "./Inventory";
import TodayReport from "./TodayReport";

export default function AdminApp() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <nav style={{ marginBottom: 20 }}>
        <Link to="offers">Offers</Link> |{" "}
        <Link to="inventory">Inventory</Link> |{" "}
        <Link to="reports/today">Today Report</Link>
      </nav>

      <Routes>
        <Route path="offers" element={<AdminOffers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports/today" element={<TodayReport />} />
      </Routes>
    </div>
  );
}
