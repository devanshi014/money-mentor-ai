import axios from "axios";
import { getToken } from "./authService";

const API = "/api/dashboard";

// ===============================
// Authentication Config
// ===============================

const authConfig = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ===============================
// Get Dashboard Data
// ===============================

export const getDashboard = async () => {
  const response = await axios.get(
    API,
    authConfig()
  );

  return response.data;
};