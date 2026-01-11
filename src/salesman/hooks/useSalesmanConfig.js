import { useEffect, useState } from "react";
import api from "../../api"; // ✅ axios instance (Render backend)

export default function useSalesmanConfig(stallId) {
  const [config, setConfig] = useState(null);
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    if (!stallId) return;

    setLoading(true);

    try {
      // 1️⃣ Load salesman config (STALL + EVENT + OFFERS)
      const res = await api.get(`/salesman/config/${stallId}`);

      const json = res.data;

      // 🔥 CRITICAL: normalize config
      setConfig({
        stall: json.stall,
        event: json.event,
        offers: json.offers || []
      });

      // 🔥 INVENTORY-AWARE CANDIES
      setCandies(json.candies || []);

    } catch (err) {
      console.error("useSalesmanConfig ERROR:", err);
      setConfig(null);
      setCandies([]);
    } finally {
      setLoading(false);
    }
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
