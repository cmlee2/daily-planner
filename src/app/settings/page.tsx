"use client";

import { useRef, useState } from "react";
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const STORAGE_KEYS = ["dp_tasks", "dp_timeblocks", "dp_notes", "dp_workouts", "dp_goals"];

function exportData(): string {
  const data: Record<string, unknown> = {};
  STORAGE_KEYS.forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  });
  return JSON.stringify(data, null, 2);
}

function importData(json: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(json);
    if (typeof data !== "object" || data === null) {
      return { success: false, error: "Invalid format: expected a JSON object." };
    }
    STORAGE_KEYS.forEach((key) => {
      if (key in data) {
        localStorage.setItem(key, JSON.stringify(data[key]));
      }
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to parse JSON. Make sure the file is valid." };
  }
}

function clearAllData() {
  STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-planner-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Data exported successfully." });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importData(reader.result as string);
      if (result.success) {
        setMessage({ type: "success", text: "Data imported successfully. Refresh the page to see changes." });
      } else {
        setMessage({ type: "error", text: result.error || "Import failed." });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClear = () => {
    clearAllData();
    setShowClearConfirm(false);
    setMessage({ type: "success", text: "All data cleared. Refresh the page to see changes." });
  };

  const dataCounts = () => {
    const counts: Record<string, number> = {};
    STORAGE_KEYS.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const arr = JSON.parse(raw);
          counts[key] = Array.isArray(arr) ? arr.length : 1;
        } catch {
          counts[key] = 0;
        }
      } else {
        counts[key] = 0;
      }
    });
    return counts;
  };

  const counts = typeof window !== "undefined" ? dataCounts() : {};

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">Settings</h1>

      {/* Data overview */}
      <Card className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Your Data</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            { key: "dp_tasks", label: "Tasks" },
            { key: "dp_timeblocks", label: "Time Blocks" },
            { key: "dp_notes", label: "Notes" },
            { key: "dp_workouts", label: "Workouts" },
            { key: "dp_goals", label: "Goals" },
          ].map((item) => (
            <div key={item.key} className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{counts[item.key] || 0}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          All data is stored locally in your browser. Nothing is sent to any server.
        </p>
      </Card>

      {/* Export */}
      <Card className="mb-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Export</h2>
        <p className="mb-3 text-sm text-slate-500">Download all your data as a JSON file for backup.</p>
        <Button onClick={handleExport} size="sm" className="gap-2">
          <Download size={16} /> Export Data
        </Button>
      </Card>

      {/* Import */}
      <Card className="mb-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Import</h2>
        <p className="mb-3 text-sm text-slate-500">Restore data from a previously exported JSON file. This will merge with existing data.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()} variant="secondary" size="sm" className="gap-2">
          <Upload size={16} /> Import Data
        </Button>
      </Card>

      {/* Clear data */}
      <Card className="mb-4 border-red-500/20">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-400">Danger Zone</h2>
        <p className="mb-3 text-sm text-slate-500">Permanently delete all your data. This cannot be undone.</p>
        {showClearConfirm ? (
          <div className="flex items-center gap-3 rounded-lg bg-red-500/10 p-3">
            <AlertTriangle size={18} className="shrink-0 text-red-400" />
            <p className="flex-1 text-sm text-red-300">Are you sure? This will delete everything.</p>
            <Button variant="danger" size="sm" onClick={handleClear}>Delete All</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
          </div>
        ) : (
          <Button variant="danger" size="sm" onClick={() => setShowClearConfirm(true)} className="gap-2">
            <Trash2 size={16} /> Clear All Data
          </Button>
        )}
      </Card>

      {/* Feedback message */}
      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
