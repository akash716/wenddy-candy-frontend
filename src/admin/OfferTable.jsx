import React from "react";

export default function OfferTable({ offers, onEdit, onDelete }) {
  return (
    <div className="admin-card">
      <h3>Existing Offers</h3>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Pack</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {offers.map(o => (
            <tr key={o.id}>
              <td>{o.title}</td>
              <td>{o.packSize}</td>
              <td>{o.active ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => onEdit(o)}>Edit</button>{" "}
                <button onClick={() => onDelete(o.id)}>Delete</button>
              </td>
            </tr>
          ))}

          {offers.length === 0 && (
            <tr>
              <td colSpan="4">No offers created</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
