import axios from "axios";
import { getToken } from "./authService";

const API = "/api/portfolio-history";

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Get portfolio history
export const getPortfolioHistory = async () => {
  const response = await axios.get(
    API,
    authConfig()
  );

  return response.data;
};