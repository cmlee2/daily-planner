"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight, Clock, FileText, CheckCircle2 } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { toDateString, todayString, fromDateString } from "@/lib/dates";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTasks } from "@/hooks/useTasks";
import { useTimeBlocks } from "@/hooks/useTimeBlocks";
import { useNotes } from "@/hooks/useNotes";

export default function CalendarPage() {
  const router = useRouter();
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayString());

  const { tasks, getTasksByDate } = useTasks();
  const { timeBlocks, getBlocksByDate } = useTimeBlocks();
  const { notes, getNoteByDate } = useNotes();

  const handleSelectDay = (date: Date) => {
    setSelectedDate(toDateString(date));
  };

  // Data for the selected day
  const dayTasks = getTasksByDate(selectedDate);
  const dayBlocks = getBlocksByDate(selectedDate);
  const dayNote = getNoteByDate(selectedDate);
  const incompleteTasks = dayTasks.filter((t) => !t.completed);
  const completedTasks = dayTasks.filter((t) => t.completed);
  const selectedDateObj = fromDateString(selectedDate);

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Calendar</h1>
        <Button variant="secondary" size="sm" onClick={() => { setViewMonth(new Date()); setSelectedDate(todayString()); }}>
          Today
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]" style={{ gridAutoFlow: "dense" }}>
        {/* Month grid */}
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

        {/* Day summary panel */}
        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {format(selectedDateObj, "EEEE")}
                </h3>
                <p className="text-sm text-slate-500">
                  {format(selectedDateObj, "MMMM d, yyyy")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/day/${selectedDate}`)}
                className="gap-1"
              >
                Open <ArrowRight size={14} />
              </Button>
            </div>

            {/* Tasks summary */}
            <div className="mb-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <CheckCircle2 size={12} /> Tasks
              </h4>
              {dayTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks</p>
              ) : (
                <div className="space-y-1">
                  {incompleteTasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      <span className="truncate text-slate-300">{t.title}</span>
                    </div>
                  ))}
                  {completedTasks.length > 0 && (
                    <p className="text-xs text-slate-500">{completedTasks.length} completed</p>
                  )}
                </div>
              )}
            </div>

            {/* Time blocks summary */}
            <div className="mb-4">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Clock size={12} /> Time Blocks
              </h4>
              {dayBlocks.length === 0 ? (
                <p className="text-sm text-slate-500">No time blocks</p>
              ) : (
                <div className="space-y-1">
                  {dayBlocks.map((b) => (
                    <div key={b.id} className="flex items-center gap-2 text-sm">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-${b.color}-400`} />
                      <span className="truncate text-slate-300">{b.title}</span>
                      <span className="ml-auto shrink-0 text-xs text-slate-500">
                        {formatTime(b.startTime)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes preview */}
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <FileText size={12} /> Notes
              </h4>
              {dayNote?.content.trim() ? (
                <p className="line-clamp-4 text-sm text-slate-400">
                  {dayNote.content}
                </p>
              ) : (
                <p className="text-sm text-slate-500">No notes</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
