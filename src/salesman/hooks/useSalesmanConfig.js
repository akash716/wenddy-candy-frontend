// src/hooks/useSalesmanConfig.js
import { useEffect, useState } from "react";
import api from "../../api"; // adjust path if needed

export default function useSalesmanConfig(stallId) {
  const [config, setConfig] = useState(null);
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeOffers = (offers = []) => {
    return offers.map(o => {
      // price may be null (mixed rules) or string/number
      let parsedPattern = null;

      if (o.price_pattern) {
        try {
          const raw =
            typeof o.price_pattern === "string"
              ? JSON.parse(o.price_pattern)
              : o.price_pattern;

          parsedPattern = Array.isArray(raw)
            ? raw.map(p => ({
                price: Number(p.price),
                qty: Number(p.qty)
              }))
            : null;
        } catch (e) {
          parsedPattern = null;
        }
      }

      return {
        ...o,
        // normalize numeric fields
        price:
          o.price === null || o.price === undefined
            ? null
            : Number(o.price),
        offer_price:
          o.offer_price !== undefined
            ? Number(o.offer_price)
            : Number(o.offer_price || 0),
        unique_count: Number(o.unique_count || 0),
        price_pattern: parsedPattern
      };
    });
  };

  const normalizeCandies = (list = []) => {
    return list.map(c => ({
      ...c,
      price: c.price !== undefined ? Number(c.price) : c.price,
      stock: c.stock !== undefined ? Number(c.stock) : c.stock
      // keep id as-is to avoid DB type mismatch
    }));
  };

  const loadAll = async () => {
    if (!stallId) return;

    setLoading(true);

    try {
      const res = await api.get(`/salesman/config/${stallId}`);

      const json = res.data || {};

      setConfig({
        stall: json.stall,
        event: json.event,
        offers: normalizeOffers(json.offers || [])
      });

      setCandies(normalizeCandies(json.candies || []));
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
