"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const COLORS = ["blue", "purple", "green", "orange", "pink", "cyan", "yellow", "red"];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

interface TimeBlockFormProps {
  onAdd: (startTime: string, endTime: string, title: string, color: string) => void;
  onCancel?: () => void;
  defaultStart?: string;
  defaultEnd?: string;
}

export function TimeBlockForm({ onAdd, onCancel, defaultStart = "09:00", defaultEnd = "10:00" }: TimeBlockFormProps) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);
  const [color, setColor] = useState("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;
    onAdd(startTime, endTime, title.trim(), color);
    setTitle("");
    setStartTime(defaultStart);
    setEndTime(defaultEnd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Block title..."
        autoFocus
      />
      <div className="flex gap-2">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="self-center text-slate-500">to</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-1.5">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={cn(
              "h-6 w-6 rounded-full transition-all",
              colorMap[c],
              color === c ? "ring-2 ring-white ring-offset-2 ring-offset-card" : "opacity-50 hover:opacity-80"
            )}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">Add Block</Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
