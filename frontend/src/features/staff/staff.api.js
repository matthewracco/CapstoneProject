import api from "../../lib/axios";

export const getAllRentals = () => api.get("/rentals");
export const forceCompleteRental = (id) => api.post(`/rentals/${id}/force-complete`);
export const overrideLocker = (id, data) => api.post(`/lockers/${id}/override`, data);
export const getUsers = () => api.get("/users");
export const changeUserRole = (id, role) => api.patch(`/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const assignLocker = (lockerId, userId) => api.patch(`/lockers/${lockerId}/assign`, { userId });
export const unassignLocker = (lockerId) => api.patch(`/lockers/${lockerId}/assign`, { userId: null });
