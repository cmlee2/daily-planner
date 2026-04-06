"use client";

import { useState } from "react";
import { Plus, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardioRow } from "./CardioRow";
import { CardioForm } from "./CardioForm";
import { useWorkouts } from "@/hooks/useWorkouts";
import type { DateString, CardioType } from "@/types";

interface CardioLogProps {
  date: DateString;
}

export function CardioLog({ date }: CardioLogProps) {
  const { getSessionByDate, addCardio, deleteCardio } = useWorkouts();
  const session = getSessionByDate(date);
  const cardioEntries = session?.cardio || [];
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (type: CardioType, durationMinutes: number, distanceMiles?: number, calories?: number, label?: string, notes?: string) => {
    addCardio(date, type, durationMinutes, distanceMiles, calories, label, notes);
    setShowForm(false);
  };

  const totalMinutes = cardioEntries.reduce((sum, c) => sum + c.durationMinutes, 0);
  const totalDistance = cardioEntries.reduce((sum, c) => sum + (c.distanceMiles || 0), 0);
  const totalCalories = cardioEntries.reduce((sum, c) => sum + (c.calories || 0), 0);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Heart size={14} />
          Cardio
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
        {cardioEntries.map((entry) => (
          <CardioRow
            key={entry.id}
            entry={entry}
            onDelete={(id) => deleteCardio(date, id)}
          />
        ))}

        {cardioEntries.length === 0 && !showForm && (
          <p className="py-6 text-center text-sm text-slate-500">
            No cardio logged yet. Click + to add a session.
          </p>
        )}

        {showForm && (
          <CardioForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}
      </div>

      {cardioEntries.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-card-border pt-3 text-sm text-slate-400">
          <span><span className="font-medium text-slate-300">{totalMinutes}</span> min</span>
          {totalDistance > 0 && <span><span className="font-medium text-slate-300">{totalDistance.toFixed(1)}</span> mi</span>}
          {totalCalories > 0 && <span><span className="font-medium text-slate-300">{totalCalories}</span> cal</span>}
        </div>
      )}
    </Card>
  );
}
