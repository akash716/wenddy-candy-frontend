import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminApp from "./admin/AdminApp";
import SalesmanApp from "./salesman/SalesmanApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
           {/* SALESMAN DASHBOARD */}
        <Route path="/salesman/:stallId" element={<SalesmanApp />} />

      </Routes>
    </BrowserRouter>
  );
}
