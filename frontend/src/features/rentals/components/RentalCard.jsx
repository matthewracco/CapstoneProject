import { useEffect, useState } from "react";
import { endRental } from "../rentals.api";

export default function RentalCard({ rental, onRefresh }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [ending, setEnding] = useState(false);

  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-600",
    EXPIRED: "bg-red-100 text-red-600",
    COMPLETED: "bg-slate-200 text-slate-600",
  };

  useEffect(() => {
    if (rental.status !== "ACTIVE") return;

    const interval = setInterval(() => {
      const end = new Date(rental.endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rental]);

  async function handleEndRental() {
    try {
      setEnding(true);
      await endRental(rental.id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setEnding(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">
          Locker {rental.lockerName}
        </h3>
        <p className="text-sm text-slate-500">
          Started: {new Date(rental.startTime).toLocaleString()}
        </p>
        <p className="text-sm text-slate-500">
          Ends: {new Date(rental.endTime).toLocaleString()}
        </p>

        {rental.status === "ACTIVE" && (
          <p className="mt-2 text-sm font-medium text-indigo-600">
            Time Left: {timeLeft}
          </p>
        )}
      </div>

      <div className="text-right space-y-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[rental.status]}`}
        >
          {rental.status}
        </span>

        {rental.status === "ACTIVE" && (
          <button
            onClick={handleEndRental}
            disabled={ending}
            className="block bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
          >
            {ending ? "Ending..." : "End Rental"}
          </button>
        )}
      </div>
    </div>
  );
}
