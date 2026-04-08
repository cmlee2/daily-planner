"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import { todayString, toDateString, startOfWeek } from "@/lib/dates";
import type { Goal, GoalTimeframe, DateString } from "@/types";

const STORAGE_KEY = "dp_goals";

function getResetDateForTimeframe(timeframe: GoalTimeframe): DateString {
  const now = new Date();
  if (timeframe === "daily") return todayString();
  if (timeframe === "weekly") return toDateString(startOfWeek(now, { weekStartsOn: 1 }));
  // monthly/yearly goals don't auto-reset
  return todayString();
}

function needsReset(goal: Goal): boolean {
  if (!goal.repeating || !goal.completed) return false;
  if (goal.timeframe !== "daily" && goal.timeframe !== "weekly") return false;
  const currentPeriod = getResetDateForTimeframe(goal.timeframe);
  return !goal.lastResetDate || goal.lastResetDate < currentPeriod;
}

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEY, []);
  const hasResetRef = useRef(false);

  // Auto-reset repeating goals at the start of each new period
  useEffect(() => {
    if (hasResetRef.current) return;
    const toReset = goals.filter(needsReset);
    if (toReset.length === 0) return;
    hasResetRef.current = true;
    const resetIds = new Set(toReset.map((g) => g.id));
    setGoals((prev) =>
      prev.map((g) => {
        if (!resetIds.has(g.id)) return g;
        return {
          ...g,
          completed: false,
          currentValue: 0,
          lastResetDate: getResetDateForTimeframe(g.timeframe),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [goals, setGoals]);

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
        repeating?: boolean;
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
        repeating: options?.repeating || false,
        lastResetDate: getResetDateForTimeframe(timeframe),
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
          return {
            ...g,
            currentValue,
            completed,
            lastResetDate: completed ? getResetDateForTimeframe(g.timeframe) : g.lastResetDate,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [setGoals]
  );

  const toggleGoal = useCallback(
    (id: string) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== id) return g;
          const nowCompleted = !g.completed;
          return {
            ...g,
            completed: nowCompleted,
            lastResetDate: nowCompleted ? getResetDateForTimeframe(g.timeframe) : g.lastResetDate,
            updatedAt: new Date().toISOString(),
          };
        })
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
