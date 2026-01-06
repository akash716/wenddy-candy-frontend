import React, { useState, useEffect } from "react";
import api from "../api";

export default function TodayReport() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/admin/reports/today")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Today’s Sales Report</h2>

      {data.bills.map(bill => (
        <div key={bill.bill_id}>
          <strong>Bill #{bill.bill_id}</strong>
          {bill.lines.map((line, i) => (
            <div key={i}>
              {line.type} → {line.items} (₹{line.price})
            </div>
          ))}
          <hr />
        </div>
      ))}

      <h3>Total Bills: {data.summary.total_bills}</h3>
      <h2>Total Amount: ₹{data.summary.total_amount}</h2>
    </div>
  );
}
