"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import type { WorkoutSession, Exercise, ExerciseSet, DateString } from "@/types";

const STORAGE_KEY = "dp_workouts";

export function useWorkouts() {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutSession[]>(STORAGE_KEY, []);

  const getSessionByDate = useCallback(
    (date: DateString) => workouts.find((w) => w.date === date) || null,
    [workouts]
  );

  const getSessionsInRange = useCallback(
    (startDate: DateString, endDate: DateString) =>
      workouts
        .filter((w) => w.date >= startDate && w.date <= endDate)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [workouts]
  );

  const ensureSession = useCallback(
    (date: DateString): WorkoutSession => {
      const existing = workouts.find((w) => w.date === date);
      if (existing) return existing;
      const session: WorkoutSession = {
        id: generateId(),
        date,
        exercises: [],
      };
      setWorkouts((prev) => [...prev, session]);
      return session;
    },
    [workouts, setWorkouts]
  );

  const addExercise = useCallback(
    (date: DateString, name: string, sets: ExerciseSet[]) => {
      setWorkouts((prev) => {
        const existing = prev.find((w) => w.date === date);
        const exercise: Exercise = { id: generateId(), name, sets };
        if (existing) {
          return prev.map((w) =>
            w.date === date
              ? { ...w, exercises: [...w.exercises, exercise] }
              : w
          );
        }
        return [
          ...prev,
          { id: generateId(), date, exercises: [exercise] },
        ];
      });
    },
    [setWorkouts]
  );

  const updateExercise = useCallback(
    (date: DateString, exerciseId: string, updates: Partial<Omit<Exercise, "id">>) => {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.date === date
            ? {
                ...w,
                exercises: w.exercises.map((ex) =>
                  ex.id === exerciseId ? { ...ex, ...updates } : ex
                ),
              }
            : w
        )
      );
    },
    [setWorkouts]
  );

  const deleteExercise = useCallback(
    (date: DateString, exerciseId: string) => {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.date === date
            ? { ...w, exercises: w.exercises.filter((ex) => ex.id !== exerciseId) }
            : w
        )
      );
    },
    [setWorkouts]
  );

  const updateSessionNotes = useCallback(
    (date: DateString, notes: string) => {
      setWorkouts((prev) =>
        prev.map((w) => (w.date === date ? { ...w, notes } : w))
      );
    },
    [setWorkouts]
  );

  return {
    workouts,
    getSessionByDate,
    getSessionsInRange,
    ensureSession,
    addExercise,
    updateExercise,
    deleteExercise,
    updateSessionNotes,
  };
}
