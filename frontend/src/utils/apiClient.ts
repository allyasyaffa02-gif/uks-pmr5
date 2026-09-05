import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
