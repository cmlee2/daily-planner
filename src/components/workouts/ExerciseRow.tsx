"use client";

import { Trash2 } from "lucide-react";
import type { Exercise } from "@/types";

interface ExerciseRowProps {
  exercise: Exercise;
  onDelete: (id: string) => void;
}

export function ExerciseRow({ exercise, onDelete }: ExerciseRowProps) {
  const totalVolume = exercise.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <div className="group rounded-lg border border-card-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-200">{exercise.name}</h4>
        <button
          onClick={() => onDelete(exercise.id)}
          className="rounded p-1 text-slate-500 opacity-0 transition-opacity hover:bg-slate-700 hover:text-red-400 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase text-slate-500">
            <th className="pb-1 text-left font-medium">Set</th>
            <th className="pb-1 text-right font-medium">Weight</th>
            <th className="pb-1 text-right font-medium">Reps</th>
          </tr>
        </thead>
        <tbody>
          {exercise.sets.map((set, i) => (
            <tr key={i} className="border-t border-slate-700/50">
              <td className="py-1 text-slate-400">{i + 1}</td>
              <td className="py-1 text-right text-slate-300">
                {set.weight > 0 ? `${set.weight} ${set.unit}` : "BW"}
              </td>
              <td className="py-1 text-right text-slate-300">{set.reps}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalVolume > 0 && (
        <p className="mt-1.5 text-right text-xs text-slate-500">
          Volume: {totalVolume.toLocaleString()} {exercise.sets[0]?.unit || "lbs"}
        </p>
      )}
    </div>
  );
}
