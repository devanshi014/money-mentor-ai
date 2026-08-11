
import axios from "axios";
import API_URL from "./api";

const API = `${API_URL}/api/news`;

// ======================================================
// GET FINANCE NEWS
// ======================================================

export const getNews = async () => {
  const response = await axios.get(API);
  return response.data;
};

