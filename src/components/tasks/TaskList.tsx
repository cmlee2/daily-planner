"use client";

import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { Card } from "@/components/ui/Card";
import { useTasks } from "@/hooks/useTasks";
import type { DateString, Priority } from "@/types";

interface TaskListProps {
  date: DateString;
}

export function TaskList({ date }: TaskListProps) {
  const { getTasksByDate, addTask, updateTask, toggleTask, deleteTask } = useTasks();
  const tasks = getTasksByDate(date);

  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  const handleAdd = (title: string, priority: Priority) => {
    addTask(date, title, priority);
  };

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Tasks ({incomplete.length} remaining)
      </h3>

      <div className="space-y-2">
        {incomplete.length === 0 && completed.length === 0 && (
          <div className="py-6 text-center">
            <p className="text-sm text-slate-500">No tasks for this day yet.</p>
            <p className="mt-1 text-xs text-slate-600">Use the form below to add your first task.</p>
          </div>
        )}
        {incomplete.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ))}

        {completed.length > 0 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-300">
              {completed.length} completed
            </summary>
            <div className="mt-2 space-y-2">
              {completed.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </details>
        )}
      </div>

      <div className="mt-4">
        <TaskForm onAdd={handleAdd} />
      </div>
    </Card>
  );
}
