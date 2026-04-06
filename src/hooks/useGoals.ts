"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import type { Goal, GoalTimeframe, DateString } from "@/types";

const STORAGE_KEY = "dp_goals";

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEY, []);

  const getGoalsByTimeframe = useCallback(
    (timeframe: GoalTimeframe) =>
      goals
        .filter((g) => g.timeframe === timeframe)
        .sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    [goals]
  );

  const addGoal = useCallback(
    (
      title: string,
      timeframe: GoalTimeframe,
      options?: {
        description?: string;
        targetValue?: number;
        unit?: string;
        targetDate?: DateString;
      }
    ) => {
      const goal: Goal = {
        id: generateId(),
        title,
        timeframe,
        description: options?.description,
        targetValue: options?.targetValue,
        currentValue: 0,
        unit: options?.unit,
        targetDate: options?.targetDate,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGoals((prev) => [...prev, goal]);
      return goal;
    },
    [setGoals]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
        )
      );
    },
    [setGoals]
  );

  const updateProgress = useCallback(
    (id: string, currentValue: number) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== id) return g;
          const completed = g.targetValue != null && currentValue >= g.targetValue;
          return { ...g, currentValue, completed, updatedAt: new Date().toISOString() };
        })
      );
    },
    [setGoals]
  );

  const toggleGoal = useCallback(
    (id: string) => {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, completed: !g.completed, updatedAt: new Date().toISOString() } : g
        )
      );
    },
    [setGoals]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    },
    [setGoals]
  );

  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.completed).length,
    active: goals.filter((g) => !g.completed).length,
  };

  return { goals, getGoalsByTimeframe, addGoal, updateGoal, updateProgress, toggleGoal, deleteGoal, stats };
}
