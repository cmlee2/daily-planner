// ---- Primitives ----
export type DateString = string; // "YYYY-MM-DD"
export type TimeString = string; // "HH:mm" 24-hour
export type ID = string; // uuid v4

export type Priority = "low" | "medium" | "high";
export type GoalTimeframe = "daily" | "weekly" | "monthly" | "yearly";

// ---- Tasks ----
export interface Task {
  id: ID;
  date: DateString;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  order: number;
  timeBlockId?: ID;
  createdAt: string;
  updatedAt: string;
}

// ---- Time Blocks ----
export interface TimeBlock {
  id: ID;
  date: DateString;
  startTime: TimeString;
  endTime: TimeString;
  title: string;
  color: string;
  taskIds: ID[];
}

// ---- Notes / Journal ----
export interface Note {
  id: ID;
  date: DateString;
  content: string;
  updatedAt: string;
}

// ---- Workouts ----
export interface ExerciseSet {
  reps: number;
  weight: number;
  unit: "lbs" | "kg";
}

export interface Exercise {
  id: ID;
  name: string;
  sets: ExerciseSet[];
}

export type CardioType = "run" | "bike" | "swim" | "row" | "elliptical" | "walk" | "hike" | "other";

export interface CardioEntry {
  id: ID;
  type: CardioType;
  label?: string;
  durationMinutes: number;
  distanceMiles?: number;
  calories?: number;
  notes?: string;
}

export interface WorkoutSession {
  id: ID;
  date: DateString;
  exercises: Exercise[];
  cardio: CardioEntry[];
  durationMinutes?: number;
  notes?: string;
}

// ---- Goals ----
export interface Goal {
  id: ID;
  title: string;
  description?: string;
  timeframe: GoalTimeframe;
  targetDate?: DateString;
  targetValue?: number;
  currentValue: number;
  unit?: string;
  completed: boolean;
  repeating?: boolean;
  lastResetDate?: DateString;
  createdAt: string;
  updatedAt: string;
}
