
import axios from "axios";
import API_URL from "./api";

const API = `${API_URL}/api/stocks`;

// ======================================================
// GET DEFAULT STOCKS
// ======================================================

export const getStocks = async () => {
  const res = await axios.get(API);
  return res.data;
};

// ======================================================
// SEARCH STOCK BY SYMBOL
// ======================================================

export const searchStock = async (symbol) => {
  const res = await axios.get(
    `${API}/search?symbol=${encodeURIComponent(symbol)}`
  );

  return res.data;
};

// ======================================================
// GET STOCK HISTORY
// ======================================================

export const getStockHistory = async (symbol) => {
  const res = await axios.get(
    `${API}/history?symbol=${encodeURIComponent(symbol)}`
  );

  return res.data;
};

