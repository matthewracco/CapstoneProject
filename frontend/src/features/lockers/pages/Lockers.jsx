import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAuthedApi } from "../../../lib/useAuthedApi";

export default function Lockers() {
  const api = useAuthedApi();
  const { isLoaded, isSignedIn } = useAuth();

  const [lockers, setLockers] = useState([]);
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
        const res = await api.get("/lockers");
        if (!mounted) return;
        setLockers(res.data.data ?? []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e.message || "Failed to load lockers");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [isLoaded, isSignedIn]);

  if (loading) return <div className="text-slate-600">Loading lockers...</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Lockers</h2>
      {lockers.length === 0 ? (
        <div className="text-slate-500">No lockers found.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {lockers.map((l) => (
            <div key={l.id} className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="font-semibold">{l.location}</div>
              <div className="text-sm text-slate-600">Locker: {l.lockerNumber}</div>
              <div className="text-sm text-slate-600">Status: {l.status}</div>
              <div className="text-sm text-slate-600">{l.type} • {l.tier}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}