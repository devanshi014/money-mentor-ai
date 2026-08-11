import axios from "axios";

const API = "/api/news";

export const getNews = async () => {
  const response = await axios.get(API);
  return response.data;
};