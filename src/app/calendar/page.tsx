"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { toDateString, todayString } from "@/lib/dates";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { WeekStrip } from "@/components/calendar/WeekStrip";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTasks } from "@/hooks/useTasks";
import { useTimeBlocks } from "@/hooks/useTimeBlocks";
import { useNotes } from "@/hooks/useNotes";

export default function CalendarPage() {
  const router = useRouter();
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayString());

  const { tasks } = useTasks();
  const { timeBlocks } = useTimeBlocks();
  const { notes } = useNotes();

  const handleSelectDay = (date: Date) => {
    const dateStr = toDateString(date);
    setSelectedDate(dateStr);
    router.push(`/day/${dateStr}`);
  };

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Calendar</h1>
        <Button variant="secondary" size="sm" onClick={() => { setViewMonth(new Date()); setSelectedDate(todayString()); }}>
          Today
        </Button>
      </div>

      {/* Week strip */}
      <Card className="mb-4">
        <WeekStrip
          currentDate={new Date(selectedDate + "T00:00:00")}
          selectedDate={selectedDate}
          onSelect={handleSelectDay}
        />
      </Card>

      {/* Month navigation */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-slate-200">
            {format(viewMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <MonthGrid
          month={viewMonth}
          selectedDate={selectedDate}
          tasks={tasks}
          timeBlocks={timeBlocks}
          notes={notes}
          onSelectDay={handleSelectDay}
        />

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 border-t border-card-border pt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400" /> Tasks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple-400" /> Time blocks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400" /> Notes
          </span>
        </div>
      </Card>
    </div>
  );
}
