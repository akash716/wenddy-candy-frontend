import api from "../../api"; // adjust path if needed

export const getAvailableCandies = async (stallId) => {
  try {
    const res = await api.get(`/salesman/${stallId}/candies`);
    return res.data;
  } catch (err) {
    console.error("GET AVAILABLE CANDIES ERROR:", err);
    throw err;
  }
};

export const sellCandy = async (stallId, candyId, qty) => {
  try {
    const res = await api.post(`/salesman/${stallId}/sell`, {
      candyId,
      qty
    });

    return res.data;
  } catch (err) {
    console.error("SELL CANDY ERROR:", err);
    throw err;
  }
};
