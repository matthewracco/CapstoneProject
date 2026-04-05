import { useState } from "react";
import { X, Key } from "lucide-react";
import api from "../../../lib/axios";

const PRICES = { SMALL: 5, MEDIUM: 8, LARGE: 12 };

export default function RentLockerModal({ open, locker, onClose, onRented }) {
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  if (!open || !locker) return null;

  const price = PRICES[locker.type] || 8;

  async function handleRent() {
    setError("");
    setRenting(true);
    try {
      const res = await api.post("/rentals", { lockerId: locker.id });
      setResult(res.data.rental || res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to rent locker"
      );
    } finally {
      setRenting(false);
    }
  }

  function handleDone() {
    setResult(null);
    onRented();
    onClose();
  }

  // Success view
  if (result) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key size={28} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Rental Confirmed!
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            Locker {locker.lockerNumber} is now yours
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-400 mb-1">Your Rental Code</p>
            <p className="text-2xl font-mono font-bold text-indigo-600 tracking-wider">
              {result.rentalCode}
            </p>
          </div>

          <button
            onClick={handleDone}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Confirm view
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Rent Locker</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Locker</span>
              <span className="text-sm font-semibold">{locker.lockerNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Location</span>
              <span className="text-sm font-medium">{locker.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Size</span>
              <span className="text-sm font-medium">{locker.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Tier</span>
              <span className="text-sm font-medium">{locker.tier}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
              <span className="text-sm font-medium text-slate-700">Price</span>
              <span className="text-lg font-bold text-indigo-600">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRent}
              disabled={renting}
              className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {renting ? "Processing..." : "Confirm Rental"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
