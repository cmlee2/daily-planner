"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { fromDateString, toDateString, todayString } from "@/lib/dates";
import { WorkoutLog } from "@/components/workouts/WorkoutLog";
import { WeeklyWorkoutSummary } from "@/components/workouts/WeeklyWorkoutSummary";
import { Button } from "@/components/ui/Button";

export default function WorkoutsPage() {
  const [selectedDate, setSelectedDate] = useState(todayString());
  const dateObj = fromDateString(selectedDate);
  const isToday = selectedDate === todayString();

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(toDateString(subDays(dateObj, 1)))}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Workouts</h1>
            <p className="text-sm text-slate-500">
              {format(dateObj, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <button
            onClick={() => setSelectedDate(toDateString(addDays(dateObj, 1)))}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {!isToday && (
          <Button variant="secondary" size="sm" onClick={() => setSelectedDate(todayString())}>
            Today
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkoutLog date={selectedDate} />
        <WeeklyWorkoutSummary referenceDate={dateObj} />
      </div>
    </div>
  );
}
