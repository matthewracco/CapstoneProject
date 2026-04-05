import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getStats } from "../dashboard/dashboard.api";

const STATUS_COLORS = {
  AVAILABLE: "#22c55e",
  OCCUPIED: "#f59e0b",
  MAINTENANCE: "#ef4444",
};

const TYPE_COLORS = {
  SMALL: "#3b82f6",
  MEDIUM: "#6366f1",
  LARGE: "#8b5cf6",
};

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
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
    return <div className="p-8 text-red-600">Failed to load analytics.</div>;
  }

  const o = stats.overview;

  const statusData = (stats.lockersByStatus || []).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  const typeData = (stats.lockersByType || []).map((t) => ({
    name: t.type,
    count: t.count,
  }));

  const rentalSummary = [
    { name: "Active", value: o.activeRentals, color: "#22c55e" },
    { name: "Completed", value: o.completedRentals, color: "#6366f1" },
    { name: "Cancelled", value: o.cancelledRentals, color: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">
          Locker utilization and rental insights
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Utilization Rate" value={`${o.utilizationRate}%`} />
        <KPI label="Total Revenue" value={`$${o.totalRevenue.toFixed(2)}`} />
        <KPI label="Completed Rentals" value={o.completedRentals} />
        <KPI label="Active Rentals" value={o.activeRentals} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Locker Status Pie */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Locker Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {statusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] || "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lockers by Type Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Lockers by Size
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {typeData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={TYPE_COLORS[entry.name] || "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rental breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Rental Breakdown
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={rentalSummary}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {rentalSummary.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
