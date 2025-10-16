import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

//  attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Redirecting to login");
      // e.g., logout user or navigate('/login')
    }
    return Promise.reject(error);
  }
);

export default api;
