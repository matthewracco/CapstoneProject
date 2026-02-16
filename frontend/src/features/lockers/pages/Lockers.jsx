import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import LockerGrid from "../components/LockerGrid";

export default function Lockers() {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyLockers = [
      { id: 1, name: "Locker A1", location: "Floor 1", status: "Available" },
      { id: 2, name: "Locker B2", location: "Floor 2", status: "Occupied" },
      { id: 3, name: "Locker C3", location: "Floor 3", status: "Available" },
      { id: 4, name: "Locker D4", location: "Floor 1", status: "Occupied" },
    ];
  }, []);

  if (loading) return <div>Loading lockers...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lockers</h1>
      <LockerGrid lockers={lockers} />
    </div>
  );
}
