import { useEffect, useState } from "react";
import { getRentals } from "../rentals.api";
import RentalList from "../components/RentalList";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRentals() {
    try {
      setLoading(true);
      const res = await getRentals();
      setRentals(res.data.rentals ?? res.data);
    } catch (err) {
      setError("Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRentals();
  }, []);

  if (loading)
    return <div className="p-8">Loading rentals...</div>;

  if (error)
    return (
      <div className="p-8 text-red-600">
        {error}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        My Rentals
      </h1>

      <RentalList
        rentals={rentals}
        onRefresh={fetchRentals}
      />
    </div>
  );
}
