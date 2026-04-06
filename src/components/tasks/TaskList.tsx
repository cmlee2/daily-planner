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
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Tasks ({incomplete.length} remaining)
      </h3>

      <div className="space-y-2">
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
            <summary className="cursor-pointer text-xs font-medium text-gray-400 hover:text-gray-600">
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
