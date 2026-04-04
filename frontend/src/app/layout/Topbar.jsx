import { useAuth } from "../../features/auth/useAuth";
import { User } from "lucide-react";
import NotificationBell from "../../features/notifications/NotificationBell";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-slate-100">
      <h1 className="font-semibold text-lg text-slate-700">
        SmartLocker Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <NotificationBell />

        {/* User info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={14} className="text-indigo-600" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
