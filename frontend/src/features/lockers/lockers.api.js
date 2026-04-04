import api from "../../lib/axios";

export const getLockers = () => api.get("/lockers");
