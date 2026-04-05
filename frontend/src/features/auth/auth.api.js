import api from "../../lib/axios";

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const refreshToken = (token) =>
  api.post("/auth/refresh", { refreshToken: token });
