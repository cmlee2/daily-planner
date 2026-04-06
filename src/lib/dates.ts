import { format, parse, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, startOfMonth, endOfMonth, isToday, isSameDay } from "date-fns";

export const DATE_FORMAT = "yyyy-MM-dd";

export function toDateString(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function fromDateString(dateStr: string): Date {
  return parse(dateStr, DATE_FORMAT, new Date());
}

export function todayString(): string {
  return toDateString(new Date());
}

export { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, startOfMonth, endOfMonth, isToday, isSameDay };
