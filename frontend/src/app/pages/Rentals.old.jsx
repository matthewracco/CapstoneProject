import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAuthedApi } from "../../lib/useAuthedApi";

export default function Rentals() {
  const api = useAuthedApi();
  const { isLoaded, isSignedIn } = useAuth();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get("/rentals");
        if (!mounted) return;
        setRentals(res.data.data ?? []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e.message || "Failed to load rentals");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [isLoaded, isSignedIn]);

  if (loading) return <div className="text-slate-600">Loading rentals...</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rentals</h2>
      {rentals.length === 0 ? (
        <div className="text-slate-500">No rentals yet.</div>
      ) : (
        <div className="space-y-3">
          {rentals.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Rental #{r.rentalCode}</div>
                <div className="text-sm text-slate-600">{r.status}</div>
              </div>
              <div className="text-sm text-slate-600">Payment: {r.paymentStatus}</div>
              <div className="text-sm text-slate-600">Total: {r.totalCost}</div>
              <div className="text-sm text-slate-600">
                Started: {new Date(r.startTime).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}