import axios from "axios";

const API = "/api/chat";

export const sendMessage = async (message) => {
  const response = await axios.post(API, {
    message,
  });

  return response.data;
};