import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-xl border border-card-border bg-card p-4 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}
