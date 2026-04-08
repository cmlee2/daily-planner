"use client";

import { useState } from "react";
import { Check, Trash2, Minus, Plus, Target, Repeat } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types";

interface GoalCardProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onUpdateProgress: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onToggle, onUpdateProgress, onDelete }: GoalCardProps) {
  const [adjustValue, setAdjustValue] = useState(1);
  const hasTarget = goal.targetValue != null && goal.targetValue > 0;
  const pct = hasTarget ? Math.min(100, Math.round((goal.currentValue / goal.targetValue!) * 100)) : 0;

  return (
    <div
      className={cn(
        "group rounded-lg border border-card-border bg-card p-4 transition-colors",
        goal.completed && "opacity-60"
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(goal.id)}
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              goal.completed
                ? "border-green-500 bg-green-500 text-white"
                : "border-slate-500 hover:border-green-400"
            )}
          >
            {goal.completed && <Check size={12} />}
          </button>
          <div>
            <p className={cn("text-sm font-medium text-slate-200", goal.completed && "line-through text-slate-500")}>
              {goal.title}
              {goal.repeating && (
                <span className="ml-1.5 inline-flex items-center text-blue-400" title="Repeating goal">
                  <Repeat size={12} />
                </span>
              )}
            </p>
            {goal.description && (
              <p className="mt-0.5 text-xs text-slate-500">{goal.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="rounded p-1 text-slate-500 opacity-0 transition-opacity hover:bg-slate-700 hover:text-red-400 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {hasTarget && !goal.completed && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {goal.currentValue} / {goal.targetValue} {goal.unit || ""}
            </span>
            <span className="font-medium text-slate-400">{pct}%</span>
          </div>
          <ProgressBar
            value={goal.currentValue}
            max={goal.targetValue!}
            color={pct >= 100 ? "bg-green-500" : pct >= 50 ? "bg-blue-500" : "bg-blue-400"}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateProgress(goal.id, Math.max(0, goal.currentValue - adjustValue))}
              className="rounded-lg border border-slate-600 p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              min={1}
              value={adjustValue}
              onChange={(e) => setAdjustValue(Math.max(1, Number(e.target.value)))}
              className="w-16 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-center text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => onUpdateProgress(goal.id, goal.currentValue + adjustValue)}
              className="rounded-lg border border-slate-600 p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            >
              <Plus size={14} />
            </button>
            {goal.unit && <span className="text-xs text-slate-500">{goal.unit}</span>}
          </div>
        </div>
      )}

      {goal.targetDate && !goal.completed && (
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Target size={10} /> Due {goal.targetDate}
        </p>
      )}
    </div>
  );
}
