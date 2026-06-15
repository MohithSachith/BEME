import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000"
});

// Attach JWT token to every request if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;