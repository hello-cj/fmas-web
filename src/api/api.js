import axios from "axios";

const api = axios.create({
  baseURL: "https://fmas-api.onrender.com/api",
  //baseURL: "http://localhost:10000/api",
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
    //console.log("TOKEN FROM STORAGE:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    //console.log("FINAL REQUEST HEADERS:", config.headers);

  return config;
});

export default api;