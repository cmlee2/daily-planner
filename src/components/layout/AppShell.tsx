"use client";

import { DateProvider } from "@/context/DateContext";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <DateProvider>
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNav />
    </DateProvider>
  );
}
