import { useState, useEffect, useRef } from "react";
import { Key, Clock, CreditCard } from "lucide-react";
import { endRental } from "../rentals.api";
import toast from "react-hot-toast";
import AccessCodeModal from "../../lockers/components/AccessCodeModal";
import ExtendRentalModal from "./ExtendRentalModal";
import PaymentModal from "./PaymentModal";

export default function RentalCard({ rental, onRefresh }) {
  const [ending, setEnding] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const lockerLabel = rental.locker?.lockerNumber ?? rental.lockerId;
  const isActive = rental.status === "ACTIVE";
  const needsPayment = rental.paymentStatus === "PENDING" && isActive;

  const timerRef = useRef(null);
  const [minutesLeft, setMinutesLeft] = useState(null);

  useEffect(() => {
    if (!isActive || !rental.endTime) return;

    function tick() {
      const diffMs = new Date(rental.endTime).getTime() - Date.now();
      setMinutesLeft(Math.max(0, Math.floor(diffMs / 60000)));
    }

    tick();
    timerRef.current = setInterval(tick, 60000);
    return () => clearInterval(timerRef.current);
  }, [isActive, rental.endTime]);

  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-600",
    COMPLETED: "bg-slate-200 text-slate-600",
    CANCELLED: "bg-red-100 text-red-600",
    OVERDUE: "bg-red-100 text-red-700",
  };

  async function handleEndRental() {
    try {
      setEnding(true);
      await endRental(rental.id);
      toast.success("Rental ended successfully");
      onRefresh();
    } catch (err) {
      toast.error("Failed to end rental");
    } finally {
      setEnding(false);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-slate-800">Locker {lockerLabel}</h3>
            <p className="text-sm text-slate-500">
              Code: <span className="font-mono">{rental.rentalCode}</span>
            </p>
            <p className="text-sm text-slate-500">
              Started: {new Date(rental.startTime).toLocaleString()}
            </p>

            {/* ACTIVE with no endTime: subscription */}
            {isActive && !rental.endTime && (
              <p className="text-sm text-indigo-500 font-medium">Subscription</p>
            )}

            {/* ACTIVE with endTime: live countdown (D-04, TIMER-01, TIMER-02) */}
            {isActive && rental.endTime && rental.status !== "OVERDUE" && minutesLeft !== null && (
              <p className={`text-sm ${
                minutesLeft < 30
                  ? "text-red-600"
                  : minutesLeft < 120
                  ? "text-amber-600"
                  : "text-slate-500"
              }`}>
                {Math.floor(minutesLeft / 60) > 0
                  ? `${Math.floor(minutesLeft / 60)}h ${minutesLeft % 60}m remaining`
                  : `${minutesLeft}m remaining`}
              </p>
            )}

            {/* OVERDUE: static label (D-07) */}
            {rental.status === "OVERDUE" && (
              <p className="text-sm text-red-600">Overdue</p>
            )}

            {/* COMPLETED / CANCELLED: static end date (D-05) */}
            {!isActive && rental.status !== "OVERDUE" && rental.endTime && (
              <p className="text-sm text-slate-500">
                Ended: {new Date(rental.endTime).toLocaleString()}
              </p>
            )}

            {rental.totalCost > 0 && (
              <p className="text-sm text-slate-500">
                Cost: <span className="font-semibold text-indigo-600">${rental.totalCost.toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="text-right space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[rental.status] ?? "bg-slate-100 text-slate-500"}`}>
              {rental.status}
            </span>
            {needsPayment && (
              <span className="block px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                Payment Pending
              </span>
            )}
          </div>
        </div>

        {/* Action buttons for active rentals */}
        {isActive && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowAccessCode(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <Key size={14} />
              Get Access Code
            </button>

            {rental.endTime && (
              <button
                onClick={() => setShowExtend(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
              >
                <Clock size={14} />
                Extend
              </button>
            )}

            {needsPayment && (
              <button
                onClick={() => setShowPayment(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
              >
                <CreditCard size={14} />
                Pay Now
              </button>
            )}

            <button
              onClick={handleEndRental}
              disabled={ending}
              className="ml-auto px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {ending ? "Ending..." : "End Rental"}
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AccessCodeModal
        rental={rental}
        isOpen={showAccessCode}
        onClose={() => setShowAccessCode(false)}
      />
      <ExtendRentalModal
        rental={rental}
        isOpen={showExtend}
        onClose={() => setShowExtend(false)}
        onExtended={onRefresh}
      />
      <PaymentModal
        rental={rental}
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPaymentComplete={onRefresh}
      />
    </>
  );
}
