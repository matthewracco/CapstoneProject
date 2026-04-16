import axios from "axios";

const defaultBaseURL = import.meta.env.PROD
  ? "/api/v1"
  : "http://localhost:5050/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
