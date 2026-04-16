import { useState, useEffect } from "react";
import { Settings, Loader2 } from "lucide-react";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

const DURATION_OPTIONS = [
  { label: "1 hour", value: 1 },
  { label: "2 hours", value: 2 },
  { label: "4 hours", value: 4 },
  { label: "8 hours", value: 8 },
  { label: "24 hours", value: 24 },
];

export default function FacilitySettings() {
  const [mode, setMode] = useState("PUBLIC");
  const [maxDurationHours, setMaxDurationHours] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await api.get("/settings");
      const s = res.data.settings;
      setMode(s.mode ?? "PUBLIC");
      setMaxDurationHours(s.maxDurationHours ?? "");
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/settings", {
        mode,
        maxDurationHours: maxDurationHours === "" ? null : Number(maxDurationHours),
      });
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Settings size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Facility Settings</h1>
          <p className="text-sm text-slate-500">Configure your facility preferences</p>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg">
        {/* Facility Mode */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Facility Mode</h2>
        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="PUBLIC"
              checked={mode === "PUBLIC"}
              onChange={() => setMode("PUBLIC")}
              className="mt-1 accent-indigo-600"
            />
            <div>
              <span className="text-sm font-medium text-slate-800">PUBLIC</span>
              <p className="text-xs text-slate-500">Anyone can rent any available locker</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="PRIVATE"
              checked={mode === "PRIVATE"}
              onChange={() => setMode("PRIVATE")}
              className="mt-1 accent-indigo-600"
            />
            <div>
              <span className="text-sm font-medium text-slate-800">PRIVATE</span>
              <p className="text-xs text-slate-500">Customers can only access their assigned locker</p>
            </div>
          </label>
        </div>

        {/* Max Duration — only shown in PUBLIC mode (per D-08) */}
        {mode === "PUBLIC" && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Max Rental Duration</h2>
            <select
              value={maxDurationHours}
              onChange={(e) => setMaxDurationHours(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white cursor-pointer mb-6"
            >
              <option value="">No limit</option>
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </>
        )}

        {/* Save Button (per D-01, D-02 — always enabled, no dirty-state tracking) */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
