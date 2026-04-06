"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TimeBlockSlot } from "./TimeBlockSlot";
import { TimeBlockForm } from "./TimeBlockForm";
import { useTimeBlocks } from "@/hooks/useTimeBlocks";
import type { DateString } from "@/types";

interface TimeBlockGridProps {
  date: DateString;
}

export function TimeBlockGrid({ date }: TimeBlockGridProps) {
  const { getBlocksByDate, addBlock, deleteBlock } = useTimeBlocks();
  const blocks = getBlocksByDate(date);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (startTime: string, endTime: string, title: string, color: string) => {
    addBlock(date, startTime, endTime, title, color);
    setShowForm(false);
  };

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Time Blocks ({blocks.length})
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

      <div className="space-y-2">
        {blocks.map((block) => (
          <TimeBlockSlot key={block.id} block={block} onDelete={deleteBlock} />
        ))}

        {blocks.length === 0 && !showForm && (
          <p className="py-4 text-center text-sm text-slate-500">
            No time blocks yet. Click + to schedule your day.
          </p>
        )}

        {showForm && (
          <TimeBlockForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}
      </div>
    </Card>
  );
}
