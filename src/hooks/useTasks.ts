"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import type { Task, DateString, Priority } from "@/types";

const STORAGE_KEY = "dp_tasks";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const getTasksByDate = useCallback(
    (date: DateString) => tasks.filter((t) => t.date === date).sort((a, b) => a.order - b.order),
    [tasks]
  );

  const addTask = useCallback(
    (date: DateString, title: string, priority: Priority = "medium") => {
      const dateTasks = tasks.filter((t) => t.date === date);
      const newTask: Task = {
        id: generateId(),
        date,
        title,
        completed: false,
        priority,
        order: dateTasks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    },
    [tasks, setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        )
      );
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks]
  );

  return { tasks, getTasksByDate, addTask, updateTask, toggleTask, deleteTask };
}
