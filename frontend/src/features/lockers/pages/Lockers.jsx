import { useEffect, useState } from "react";
import { getLockers } from "../lockers.api";
import LockerGrid from "../components/LockerGrid";
import CreateLockerModal from "../components/CreateLockerModal";
import RentLockerModal from "../components/RentLockerModal";
import { useAuth } from "../../auth/useAuth";
import { Plus } from "lucide-react";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Occupied", value: "OCCUPIED" },
  { label: "Maintenance", value: "MAINTENANCE" },
];

export default function Lockers() {
  const { user } = useAuth();
  const canManage = ["STAFF", "OWNER"].includes(user?.role);
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [rentLocker, setRentLocker] = useState(null);

  function fetchLockers() {
    setLoading(true);
    getLockers()
      .then((res) => setLockers(res.data.data ?? res.data.lockers ?? res.data))
      .catch(() => setError("Failed to load lockers."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchLockers();
  }, []);

  const filtered = filter
    ? lockers.filter((l) => l.status === filter)
    : lockers;

  const counts = {
    "": lockers.length,
    AVAILABLE: lockers.filter((l) => l.status === "AVAILABLE").length,
    OCCUPIED: lockers.filter((l) => l.status === "OCCUPIED").length,
    MAINTENANCE: lockers.filter((l) => l.status === "MAINTENANCE").length,
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );

  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lockers</h1>
          <p className="text-slate-500 text-sm mt-1">
            {lockers.length} total lockers
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={16} />
            Add Locker
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === tab.value
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <LockerGrid lockers={filtered} onRent={(locker) => setRentLocker(locker)} />

      {/* Modals */}
      {canManage && (
        <CreateLockerModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={fetchLockers}
        />
      )}
      <RentLockerModal
        open={!!rentLocker}
        locker={rentLocker}
        onClose={() => setRentLocker(null)}
        onRented={fetchLockers}
      />
    </div>
  );
}
