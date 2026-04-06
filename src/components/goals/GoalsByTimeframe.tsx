"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import { useGoals } from "@/hooks/useGoals";
import type { GoalTimeframe } from "@/types";

interface GoalsByTimeframeProps {
  timeframe: GoalTimeframe;
}

export function GoalsByTimeframe({ timeframe }: GoalsByTimeframeProps) {
  const { getGoalsByTimeframe, addGoal, toggleGoal, updateProgress, deleteGoal } = useGoals();
  const goals = getGoalsByTimeframe(timeframe);
  const [showForm, setShowForm] = useState(false);

  const active = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {active.length} active{completed.length > 0 && ` · ${completed.length} completed`}
        </p>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-blue-400 hover:bg-blue-500/10"
          >
            <Plus size={16} /> Add Goal
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-4">
          <GoalForm
            defaultTimeframe={timeframe}
            onAdd={(title, tf, opts) => {
              addGoal(title, tf, opts);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="space-y-3">
        {active.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onToggle={toggleGoal}
            onUpdateProgress={updateProgress}
            onDelete={deleteGoal}
          />
        ))}

        {active.length === 0 && !showForm && (
          <p className="py-8 text-center text-sm text-slate-500">
            No {timeframe} goals yet. Add one to get started.
          </p>
        )}

        {completed.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-300">
              {completed.length} completed goal{completed.length !== 1 ? "s" : ""}
            </summary>
            <div className="mt-2 space-y-3">
              {completed.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onToggle={toggleGoal}
                  onUpdateProgress={updateProgress}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
