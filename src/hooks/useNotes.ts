"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId } from "@/lib/utils";
import type { Note, DateString } from "@/types";

const STORAGE_KEY = "dp_notes";

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);

  const getNoteByDate = useCallback(
    (date: DateString) => notes.find((n) => n.date === date) || null,
    [notes]
  );

  const saveNote = useCallback(
    (date: DateString, content: string) => {
      setNotes((prev) => {
        const existing = prev.find((n) => n.date === date);
        if (existing) {
          return prev.map((n) =>
            n.date === date ? { ...n, content, updatedAt: new Date().toISOString() } : n
          );
        }
        return [
          ...prev,
          {
            id: generateId(),
            date,
            content,
            updatedAt: new Date().toISOString(),
          },
        ];
      });
    },
    [setNotes]
  );

  return { notes, getNoteByDate, saveNote };
}
