"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { fromDateString, toDateString, todayString } from "@/lib/dates";
import { TaskList } from "@/components/tasks/TaskList";
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goPrev} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {format(dateObj, "EEEE, MMMM d")}
            </h1>
            <p className="text-sm text-gray-500">{format(dateObj, "yyyy")}</p>
          </div>
          <button onClick={goNext} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
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
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            Time blocks — coming in Phase 2
          </div>
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
            Notes / Journal — coming in Phase 2
          </div>
        </div>
      </div>
    </div>
  );
}
