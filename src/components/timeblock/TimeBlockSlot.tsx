"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimeBlock } from "@/types";

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue:   { bg: "bg-blue-500/20",   border: "border-blue-500/40",   text: "text-blue-300" },
  purple: { bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-300" },
  green:  { bg: "bg-green-500/20",  border: "border-green-500/40",  text: "text-green-300" },
  orange: { bg: "bg-orange-500/20", border: "border-orange-500/40", text: "text-orange-300" },
  pink:   { bg: "bg-pink-500/20",   border: "border-pink-500/40",   text: "text-pink-300" },
  cyan:   { bg: "bg-cyan-500/20",   border: "border-cyan-500/40",   text: "text-cyan-300" },
  yellow: { bg: "bg-yellow-500/20", border: "border-yellow-500/40", text: "text-yellow-300" },
  red:    { bg: "bg-red-500/20",    border: "border-red-500/40",    text: "text-red-300" },
};

interface TimeBlockSlotProps {
  block: TimeBlock;
  onDelete: (id: string) => void;
}

export function TimeBlockSlot({ block, onDelete }: TimeBlockSlotProps) {
  const colors = colorMap[block.color] || colorMap.blue;

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div
      className={cn(
        "group flex items-start justify-between rounded-lg border-l-4 px-3 py-2.5",
        colors.bg,
        colors.border
      )}
    >
      <div>
        <p className={cn("text-sm font-medium", colors.text)}>{block.title}</p>
        <p className="text-xs text-slate-500">
          {formatTime(block.startTime)} — {formatTime(block.endTime)}
        </p>
      </div>
      <button
        onClick={() => onDelete(block.id)}
        className="rounded p-1 text-slate-500 opacity-0 transition-opacity hover:bg-slate-700 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
