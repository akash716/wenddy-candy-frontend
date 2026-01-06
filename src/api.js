import axios from "axios";

const api = axios.create({
  baseURL: "https://wenddy-candy-backend.onrender.com/api"
});

export default api;
