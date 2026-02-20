import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:5050/api/v1" : undefined);

if (!baseURL) {
  throw new Error("Missing VITE_API_URL");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;