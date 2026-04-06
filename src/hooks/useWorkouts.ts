"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import type { WorkoutSession, Exercise, ExerciseSet, CardioEntry, CardioType, DateString } from "@/types";

const STORAGE_KEY = "dp_workouts";

// Ensure backward compat: old sessions may lack `cardio` field
function normalize(session: WorkoutSession): WorkoutSession {
  return { ...session, cardio: session.cardio || [] };
}

export function useWorkouts() {
  const [rawWorkouts, setWorkouts] = useLocalStorage<WorkoutSession[]>(STORAGE_KEY, []);
  const workouts = useMemo(() => rawWorkouts.map(normalize), [rawWorkouts]);

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
        cardio: [],
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
              ? { ...w, exercises: [...(w.exercises || []), exercise] }
              : w
          );
        }
        return [
          ...prev,
          { id: generateId(), date, exercises: [exercise], cardio: [] },
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

  const addCardio = useCallback(
    (date: DateString, type: CardioType, durationMinutes: number, distanceMiles?: number, calories?: number, label?: string, notes?: string) => {
      const entry: CardioEntry = {
        id: generateId(),
        type,
        label,
        durationMinutes,
        distanceMiles,
        calories,
        notes,
      };
      setWorkouts((prev) => {
        const existing = prev.find((w) => w.date === date);
        if (existing) {
          return prev.map((w) =>
            w.date === date
              ? { ...w, cardio: [...(w.cardio || []), entry] }
              : w
          );
        }
        return [
          ...prev,
          { id: generateId(), date, exercises: [], cardio: [entry] },
        ];
      });
    },
    [setWorkouts]
  );

  const deleteCardio = useCallback(
    (date: DateString, cardioId: string) => {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.date === date
            ? { ...w, cardio: (w.cardio || []).filter((c) => c.id !== cardioId) }
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
    addCardio,
    deleteCardio,
    updateSessionNotes,
  };
}
