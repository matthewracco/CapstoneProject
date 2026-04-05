import { useState } from "react";
import { X, CreditCard, Wallet, AlertTriangle, Loader2 } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const PRICES = { SMALL: 5, MEDIUM: 8, LARGE: 12 };

const METHODS = [
  {
    key: "mock_card",
    label: "Credit Card",
    icon: CreditCard,
    description: "Visa ending in 4242",
    tint: "",
  },
  {
    key: "mock_wallet",
    label: "Digital Wallet",
    icon: Wallet,
    description: "Apple Pay / Google Pay",
    tint: "",
  },
  {
    key: "mock_card_fail",
    label: "Test Decline",
    icon: AlertTriangle,
    description: "Simulates a failed payment",
    tint: "border-red-200 bg-red-50/50",
  },
];

export default function PaymentModal({
  rental,
  isOpen,
  onClose,
  onPaymentComplete,
}) {
  const [method, setMethod] = useState("mock_card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !rental) return null;

  const lockerType = rental.locker?.type || "MEDIUM";
  const price = PRICES[lockerType] || 8;

  async function handlePay() {
    setError("");
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      await api.post("/payments", {
        rentalId: rental.id,
        method,
      });
      toast.success("Payment successful!");
      onPaymentComplete?.();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || "Payment failed. Try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">
            Complete Payment
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
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Rental details */}
          <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Locker</span>
              <span className="text-sm font-semibold">
                {rental.locker?.lockerNumber || rental.lockerId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Size</span>
              <span className="text-sm font-medium">{lockerType}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
              <span className="text-sm font-medium text-slate-700">Total</span>
              <span className="text-lg font-bold text-indigo-600">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment methods */}
          <p className="text-sm font-medium text-slate-700 mb-3">
            Payment Method
          </p>
          <div className="space-y-2 mb-5">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const selected = method === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition text-left ${
                    selected
                      ? "border-indigo-500 bg-indigo-50/50"
                      : `border-slate-200 hover:border-slate-300 ${m.tint}`
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      m.key === "mock_card_fail"
                        ? "bg-red-100"
                        : "bg-indigo-50"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        m.key === "mock_card_fail"
                          ? "text-red-500"
                          : "text-indigo-600"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {m.label}
                    </p>
                    <p className="text-xs text-slate-400">{m.description}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selected
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300"
                    }`}
                  >
                    {selected && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
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
              onClick={handlePay}
              disabled={processing}
              className="flex-1 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${price.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
