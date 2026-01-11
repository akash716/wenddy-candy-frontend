import api from "../../api"; // adjust path if needed

export const getAvailableCandies = async (stallId) => {
  const res = await api.get(`/salesman/${stallId}/candies`);
  return res.data;
};

export const sellCandy = async (stallId, candyId, qty) => {
  const res = await api.post(`/salesman/${stallId}/sell`, {
    candyId,
    qty,
  });

  return res.data;
};
