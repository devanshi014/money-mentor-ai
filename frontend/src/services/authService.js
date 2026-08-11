import axios from "axios";

const API = "/api/auth";

// Register
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

// Login
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

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check login status
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};