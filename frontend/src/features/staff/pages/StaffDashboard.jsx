import { useState, useEffect } from "react";
import { Shield, Box, ClipboardList, Users, Loader2, AlertTriangle } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const TABS = [
  { key: "lockers", label: "All Lockers", icon: Box },
  { key: "rentals", label: "Active Rentals", icon: ClipboardList },
  { key: "users", label: "Users", icon: Users },
];

const statusStyles = {
  AVAILABLE: "bg-green-100 text-green-700",
  OCCUPIED: "bg-amber-100 text-amber-700",
  MAINTENANCE: "bg-red-100 text-red-700",
};

const roleStyles = {
  OWNER: "bg-purple-100 text-purple-700",
  STAFF: "bg-amber-100 text-amber-700",
  CUSTOMER: "bg-blue-100 text-blue-700",
};

export default function StaffDashboard() {
  const [tab, setTab] = useState("lockers");
  const [lockers, setLockers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "lockers") {
        const res = await api.get("/lockers");
        setLockers(res.data.lockers || res.data.data || []);
      } else if (tab === "rentals") {
        const res = await api.get("/rentals");
        setRentals(res.data.rentals || res.data.data || []);
      } else if (tab === "users") {
        const res = await api.get("/users");
        setUsers(res.data.users || res.data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleOverride(lockerId, status) {
    try {
      await api.post(`/lockers/${lockerId}/override`, { status });
      toast.success(`Locker set to ${status}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Override failed");
    }
  }

  async function handleForceEnd(rentalId) {
    try {
      await api.post(`/rentals/${rentalId}/force-complete`);
      toast.success("Rental force-ended");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to end rental");
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success(`Role updated to ${role}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update role");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Shield size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Staff Dashboard</h1>
          <p className="text-sm text-slate-500">Manage lockers, rentals, and users</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Lockers Tab */}
          {tab === "lockers" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Locker</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lockers.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{l.lockerNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{l.location}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{l.type} / {l.tier}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[l.status] || "bg-slate-100 text-slate-500"}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {l.status !== "AVAILABLE" && (
                            <button onClick={() => handleOverride(l.id, "AVAILABLE")} className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition">
                              Set Available
                            </button>
                          )}
                          {l.status !== "MAINTENANCE" && (
                            <button onClick={() => handleOverride(l.id, "MAINTENANCE")} className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition">
                              Maintenance
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lockers.length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No lockers found</p>
              )}
            </div>
          )}

          {/* Rentals Tab */}
          {tab === "rentals" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Rental Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Locker</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Start</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">End</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rentals.map((r) => {
                    const isOverdue = r.status === "ACTIVE" && r.endTime && new Date(r.endTime) < new Date();
                    return (
                      <tr key={r.id} className={`hover:bg-slate-50 transition ${isOverdue ? "bg-red-50/50" : ""}`}>
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">{r.rentalCode}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">{r.locker?.lockerNumber || r.lockerId}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{new Date(r.startTime).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{r.endTime ? new Date(r.endTime).toLocaleString() : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isOverdue ? "bg-red-100 text-red-700" : r.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {isOverdue ? "OVERDUE" : r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {r.status === "ACTIVE" && (
                            <button onClick={() => handleForceEnd(r.id)} className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition flex items-center gap-1 ml-auto">
                              <AlertTriangle size={12} />
                              Force End
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rentals.length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No rentals found</p>
              )}
            </div>
          )}

          {/* Users Tab */}
          {tab === "users" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles[u.role] || "bg-slate-100 text-slate-500"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 cursor-pointer"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="STAFF">Staff</option>
                          <option value="OWNER">Owner</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No users found</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
