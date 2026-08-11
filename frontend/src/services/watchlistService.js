import axios from "axios";

const API = "/api/watchlist";

const getToken = () => {
  return localStorage.getItem("token");
};

// Get watchlist
export const getWatchlist = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

// Add stock
export const addToWatchlist = async (stock) => {
  const res = await axios.post(API, stock, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

// Remove stock
export const removeFromWatchlist = async (id) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};