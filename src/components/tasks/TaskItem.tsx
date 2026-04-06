"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import type { Task, Priority } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: "border-l-slate-500",
  medium: "border-l-yellow-500",
  high: "border-l-red-500",
};

export function TaskItem({ task, onToggle, onUpdate, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-card-border border-l-4 bg-card px-3 py-2.5 transition-colors hover:bg-slate-700/50",
        priorityColors[task.priority],
        task.completed && "opacity-60"
      )}
    >
      <GripVertical size={16} className="shrink-0 text-slate-500 opacity-0 group-hover:opacity-100 cursor-grab" />

      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          task.completed
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-slate-500 hover:border-blue-400"
        )}
      >
        {task.completed && <Check size={12} />}
      </button>

      {editing ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex flex-1 items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="flex-1"
          />
          <button type="submit" className="rounded p-1 text-green-400 hover:bg-green-900/30">
            <Check size={16} />
          </button>
          <button type="button" onClick={() => setEditing(false)} className="rounded p-1 text-slate-400 hover:bg-slate-700">
            <X size={16} />
          </button>
        </form>
      ) : (
        <>
          <span
            className={cn("flex-1 text-sm text-slate-200", task.completed && "line-through text-slate-500")}
            onDoubleClick={() => { setEditing(true); setEditTitle(task.title); }}
          >
            {task.title}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <button onClick={() => { setEditing(true); setEditTitle(task.title); }} className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(task.id)} className="rounded p-1 text-slate-400 hover:bg-red-900/30 hover:text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
