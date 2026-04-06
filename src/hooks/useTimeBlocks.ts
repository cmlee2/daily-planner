"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import type { TimeBlock, DateString } from "@/types";

const STORAGE_KEY = "dp_timeblocks";

const COLORS = ["blue", "purple", "green", "orange", "pink", "cyan", "yellow", "red"];

export function useTimeBlocks() {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlock[]>(STORAGE_KEY, []);

  const getBlocksByDate = useCallback(
    (date: DateString) =>
      timeBlocks
        .filter((b) => b.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [timeBlocks]
  );

  const addBlock = useCallback(
    (date: DateString, startTime: string, endTime: string, title: string, color?: string) => {
      const dateBlocks = timeBlocks.filter((b) => b.date === date);
      const newBlock: TimeBlock = {
        id: generateId(),
        date,
        startTime,
        endTime,
        title,
        color: color || COLORS[dateBlocks.length % COLORS.length],
        taskIds: [],
      };
      setTimeBlocks((prev) => [...prev, newBlock]);
      return newBlock;
    },
    [timeBlocks, setTimeBlocks]
  );

  const updateBlock = useCallback(
    (id: string, updates: Partial<Omit<TimeBlock, "id">>) => {
      setTimeBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      );
    },
    [setTimeBlocks]
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
    },
    [setTimeBlocks]
  );

  return { timeBlocks, getBlocksByDate, addBlock, updateBlock, deleteBlock, COLORS };
}
