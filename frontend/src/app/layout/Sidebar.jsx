import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  BarChart3,
  Bell,
  Shield,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../features/auth/useAuth";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["CUSTOMER", "STAFF", "OWNER"],
  },
  {
    name: "Lockers",
    path: "/lockers",
    icon: Box,
    roles: ["CUSTOMER", "STAFF", "OWNER"],
  },
  {
    name: "Rentals",
    path: "/rentals",
    icon: ClipboardList,
    roles: ["CUSTOMER", "STAFF", "OWNER"],
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
    roles: ["CUSTOMER", "STAFF", "OWNER"],
  },
  {
    name: "Staff",
    path: "/staff",
    icon: Shield,
    roles: ["STAFF", "OWNER"],
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    roles: ["OWNER"],
  },
  {
    name: "Users",
    path: "/users",
    icon: Users,
    roles: ["OWNER"],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold tracking-wide">SmartLocker</h2>
            {["STAFF", "OWNER"].includes(user?.role) && (
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">
                {user?.role === "OWNER" ? "Admin Panel" : "Staff Panel"}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {navigation
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />

                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-800"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
