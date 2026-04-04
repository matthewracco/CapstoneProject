import { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock, AlertTriangle, Loader2, CheckCheck } from "lucide-react";
import { getNotifications, markAsRead, markAllRead } from "./notifications.api";
import toast from "react-hot-toast";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getIcon(type) {
  switch (type) {
    case "RENTAL_CONFIRMATION":
      return <CheckCircle size={20} className="text-green-500" />;
    case "EXPIRY_WARNING":
      return <Clock size={20} className="text-amber-500" />;
    case "RENTAL_EXPIRED":
    case "RENTAL_OVERDUE":
      return <AlertTriangle size={20} className="text-red-500" />;
    default:
      return <Bell size={20} className="text-slate-400" />;
  }
}

function getBorderColor(type) {
  switch (type) {
    case "RENTAL_CONFIRMATION": return "border-l-green-500";
    case "EXPIRY_WARNING": return "border-l-amber-500";
    case "RENTAL_EXPIRED":
    case "RENTAL_OVERDUE": return "border-l-red-500";
    default: return "border-l-slate-300";
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await getNotifications();
      const list = res.data.notifications || res.data.data || res.data;
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {}
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Bell size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
            <p className="text-sm text-slate-500">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-medium">No notifications yet</p>
          <p className="text-sm text-slate-400 mt-1">
            You'll see rental confirmations, expiry warnings, and more here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && handleMarkRead(n.id)}
              className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-4 border-l-4 cursor-pointer hover:shadow-md transition ${
                getBorderColor(n.type)
              } ${!n.read ? "bg-indigo-50/30" : ""}`}
            >
              <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  {!n.read && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
