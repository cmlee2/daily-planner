"use client";

import { useState } from "react";
import { Plus, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ExerciseRow } from "./ExerciseRow";
import { ExerciseForm } from "./ExerciseForm";
import { useWorkouts } from "@/hooks/useWorkouts";
import type { DateString, ExerciseSet } from "@/types";

interface WorkoutLogProps {
  date: DateString;
}

export function WorkoutLog({ date }: WorkoutLogProps) {
  const { getSessionByDate, addExercise, deleteExercise } = useWorkouts();
  const session = getSessionByDate(date);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (name: string, sets: ExerciseSet[]) => {
    addExercise(date, name, sets);
    setShowForm(false);
  };

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Dumbbell size={14} />
          Today&apos;s Workout
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {session?.exercises.map((ex) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            onDelete={(id) => deleteExercise(date, id)}
          />
        ))}

        {(!session || session.exercises.length === 0) && !showForm && (
          <p className="py-6 text-center text-sm text-slate-500">
            No exercises logged yet. Click + to start your workout.
          </p>
        )}

        {showForm && (
          <ExerciseForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}
      </div>

      {session && session.exercises.length > 0 && (
        <div className="mt-4 border-t border-card-border pt-3 text-sm text-slate-400">
          <span className="font-medium text-slate-300">{session.exercises.length}</span> exercise{session.exercises.length !== 1 ? "s" : ""}
          {" · "}
          <span className="font-medium text-slate-300">
            {session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)}
          </span> total sets
        </div>
      )}
    </Card>
  );
}
