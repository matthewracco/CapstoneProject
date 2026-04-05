import LockerCard from "./LockerCard";

export default function LockerGrid({ lockers, onRent }) {
  if (!lockers.length)
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <p className="text-slate-400">No lockers available</p>
      </div>
    );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lockers.map((locker) => (
        <LockerCard key={locker.id} locker={locker} onRent={onRent} />
      ))}
    </div>
  );
}
