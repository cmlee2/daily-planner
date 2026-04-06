"use client";

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from "date-fns";
import { toDateString } from "@/lib/dates";
import { DayCell } from "./DayCell";
import type { Task, TimeBlock, Note } from "@/types";

interface MonthGridProps {
  month: Date;
  selectedDate: string;
  tasks: Task[];
  timeBlocks: TimeBlock[];
  notes: Note[];
  onSelectDay: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthGrid({ month, selectedDate, tasks, timeBlocks, notes, onSelectDay }: MonthGridProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const taskCountByDate = new Map<string, number>();
  tasks.forEach((t) => {
    if (!t.completed) {
      taskCountByDate.set(t.date, (taskCountByDate.get(t.date) || 0) + 1);
    }
  });

  const blockDates = new Set(timeBlocks.map((b) => b.date));
  const noteDates = new Set(notes.filter((n) => n.content.trim()).map((n) => n.date));

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium uppercase text-slate-500">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = toDateString(day);
          return (
            <DayCell
              key={dateStr}
              date={day}
              currentMonth={isSameMonth(day, month)}
              selectedDate={selectedDate}
              taskCount={taskCountByDate.get(dateStr) || 0}
              hasTimeBlocks={blockDates.has(dateStr)}
              hasNote={noteDates.has(dateStr)}
              onClick={onSelectDay}
            />
          );
        })}
      </div>
    </div>
  );
}
