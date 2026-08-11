
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = `${API_URL}/api/auth`;

// ======================================================
// REGISTER
// ======================================================

export const register = async (userData) => {
  const { data } = await axios.post(`${API}/register`, userData);

  if (data.token) {
    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  return data;
};

// ======================================================
// LOGIN
// ======================================================

export const login = async (userData) => {
  const { data } = await axios.post(`${API}/login`, userData);

  if (data.token) {
    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }

  return data;
};

// ======================================================
// LOGOUT
// ======================================================

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ======================================================
// GET CURRENT USER
// ======================================================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Invalid stored user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

// ======================================================
// GET JWT TOKEN
// ======================================================

export const getToken = () => {
  return localStorage.getItem("token");
};

// ======================================================
// CHECK LOGIN STATUS
// ======================================================

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

