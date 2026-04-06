"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ExerciseSet } from "@/types";

interface ExerciseFormProps {
  onAdd: (name: string, sets: ExerciseSet[]) => void;
  onCancel?: () => void;
}

export function ExerciseForm({ onAdd, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState<ExerciseSet[]>([{ reps: 10, weight: 0, unit: "lbs" }]);

  const addSet = () => {
    const last = sets[sets.length - 1];
    setSets([...sets, { reps: last?.reps || 10, weight: last?.weight || 0, unit: last?.unit || "lbs" }]);
  };

  const removeSet = (index: number) => {
    if (sets.length <= 1) return;
    setSets(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, field: keyof ExerciseSet, value: string | number) => {
    setSets(sets.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), sets);
    setName("");
    setSets([{ reps: 10, weight: 0, unit: "lbs" }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-card-border bg-slate-800/50 p-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Exercise name (e.g. Bench Press)"
        autoFocus
      />

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 text-xs font-medium uppercase text-slate-500">
          <span>Weight</span>
          <span>Reps</span>
          <span>Unit</span>
          <span></span>
        </div>

        {sets.map((set, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2">
            <input
              type="number"
              min={0}
              value={set.weight}
              onChange={(e) => updateSet(i, "weight", Number(e.target.value))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              min={1}
              value={set.reps}
              onChange={(e) => updateSet(i, "reps", Number(e.target.value))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <select
              value={set.unit}
              onChange={(e) => updateSet(i, "unit", e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-800 px-1.5 py-1.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
            <button
              type="button"
              onClick={() => removeSet(i)}
              className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-red-400 disabled:opacity-30"
              disabled={sets.length <= 1}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSet}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          <Plus size={12} /> Add set
        </button>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">Add Exercise</Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
