"use client";

import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Card } from "@/components/ui/Card";
import { useWorkouts } from "@/hooks/useWorkouts";
import { toDateString } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface WeeklyWorkoutSummaryProps {
  referenceDate: Date;
}

export function WeeklyWorkoutSummary({ referenceDate }: WeeklyWorkoutSummaryProps) {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const startStr = toDateString(weekStart);
  const endStr = toDateString(weekEnd);
  const { getSessionsInRange } = useWorkouts();
  const sessions = getSessionsInRange(startStr, endStr);

  const sessionMap = new Map(sessions.map((s) => [s.date, s]));

  const totalExercises = sessions.reduce((sum, s) => sum + s.exercises.length, 0);
  const totalSets = sessions.reduce(
    (sum, s) => sum + s.exercises.reduce((es, ex) => es + ex.sets.length, 0),
    0
  );
  const totalVolume = sessions.reduce(
    (sum, s) =>
      sum +
      s.exercises.reduce(
        (es, ex) => es + ex.sets.reduce((ss, set) => ss + set.weight * set.reps, 0),
        0
      ),
    0
  );

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Weekly Summary
      </h3>

      {/* Day activity strip */}
      <div className="mb-4 flex gap-1">
        {days.map((day) => {
          const dateStr = toDateString(day);
          const session = sessionMap.get(dateStr);
          const hasWorkout = session && session.exercises.length > 0;
          const isToday = dateStr === toDateString(new Date());

          return (
            <div key={dateStr} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium uppercase text-slate-500">
                {format(day, "EEE")}
              </span>
              <div
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-lg text-xs font-medium",
                  hasWorkout
                    ? "bg-green-500/20 text-green-400"
                    : "bg-slate-800 text-slate-600",
                  isToday && "ring-1 ring-blue-500/50"
                )}
              >
                {hasWorkout ? session.exercises.length : "—"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-slate-800 p-3 text-center">
          <p className="text-lg font-bold text-slate-200">{sessions.length}</p>
          <p className="text-xs text-slate-500">Workouts</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-3 text-center">
          <p className="text-lg font-bold text-slate-200">{totalExercises}</p>
          <p className="text-xs text-slate-500">Exercises</p>
        </div>
        <div className="rounded-lg bg-slate-800 p-3 text-center">
          <p className="text-lg font-bold text-slate-200">{totalSets}</p>
          <p className="text-xs text-slate-500">Sets</p>
        </div>
      </div>

      {totalVolume > 0 && (
        <p className="mt-3 text-center text-sm text-slate-400">
          Total volume: <span className="font-medium text-slate-300">{totalVolume.toLocaleString()}</span> lbs
        </p>
      )}

      {sessions.length === 0 && (
        <p className="mt-2 text-center text-sm text-slate-500">
          No workouts logged this week yet.
        </p>
      )}
    </Card>
  );
}
