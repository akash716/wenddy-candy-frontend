import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminApp from "./admin/AdminApp";
import Salesman from "./salesman/Salesman";

export default function App() {
  return (
    <>
      {/* Main Navigation */}
      <nav style={{ marginBottom: 20 }}>
        <Link to="/admin">Admin</Link> |{" "}
        <Link to="/salesman">Salesman</Link>
      </nav>

      <Routes>
        {/* Admin main entry */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Salesman POS */}
        <Route path="/salesman" element={<Salesman />} />
      </Routes>
    </>
  );
}
