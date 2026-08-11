import axios from "axios";

const API = "/api/stocks";

// Get default stocks
export const getStocks = async () => {
  const res = await axios.get(API);
  return res.data;
};

// Search stock by symbol
export const searchStock = async (symbol) => {
  const res = await axios.get(
    `${API}/search?symbol=${symbol}`
  );

  return res.data;
};

// Get stock history
export const getStockHistory = async (symbol) => {
  const res = await axios.get(
    `${API}/history?symbol=${symbol}`
  );

  return res.data;
};