import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 400 },
  { month: "Feb", revenue: 700 },
  { month: "Mar", revenue: 1200 },
  { month: "Apr", revenue: 1800 },
];

export default function Analytics() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Revenue Analytics</h1>

      <div className="bg-white rounded-2xl shadow p-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" />
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
