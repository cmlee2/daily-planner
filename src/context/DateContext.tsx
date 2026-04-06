"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { todayString } from "@/lib/dates";
import type { DateString } from "@/types";

interface DateContextValue {
  selectedDate: DateString;
  setSelectedDate: (date: DateString) => void;
}

const DateContext = createContext<DateContextValue | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<DateString>(todayString());
  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error("useDate must be used within DateProvider");
  return ctx;
}
