import axios from "axios";

const API = "/api/expenses";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getExpenses = async () => {
  const response = await axios.get(API, authHeader());
  return response.data;
};

export const addExpense = async (expense) => {
  const response = await axios.post(API, expense, authHeader());
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API}/${id}`, authHeader());
  return response.data;
};