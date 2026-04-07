"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { fromDateString, toDateString, todayString } from "@/lib/dates";
import { TaskList } from "@/components/tasks/TaskList";
import { TimeBlockGrid } from "@/components/timeblock/TimeBlockGrid";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { Button } from "@/components/ui/Button";
import type { DateString } from "@/types";

export default function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const router = useRouter();
  const dateObj = fromDateString(date);
  const isToday = date === todayString();

  const goTo = (d: DateString) => router.push(`/day/${d}`);
  const goPrev = () => goTo(toDateString(subDays(dateObj, 1)));
  const goNext = () => goTo(toDateString(addDays(dateObj, 1)));

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button onClick={goPrev} className="shrink-0 rounded-lg p-1.5 md:p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200">
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg md:text-2xl font-bold text-slate-100">
              <span className="md:hidden">{format(dateObj, "EEE, MMM d")}</span>
              <span className="hidden md:inline">{format(dateObj, "EEEE, MMMM d")}</span>
            </h1>
            <p className="text-sm text-slate-500">{format(dateObj, "yyyy")}</p>
          </div>
          <button onClick={goNext} className="shrink-0 rounded-lg p-1.5 md:p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200">
            <ChevronRight size={20} />
          </button>
        </div>
        {!isToday && (
          <Button variant="secondary" size="sm" onClick={() => goTo(todayString())}>
            Today
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskList date={date} />

        <div className="space-y-6">
          <TimeBlockGrid date={date} />
          <NoteEditor date={date} />
        </div>
      </div>
    </div>
  );
}
