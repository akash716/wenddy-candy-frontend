import React from "react";
import { NavLink } from "react-router-dom";

const menu = [
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/stalls", label: "Stalls" },
  { path: "/admin/candies", label: "Candies" },
  { path: "/admin/events", label: "Events" },
  { path: "/admin/assign-events", label: "Assign Events" },
  { path: "/admin/event-candies", label: "Event Candies" },
  { path: "/admin/offers", label: "Offers / Combos" },
  { path: "/admin/inventory", label: "Inventory" },
  { path: "/admin/reports", label: "Reports" }
];

export default function Sidebar() {
  return (
    <div
      style={{
        width: 220,
        background: "#111",
        color: "#fff",
        padding: 16
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Wenddy Admin</h2>

      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: 6,
            color: isActive ? "#000" : "#fff",
            background: isActive ? "#fff" : "transparent",
            textDecoration: "none",
            borderRadius: 4
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
