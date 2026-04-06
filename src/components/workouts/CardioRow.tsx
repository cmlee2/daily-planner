"use client";

import { Trash2 } from "lucide-react";
import type { CardioEntry } from "@/types";

const typeIcons: Record<string, string> = {
  run: "🏃",
  bike: "🚴",
  swim: "🏊",
  row: "🚣",
  elliptical: "🏋️",
  walk: "🚶",
  hike: "🥾",
  other: "💪",
};

const typeLabels: Record<string, string> = {
  run: "Run",
  bike: "Bike",
  swim: "Swim",
  row: "Row",
  elliptical: "Elliptical",
  walk: "Walk",
  hike: "Hike",
  other: "Cardio",
};

interface CardioRowProps {
  entry: CardioEntry;
  onDelete: (id: string) => void;
}

export function CardioRow({ entry, onDelete }: CardioRowProps) {
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const pace = entry.distanceMiles && entry.durationMinutes
    ? (entry.durationMinutes / entry.distanceMiles).toFixed(1)
    : null;

  return (
    <div className="group flex items-start justify-between rounded-lg border border-card-border bg-card p-3">
      <div className="flex gap-3">
        <span className="text-xl">{typeIcons[entry.type] || "💪"}</span>
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {entry.label || typeLabels[entry.type] || "Cardio"}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400">
            <span>{formatDuration(entry.durationMinutes)}</span>
            {entry.distanceMiles != null && (
              <span>{entry.distanceMiles} mi</span>
            )}
            {pace && <span>{pace} min/mi</span>}
            {entry.calories != null && (
              <span>{entry.calories} cal</span>
            )}
          </div>
          {entry.notes && (
            <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        className="rounded p-1 text-slate-500 opacity-0 transition-opacity hover:bg-slate-700 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
