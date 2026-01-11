import { useEffect, useState } from "react";

export default function useSalesmanConfig(stallId) {
  const [config, setConfig] = useState(null);
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    if (!stallId) return;

    setLoading(true);

    try {
      // 1️⃣ Load salesman config (STALL + EVENT + OFFERS)
      const res = await fetch(
        `http://localhost:5000/api/salesman/config/${stallId}`
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Config API failed");
      }

      const json = await res.json();

      // 🔥 THIS IS CRITICAL
      setConfig({
        stall: json.stall,
        event: json.event,
        offers: json.offers || []
      });

      // 🔥 INVENTORY-AWARE CANDIES
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

  return {
    config,
    candies,
    reloadCandies: loadAll,
    loading
  };
}
