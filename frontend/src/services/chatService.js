import axios from "axios";
import API_URL from "./api";

const API = `${API_URL}/api/chat`;

export const sendMessage = async (message) => {
  const response = await axios.post(API, {
    message,
  });

  return response.data;
};