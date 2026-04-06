"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { GoalTimeframe } from "@/types";

interface GoalFormProps {
  defaultTimeframe: GoalTimeframe;
  onAdd: (
    title: string,
    timeframe: GoalTimeframe,
    options?: { description?: string; targetValue?: number; unit?: string; targetDate?: string }
  ) => void;
  onCancel?: () => void;
}

export function GoalForm({ defaultTimeframe, onAdd, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeframe, setTimeframe] = useState<GoalTimeframe>(defaultTimeframe);
  const [hasTarget, setHasTarget] = useState(false);
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), timeframe, {
      description: description.trim() || undefined,
      targetValue: hasTarget && targetValue ? Number(targetValue) : undefined,
      unit: hasTarget && unit.trim() ? unit.trim() : undefined,
      targetDate: targetDate || undefined,
    });
    setTitle("");
    setDescription("");
    setTargetValue("");
    setUnit("");
    setTargetDate("");
    setHasTarget(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-card-border bg-slate-800/50 p-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title (e.g. Run 20 miles this week)"
        autoFocus
      />

      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as GoalTimeframe)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Target date (optional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={hasTarget}
            onChange={(e) => setHasTarget(e.target.checked)}
            className="rounded border-slate-600"
          />
          Track with a numeric target
        </label>
      </div>

      {hasTarget && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Target value</label>
            <input
              type="number"
              min={1}
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Unit</label>
            <Input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. miles, books, hours"
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">Add Goal</Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}
