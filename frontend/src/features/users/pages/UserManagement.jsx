import { useState, useEffect } from "react";
import { Users, Search, Loader2, Trash2 } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const roleStyles = {
  OWNER: "bg-purple-100 text-purple-700",
  STAFF: "bg-amber-100 text-amber-700",
  CUSTOMER: "bg-blue-100 text-blue-700",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      toast.success(`Role updated to ${role}`);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to update role");
    }
  }

  async function handleDelete(userId, name) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to delete user");
    }
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">User Management</h1>
            <p className="text-sm text-slate-500">{users.length} users total</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="STAFF">Staff</option>
          <option value="OWNER">Owner</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Users size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No users found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
              {/* Avatar */}
              <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
                {u.name?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                <p className="text-xs text-slate-400 truncate">{u.email}</p>
              </div>

              {/* Role badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${roleStyles[u.role] || "bg-slate-100 text-slate-500"}`}>
                {u.role}
              </span>

              {/* Joined */}
              <span className="text-xs text-slate-400 shrink-0 hidden sm:block">
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </span>

              {/* Role dropdown */}
              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 cursor-pointer shrink-0"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="STAFF">Staff</option>
                <option value="OWNER">Owner</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => handleDelete(u.id, u.name)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                title="Delete user"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
