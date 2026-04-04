import { useState } from "react";
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

  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-600",
    COMPLETED: "bg-slate-200 text-slate-600",
    CANCELLED: "bg-red-100 text-red-600",
    OVERDUE: "bg-red-100 text-red-700",
  };

  const lockerLabel = rental.locker?.lockerNumber ?? rental.lockerId;
  const isActive = rental.status === "ACTIVE";
  const needsPayment = rental.paymentStatus === "PENDING" && isActive;

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
            {rental.endTime && (
              <p className="text-sm text-slate-500">
                {rental.status === "ACTIVE" ? "Ends" : "Ended"}: {new Date(rental.endTime).toLocaleString()}
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

            <button
              onClick={() => setShowExtend(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
            >
              <Clock size={14} />
              Extend
            </button>

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
