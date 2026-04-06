"use client";

import { cn } from "@/lib/utils";
import { isToday, isSameDay } from "date-fns";
import type { DateString } from "@/types";

interface DayCellProps {
  date: Date;
  currentMonth: boolean;
  selectedDate: DateString;
  taskCount: number;
  hasTimeBlocks: boolean;
  hasNote: boolean;
  onClick: (date: Date) => void;
}

export function DayCell({ date, currentMonth, selectedDate, taskCount, hasTimeBlocks, hasNote, onClick }: DayCellProps) {
  const today = isToday(date);
  const selected = selectedDate === formatDate(date);

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        "flex h-14 md:h-20 flex-col items-start rounded-lg border p-1 md:p-1.5 text-left transition-colors",
        currentMonth ? "border-card-border bg-card" : "border-transparent bg-transparent opacity-40",
        today && "border-blue-500/50",
        selected && "ring-2 ring-blue-500",
        currentMonth && "hover:bg-slate-700/50"
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
          today ? "bg-blue-500 text-white" : "text-slate-300"
        )}
      >
        {date.getDate()}
      </span>

      <div className="mt-auto flex flex-wrap gap-0.5 md:gap-1">
        {taskCount > 0 && (
          <span className="hidden md:flex h-4 items-center rounded bg-blue-500/20 px-1 text-[10px] font-medium text-blue-400">
            {taskCount} task{taskCount !== 1 ? "s" : ""}
          </span>
        )}
        {taskCount > 0 && (
          <span className="md:hidden h-2 w-2 rounded-full bg-blue-400" />
        )}
        {hasTimeBlocks && (
          <span className="h-2 w-2 rounded-full bg-purple-400" />
        )}
        {hasNote && (
          <span className="h-2 w-2 rounded-full bg-green-400" />
        )}
      </div>
    </button>
  );
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
