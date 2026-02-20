import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAuthedApi } from "../../../lib/useAuthedApi"; 
import RentalList from "../components/RentalList";

export default function Rentals() {
  const api = useAuthedApi();
  const { isLoaded, isSignedIn } = useAuth();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRentals() {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/rentals"); 
      setRentals(res.data.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      setRentals([]);
      return;
    }

    fetchRentals();
  }, [isLoaded, isSignedIn]);

  if (loading) return <div className="p-8">Loading rentals...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Rentals</h1>
      <RentalList rentals={rentals} onRefresh={fetchRentals} />
    </div>
  );
}