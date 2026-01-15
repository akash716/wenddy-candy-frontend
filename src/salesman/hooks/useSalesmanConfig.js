// src/hooks/useSalesmanConfig.js
import { useEffect, useState } from "react";

export default function useSalesmanConfig(stallId) {
  const [config, setConfig] = useState(null);
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    if (!stallId) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/salesman/config/${stallId}`
      );

      if (!res.ok) throw new Error("Failed to load config");

      const json = await res.json();

      setConfig({
        stall: json.stall,
        event: json.event,
        offers: json.offers || []
      });

      setCandies(json.candies || []);
    } catch (err) {
      console.error("useSalesmanConfig ERROR:", err.message);
      setConfig(null);
      setCandies([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [stallId]);

  return { config, candies, reloadCandies: loadAll, loading };
}
