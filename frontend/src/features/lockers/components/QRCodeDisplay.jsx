import { useState } from "react";
import { Download, QrCode, Loader2 } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

export default function QRCodeDisplay({ locker }) {
  const [qrData, setQrData] = useState(locker?.qrCode || null);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await api.post(`/lockers/${locker.id}/qr`);
      const qr = res.data?.qrCode || res.data?.data?.qrCode;
      setQrData(qr);
      toast.success("QR code generated");
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to generate QR code"
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!qrData) return;
    const link = document.createElement("a");
    link.href = qrData;
    link.download = `locker-${locker.lockerNumber}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
      <div className="mb-4">
        {qrData ? (
          <div className="bg-white rounded-xl p-4 inline-block border border-slate-100">
            <img
              src={qrData}
              alt={`QR code for locker ${locker.lockerNumber}`}
              className="w-48 h-48 mx-auto"
            />
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-3">
            <QrCode size={48} className="text-slate-300" />
            <p className="text-sm text-slate-400">No QR generated</p>
          </div>
        )}
      </div>

      <h4 className="font-bold text-slate-800 text-base">
        {locker.lockerNumber}
      </h4>
      <p className="text-xs text-slate-400 mb-4">{locker.location}</p>

      <div className="flex gap-2 justify-center">
        {!qrData && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode size={14} />
                Generate QR
              </>
            )}
          </button>
        )}
        {qrData && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Download size={14} />
            Download
          </button>
        )}
      </div>
    </div>
  );
}
