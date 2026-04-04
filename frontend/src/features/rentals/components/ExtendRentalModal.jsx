import { useState } from "react";
import { X, Clock, Loader2 } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const DURATION_OPTIONS = [
  { hours: 1, label: "+1 hr" },
  { hours: 2, label: "+2 hr" },
  { hours: 4, label: "+4 hr" },
];

export default function ExtendRentalModal({
  rental,
  isOpen,
  onClose,
  onExtended,
}) {
  const [selectedHours, setSelectedHours] = useState(1);
  const [extending, setExtending] = useState(false);

  if (!isOpen || !rental) return null;

  const currentEnd = new Date(rental.endTime || rental.startTime);
  const newEnd = new Date(
    currentEnd.getTime() + selectedHours * 60 * 60 * 1000
  );

  async function handleExtend() {
    setExtending(true);
    try {
      await api.post(`/rentals/${rental.id}/extend`, {
        hours: selectedHours,
      });
      toast.success(`Rental extended by ${selectedHours} hour(s)`);
      onExtended?.();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to extend rental"
      );
    } finally {
      setExtending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">
            Extend Rental
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Current rental info */}
          <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Locker</span>
              <span className="text-sm font-semibold">
                {rental.locker?.lockerNumber || rental.lockerId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Current End</span>
              <span className="text-sm font-medium">
                {currentEnd.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Duration selector */}
          <p className="text-sm font-medium text-slate-700 mb-3">
            Extend Duration
          </p>
          <div className="flex gap-2 mb-5">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.hours}
                onClick={() => setSelectedHours(opt.hours)}
                className={`flex-1 py-3 text-sm font-medium rounded-xl border-2 transition ${
                  selectedHours === opt.hours
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* New end time preview */}
          <div className="bg-indigo-50 rounded-xl p-4 mb-5 flex items-center gap-3">
            <Clock size={18} className="text-indigo-600" />
            <div>
              <p className="text-xs text-indigo-500">New End Time</p>
              <p className="text-sm font-semibold text-indigo-700">
                {newEnd.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleExtend}
              disabled={extending}
              className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {extending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Extending...
                </>
              ) : (
                "Extend Rental"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
