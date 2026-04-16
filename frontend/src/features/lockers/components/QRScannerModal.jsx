import { useEffect, useRef, useState } from "react";
import { X, ScanLine } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import toast from "react-hot-toast";

const SCANNER_ELEMENT_ID = "smartlocker-qr-scanner";

function deriveErrorMessage(err) {
  const name = err?.name || "";
  if (name === "NotAllowedError")  return "Camera access was denied. Browse lockers below.";
  if (name === "NotFoundError")    return "No camera found on this device. Browse lockers below.";
  if (name === "NotReadableError") return "Camera is in use by another app. Browse lockers below.";
  return "Camera is unavailable. Browse lockers below.";
}

export default function QRScannerModal({ open, lockers, onScanSuccess, onClose }) {
  const [error, setError] = useState("");
  const hasScanned = useRef(false);

  useEffect(() => {
    if (!open) return;

    setError("");
    hasScanned.current = false;

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (hasScanned.current) return;
          try {
            const { lockerId } = JSON.parse(decodedText);
            const locker = lockers.find((l) => l.id === lockerId);
            if (!locker) {
              toast.error("This locker is not available to you.");
              return;
            }
            hasScanned.current = true;
            scanner.stop()
              .catch(() => {})
              .finally(() => {
                scanner.clear();
                onScanSuccess(locker);
              });
          } catch (_) {
            // not a SmartLocker QR — ignore frame
          }
        },
        () => {} // suppress per-frame decode errors
      )
      .catch((err) => {
        setError(deriveErrorMessage(err));
        scanner.clear();
      });

    return () => {
      scanner.stop().catch(() => {}).finally(() => scanner.clear());
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Scan Locker QR</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">{error}</p>
              <button
                onClick={onClose}
                className="inline-block px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Browse Lockers
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-400 text-center mb-4">
                Point at a locker QR code to rent automatically
              </p>
              {/* html5-qrcode mounts its video element here */}
              <div id={SCANNER_ELEMENT_ID} className="w-full rounded-lg overflow-hidden" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
