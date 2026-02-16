import RentalCard from "./RentalCard";

export default function RentalList({ rentals, onRefresh }) {
  if (!rentals.length)
    return (
      <div className="bg-white p-8 rounded-2xl text-center text-slate-500">
        No rentals found.
      </div>
    );

  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <RentalCard
          key={rental.id}
          rental={rental}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
