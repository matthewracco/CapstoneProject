import api from "../../lib/axios";

export const getLockers = () => api.get("/lockers");
export const updateLocker = (id, data) =>
  api.put(`/lockers/${id}`, data);
