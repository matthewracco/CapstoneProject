export default function LockerCard({ locker }) {
  const statusStyles = {
    AVAILABLE: "bg-green-100 text-green-600",
    RESERVED: "bg-yellow-100 text-yellow-600",
    OUT_OF_SERVICE: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{locker.name}</h3>
        <p className="text-sm text-slate-500">{locker.size}</p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[locker.status]}`}
      >
        {locker.status}
      </span>
    </div>
  );
}
