import { Box, MapPin, Layers, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  AVAILABLE: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  OCCUPIED: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  MAINTENANCE: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  ASSIGNED: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
};

const sizeLabels = { SMALL: "S", MEDIUM: "M", LARGE: "L" };

export default function LockerCard({ locker, onRent }) {
  const s = statusStyles[locker.status] || statusStyles.AVAILABLE;
  const isAvailable = locker.status === "AVAILABLE";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5 border-l-4 ${
        isAvailable
          ? "border-green-500"
          : locker.status === "OCCUPIED"
          ? "border-amber-500"
          : locker.status === "ASSIGNED"
          ? "border-indigo-500"
          : "border-red-400"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Box size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {locker.lockerNumber}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={10} />
              {locker.location}
            </div>
          </div>
        </div>
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {locker.status}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
          <Layers size={11} />
          {locker.type}
        </span>
        {locker.tier === "PREMIUM" && (
          <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md">
            <Crown size={11} />
            Premium
          </span>
        )}
        <span className="ml-auto text-lg font-bold text-indigo-600">
          {sizeLabels[locker.type] || "M"}
        </span>
      </div>

      {isAvailable && onRent && (
        <button
          onClick={() => onRent(locker)}
          className="w-full py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Rent This Locker
        </button>
      )}

      {locker.status === "OCCUPIED" && (
        <div className="w-full py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg text-center">
          Currently Rented
        </div>
      )}

      {locker.status === "ASSIGNED" && (
        <Link
          to="/rentals"
          className="block w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition"
        >
          Your Locker — View Rental
        </Link>
      )}

      {locker.status === "MAINTENANCE" && (
        <div className="w-full py-2 text-sm font-medium text-red-500 bg-red-50 rounded-lg text-center">
          Under Maintenance
        </div>
      )}
    </div>
  );
}
