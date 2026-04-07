# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build (also runs TypeScript type checking)
- `npm run lint` — ESLint
- No test framework is configured yet

## Architecture

This is a personal daily planner built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **TypeScript**. All data is stored in **browser localStorage** — there is no backend or database.

### Data flow

```
localStorage → lib/storage.ts (event-based pub/sub) → hooks/useLocalStorage.ts (useSyncExternalStore) → domain hooks (useTasks, useWorkouts, etc.) → components
```

- `lib/storage.ts` wraps localStorage with JSON serialization and dispatches a custom `dp-storage-update` event on every write. It also listens to the native `storage` event for cross-tab sync.
- `hooks/useLocalStorage.ts` subscribes to a specific storage key via `useSyncExternalStore`, making reads concurrent-safe and reactive across components.
- Each feature has a domain hook (`hooks/useTasks.ts`, `hooks/useWorkouts.ts`, etc.) that wraps `useLocalStorage` with typed CRUD operations.

### Storage keys

All prefixed with `dp_`: `dp_tasks`, `dp_timeblocks`, `dp_notes`, `dp_workouts`, `dp_goals`. Each stores a flat JSON array filtered by date at read time.

### Routing

- `/` redirects to `/day/{today}` (client-side)
- `/day/[date]` — main daily view: tasks, time blocks, notes
- `/calendar` — month grid with day summary side panel
- `/workouts` — strength exercises + cardio log + weekly summary
- `/goals` — goals by timeframe tabs (daily/weekly/monthly/yearly)
- `/settings` — data export/import/clear

### Key patterns

- **All pages and components are client components** (`"use client"`) since they depend on localStorage.
- **Dark theme only** — colors use slate/card/card-border CSS custom properties defined in `globals.css` and Tailwind's `@theme inline`.
- **One context**: `DateContext` provides the globally selected date. Everything else is hook-based.
- **Types**: All domain interfaces live in `src/types/index.ts`. Dates are `"YYYY-MM-DD"` strings (`DateString` type), times are `"HH:mm"` (`TimeString`).
- **Utilities**: `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) and `generateId()` (uuid v4). `lib/dates.ts` wraps date-fns helpers.
- **Backward compat**: The workouts hook normalizes old sessions missing the `cardio` field. Follow this pattern when adding fields to existing types.

### Component organization

- `components/ui/` — primitives (Button, Card, Input, Modal, ProgressBar)
- `components/layout/` — AppShell, Sidebar, MobileNav
- `components/{feature}/` — feature components (tasks, timeblock, notes, calendar, workouts, goals)
