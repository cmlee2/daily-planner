"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { GoalsByTimeframe } from "@/components/goals/GoalsByTimeframe";
import { useGoals } from "@/hooks/useGoals";
import { cn } from "@/lib/utils";
import type { GoalTimeframe } from "@/types";

const TABS: { value: GoalTimeframe; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<GoalTimeframe>("daily");
  const { stats } = useGoals();

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Goals</h1>
          <p className="text-sm text-slate-500">
            {stats.active} active · {stats.completed} completed
          </p>
        </div>
      </div>

      {/* Timeframe tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-card p-1 border border-card-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals for active tab */}
      <Card>
        <GoalsByTimeframe timeframe={activeTab} />
      </Card>
    </div>
  );
}
