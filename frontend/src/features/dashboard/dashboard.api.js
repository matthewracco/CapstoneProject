import api from "../../lib/axios";

export const getStats = () => api.get("/stats");
