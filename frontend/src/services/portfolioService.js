import axios from "axios";
import { getToken } from "./authService";

const API = "/api/portfolio";

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
// Get Portfolio
// ===============================
export const getPortfolio = async () => {
  const response = await axios.get(
    API,
    authConfig()
  );

  return response.data;
};

// ===============================
// Add Holding
// ===============================
export const addHolding = async (holding) => {
  const response = await axios.post(
    API,
    holding,
    authConfig()
  );

  return response.data;
};

// ===============================
// Update Holding
// ===============================
export const updateHolding = async (
  id,
  holding
) => {
  const response = await axios.put(
    `${API}/${id}`,
    holding,
    authConfig()
  );

  return response.data;
};

// ===============================
// Delete Holding
// ===============================
export const deleteHolding = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    authConfig()
  );

  return response.data;
};

// ===============================
// Analyze Portfolio With AI
// ===============================
export const analyzePortfolio = async (
 portfolio
) => {
  const response = await axios.post(
    `${API}/analyze`,
    { portfolio },
    authConfig()
  );

  return response.data;
};