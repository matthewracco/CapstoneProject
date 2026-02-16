import { useAuth } from "../../features/auth/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
      <h1 className="font-semibold text-lg">Smart Locker Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user?.role}
        </span>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
