import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

import Dashboard from "./pages/Dashboard";
import Stalls from "./pages/Stalls";
import Candies from "./pages/Candies";
import Events from "./pages/Events";
// import EventAssignment from "./pages/EventAssignment";
// import EventCandies from "./pages/EventCandies";
import Offers from "./pages/Offers";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports/Reports";
import StallManager from "./pages/StallManager";


export default function AdminApp() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <div style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stalls" element={<Stalls />} />
            <Route path="/candies" element={<Candies />} />
            <Route path="/events" element={<Events />} />
            {/* <Route path="/assign-events" element={<EventAssignment />} />
            <Route path="/event-candies" element={<EventCandies />} /> */}
            <Route path="/offers" element={<Offers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/stalls/:stallId" element={<StallManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
