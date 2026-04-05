import { useState, useEffect, useRef } from "react";
import { X, Loader2, RefreshCw } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function AccessCodeModal({ rental, isOpen, onClose }) {
  const [code, setCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen && rental) {
      generateCode();
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, rental?.id]);

  useEffect(() => {
    if (!expiresAt) return;
    clearInterval(timerRef.current);

    function tick() {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      );
      setSecondsLeft(diff);
      if (diff <= 0) clearInterval(timerRef.current);
    }

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, [expiresAt]);

  async function generateCode() {
    setLoading(true);
    setCode(null);
    try {
      const res = await api.post(`/rentals/${rental.id}/access-code`);
      const data = res.data?.accessCode || res.data?.data || res.data;
      setCode(data.code);
      setExpiresAt(data.expiresAt);
      toast.success("Access code generated");
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to generate access code"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const expired = code && secondsLeft <= 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Access Code</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          {loading && (
            <div className="py-8 flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-indigo-600 animate-spin" />
              <p className="text-sm text-slate-500">Generating code...</p>
            </div>
          )}

          {code && !loading && (
            <>
              <p className="text-xs text-slate-400 mb-3">
                Use this code to unlock your locker
              </p>
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <p
                  className="text-4xl font-mono font-bold text-indigo-600"
                  style={{ letterSpacing: "0.5em" }}
                >
                  {code}
                </p>
              </div>

              {expired ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-500">
                    Code expired
                  </p>
                  <button
                    onClick={generateCode}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw size={14} />
                    Generate New Code
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Expires in{" "}
                  <span className="font-mono font-semibold text-slate-700">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </p>
              )}
            </>
          )}

          {!code && !loading && (
            <div className="py-8">
              <p className="text-sm text-slate-400">
                Failed to generate code. Please try again.
              </p>
              <button
                onClick={generateCode}
                className="mt-3 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
