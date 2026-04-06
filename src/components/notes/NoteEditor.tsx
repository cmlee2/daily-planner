"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useNotes } from "@/hooks/useNotes";
import type { DateString } from "@/types";

interface NoteEditorProps {
  date: DateString;
}

export function NoteEditor({ date }: NoteEditorProps) {
  const { getNoteByDate, saveNote } = useNotes();
  const note = getNoteByDate(date);
  const [content, setContent] = useState(note?.content || "");
  const [saved, setSaved] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync content when date changes
  useEffect(() => {
    setContent(note?.content || "");
    setSaved(true);
  }, [date, note?.content]);

  const doSave = useCallback(
    (text: string) => {
      saveNote(date, text);
      setSaved(true);
    },
    [date, saveNote]
  );

  const handleChange = (value: string) => {
    setContent(value);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSave(value), 1000);
  };

  const handleBlur = () => {
    if (!saved) {
      if (timerRef.current) clearTimeout(timerRef.current);
      doSave(content);
    }
  };

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Journal / Notes
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          {saved ? (
            <span className="flex items-center gap-1 text-green-400">
              <Save size={12} /> Saved
            </span>
          ) : (
            <span>Unsaved...</span>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write your thoughts, reflections, or notes for the day..."
        className="min-h-[200px] w-full resize-y rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </Card>
  );
}
