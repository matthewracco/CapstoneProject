import api from "../../lib/axios";

export const getRentals = () => api.get("/rentals");

export const endRental = (id) =>
  api.post(`/rentals/${id}/complete`);
