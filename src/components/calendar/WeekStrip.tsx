"use client";

import { format, startOfWeek, addDays, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toDateString } from "@/lib/dates";

interface WeekStripProps {
  currentDate: Date;
  selectedDate: string;
  onSelect: (date: Date) => void;
}

export function WeekStrip({ currentDate, selectedDate, onSelect }: WeekStripProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex gap-1">
      {days.map((day) => {
        const dateStr = toDateString(day);
        const today = isToday(day);
        const selected = dateStr === selectedDate;

        return (
          <button
            key={dateStr}
            onClick={() => onSelect(day)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 transition-colors",
              selected
                ? "bg-blue-500 text-white"
                : today
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-700/50"
            )}
          >
            <span className="text-[10px] font-medium uppercase">{format(day, "EEE")}</span>
            <span className="text-sm font-semibold">{format(day, "d")}</span>
          </button>
        );
      })}
    </div>
  );
}
