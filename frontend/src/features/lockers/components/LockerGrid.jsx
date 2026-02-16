import LockerCard from "./LockerCard";

export default function LockerGrid({ lockers }) {
  if (!lockers.length)
    return <div>No lockers available</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {lockers.map((locker) => (
        <LockerCard key={locker.id} locker={locker} />
      ))}
    </div>
  );
}
