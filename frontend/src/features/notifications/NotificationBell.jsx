import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, Clock, AlertTriangle, X } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
} from "./notifications.api";

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

function getNotificationIcon(type) {
  switch (type) {
    case "RENTAL_CONFIRMED":
    case "RENTAL_COMPLETED":
    case "confirmation":
      return <CheckCircle size={16} className="text-green-400" />;
    case "RENTAL_EXPIRING":
    case "expiry_warning":
      return <Clock size={16} className="text-amber-400" />;
    case "RENTAL_EXPIRED":
    case "RENTAL_OVERDUE":
    case "expired":
      return <AlertTriangle size={16} className="text-red-400" />;
    default:
      return <Bell size={16} className="text-slate-400" />;
  }
}

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Poll unread count every 30s
  useEffect(() => {
    function fetchCount() {
      getUnreadCount()
        .then((res) => {
          const data = res.data;
          setUnreadCount(data.count ?? data.unreadCount ?? data ?? 0);
        })
        .catch(() => {});
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const fetchNotifications = useCallback(() => {
    setLoading(true);
    getNotifications()
      .then((res) => {
        const list = res.data.notifications ?? res.data.data ?? res.data;
        setNotifications(Array.isArray(list) ? list.slice(0, 10) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleDropdown() {
    if (!open) {
      fetchNotifications();
    }
    setOpen((prev) => !prev);
  }

  async function handleMarkAsRead(id) {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg hover:bg-slate-50 transition text-slate-500"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-slate-800 rounded-xl shadow-lg border border-slate-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-750 cursor-pointer transition border-l-2 ${
                    n.read
                      ? "border-transparent hover:bg-slate-700/50"
                      : "border-indigo-500 bg-slate-700/30 hover:bg-slate-700/60"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {n.body || n.message}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="shrink-0 mt-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-700 px-4 py-2.5">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
