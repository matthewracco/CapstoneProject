import api from "./axios";
import { useAuth } from "@clerk/clerk-react";

export function useAuthedApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  async function withAuthHeaders(config = {}) {
    if (!isLoaded || !isSignedIn) return config;

    const token = await getToken();
    return {
      ...config,
      headers: {
        ...(config.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }

  return {
    async get(path, config) {
      return api.get(path, await withAuthHeaders(config));
    },
    async post(path, data, config) {
      return api.post(path, data, await withAuthHeaders(config));
    },
    async patch(path, data, config) {
      return api.patch(path, data, await withAuthHeaders(config));
    },
    async del(path, config) {
      return api.delete(path, await withAuthHeaders(config));
    },
  };
}