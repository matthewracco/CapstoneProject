import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "./dashboard.api";
import { useAuth } from "../auth/useAuth";
import {
  Box,
  Users,
  DollarSign,
  Activity,
  Wrench,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Key,
  Search,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color] || colors.indigo}`}>
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function UtilizationBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600 w-24">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-700 w-12 text-right">
        {value}
      </span>
    </div>
  );
}

function RecentRental({ rental }) {
  const statusColors = {
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-slate-100 text-slate-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Box size={16} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Locker {rental.locker?.lockerNumber || rental.lockerId}
          </p>
          <p className="text-xs text-slate-400">
            {new Date(rental.startTime).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-700">
          ${rental.totalCost?.toFixed(2)}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[rental.status] || "bg-slate-100"
          }`}
        >
          {rental.status}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-red-600">Failed to load dashboard data.</div>
    );
  }

  const o = stats.overview;

  /* ── Customer Dashboard ── */
  if (isCustomer) {
    return (
      <div className="space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's your locker activity
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            icon={Key}
            label="My Active Rentals"
            value={o.activeRentals}
            sub="Currently renting"
            color="green"
          />
          <StatCard
            icon={Box}
            label="Available Lockers"
            value={o.availableLockers}
            sub={`of ${o.totalLockers} total`}
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/lockers"
            className="flex items-center justify-between bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <Search size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Browse Lockers
                </p>
                <p className="text-xs text-slate-400">
                  Find and rent an available locker
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-slate-300 group-hover:text-indigo-500 transition"
            />
          </Link>
          <Link
            to="/rentals"
            className="flex items-center justify-between bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <Key size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  My Rentals
                </p>
                <p className="text-xs text-slate-400">
                  View rentals, access codes & payments
                </p>
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-slate-300 group-hover:text-green-500 transition"
            />
          </Link>
        </div>

        {/* Recent Rentals */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Activity
          </h2>
          {stats.recentRentals?.length > 0 ? (
            <div>
              {stats.recentRentals.map((rental) => (
                <RecentRental key={rental.id} rental={rental} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Box size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">No rentals yet.</p>
              <Link
                to="/lockers"
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700 mt-2 inline-block"
              >
                Browse available lockers
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Staff / Owner Management Dashboard ── */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Overview of your locker facility
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Box}
          label="Total Lockers"
          value={o.totalLockers}
          sub={`${o.availableLockers} available`}
          color="indigo"
        />
        <StatCard
          icon={Activity}
          label="Active Rentals"
          value={o.activeRentals}
          sub={`${o.utilizationRate}% utilization`}
          color="green"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${o.totalRevenue.toFixed(2)}`}
          sub={`${o.completedRentals} completed`}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Rentals"
          value={o.totalRentals}
          sub={`${o.cancelledRentals} cancelled`}
          color="amber"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locker Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Locker Status
          </h2>
          <div className="space-y-4">
            <UtilizationBar
              label="Available"
              value={o.availableLockers}
              total={o.totalLockers}
              color="bg-green-500"
            />
            <UtilizationBar
              label="Occupied"
              value={o.occupiedLockers}
              total={o.totalLockers}
              color="bg-amber-500"
            />
            <UtilizationBar
              label="Maintenance"
              value={o.maintenanceLockers}
              total={o.totalLockers}
              color="bg-red-400"
            />
          </div>
        </div>

        {/* Lockers by Type */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Lockers by Size
          </h2>
          <div className="space-y-4">
            {(stats.lockersByType || []).map((t) => (
              <UtilizationBar
                key={t.type}
                label={t.type}
                value={t.count}
                total={o.totalLockers}
                color={
                  t.type === "SMALL"
                    ? "bg-blue-500"
                    : t.type === "MEDIUM"
                    ? "bg-indigo-500"
                    : "bg-purple-500"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Rentals */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Rentals
        </h2>
        {stats.recentRentals?.length > 0 ? (
          <div>
            {stats.recentRentals.map((rental) => (
              <RecentRental key={rental.id} rental={rental} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No rentals yet.</p>
        )}
      </div>
    </div>
  );
}
