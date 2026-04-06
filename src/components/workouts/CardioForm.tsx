"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CardioType } from "@/types";

const CARDIO_TYPES: { value: CardioType; label: string }[] = [
  { value: "run", label: "Run" },
  { value: "bike", label: "Bike" },
  { value: "swim", label: "Swim" },
  { value: "row", label: "Row" },
  { value: "elliptical", label: "Elliptical" },
  { value: "walk", label: "Walk" },
  { value: "hike", label: "Hike" },
  { value: "other", label: "Other" },
];

interface CardioFormProps {
  onAdd: (type: CardioType, durationMinutes: number, distanceMiles?: number, calories?: number, label?: string, notes?: string) => void;
  onCancel?: () => void;
}

export function CardioForm({ onAdd, onCancel }: CardioFormProps) {
  const [type, setType] = useState<CardioType>("run");
  const [label, setLabel] = useState("");
  const [duration, setDuration] = useState(30);
  const [distance, setDistance] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) return;
    onAdd(
      type,
      duration,
      distance ? Number(distance) : undefined,
      calories ? Number(calories) : undefined,
      label.trim() || undefined,
      notes.trim() || undefined
    );
    setType("run");
    setLabel("");
    setDuration(30);
    setDistance("");
    setCalories("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-card-border bg-slate-800/50 p-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CardioType)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            {CARDIO_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Label (optional)</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Morning jog"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Duration (min)</label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Distance (mi)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="—"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Calories</label>
          <input
            type="number"
            min={0}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="—"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Notes (optional)</label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel?"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">Add Cardio</Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
