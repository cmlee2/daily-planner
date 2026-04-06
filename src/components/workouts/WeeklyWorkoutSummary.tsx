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

  // Strength stats
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

  // Cardio stats
  const totalCardioSessions = sessions.reduce((sum, s) => sum + (s.cardio?.length || 0), 0);
  const totalCardioMinutes = sessions.reduce(
    (sum, s) => sum + (s.cardio || []).reduce((cs, c) => cs + c.durationMinutes, 0),
    0
  );
  const totalCardioDistance = sessions.reduce(
    (sum, s) => sum + (s.cardio || []).reduce((cs, c) => cs + (c.distanceMiles || 0), 0),
    0
  );
  const totalCardioCalories = sessions.reduce(
    (sum, s) => sum + (s.cardio || []).reduce((cs, c) => cs + (c.calories || 0), 0),
    0
  );

  const activeDays = sessions.filter(
    (s) => s.exercises.length > 0 || (s.cardio?.length || 0) > 0
  ).length;

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
          const hasStrength = session && session.exercises.length > 0;
          const hasCardio = session && (session.cardio?.length || 0) > 0;
          const hasActivity = hasStrength || hasCardio;
          const isToday = dateStr === toDateString(new Date());

          return (
            <div key={dateStr} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-medium uppercase text-slate-500">
                {format(day, "EEE")}
              </span>
              <div
                className={cn(
                  "flex h-10 w-full flex-col items-center justify-center rounded-lg text-[10px] font-medium gap-0.5",
                  hasActivity
                    ? "bg-green-500/20 text-green-400"
                    : "bg-slate-800 text-slate-600",
                  isToday && "ring-1 ring-blue-500/50"
                )}
              >
                {hasActivity ? (
                  <>
                    {hasStrength && <span>{session!.exercises.length} str</span>}
                    {hasCardio && <span>{session!.cardio.length} crd</span>}
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Strength stats */}
      {totalExercises > 0 && (
        <>
          <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">Strength</h4>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{totalExercises}</p>
              <p className="text-xs text-slate-500">Exercises</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{totalSets}</p>
              <p className="text-xs text-slate-500">Sets</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : "0"}</p>
              <p className="text-xs text-slate-500">Volume (lbs)</p>
            </div>
          </div>
        </>
      )}

      {/* Cardio stats */}
      {totalCardioSessions > 0 && (
        <>
          <h4 className="mb-2 text-xs font-semibold uppercase text-slate-500">Cardio</h4>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{totalCardioSessions}</p>
              <p className="text-xs text-slate-500">Sessions</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{totalCardioMinutes}</p>
              <p className="text-xs text-slate-500">Minutes</p>
            </div>
            <div className="rounded-lg bg-slate-800 p-3 text-center">
              <p className="text-lg font-bold text-slate-200">{totalCardioDistance > 0 ? totalCardioDistance.toFixed(1) : "0"}</p>
              <p className="text-xs text-slate-500">Miles</p>
            </div>
          </div>
          {totalCardioCalories > 0 && (
            <p className="mb-2 text-center text-sm text-slate-400">
              <span className="font-medium text-slate-300">{totalCardioCalories.toLocaleString()}</span> calories burned
            </p>
          )}
        </>
      )}

      {/* Overall */}
      <div className="border-t border-card-border pt-3 text-center text-sm text-slate-400">
        <span className="font-medium text-slate-300">{activeDays}</span> active day{activeDays !== 1 ? "s" : ""} this week
      </div>

      {activeDays === 0 && (
        <p className="mt-2 text-center text-sm text-slate-500">
          No workouts logged this week yet.
        </p>
      )}
    </Card>
  );
}
