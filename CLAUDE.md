# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm tauri dev        # start the full app (Vite + Tauri shell) — use this for dev
pnpm tauri build      # production build
pnpm dev              # Vite-only frontend (no native shell, useful for pure UI work)
pnpm build            # frontend build only (tsc + vite)
pnpm test             # run Vitest in watch mode
pnpm test:run         # run Vitest once
pnpm coverage         # run tests with coverage report
pnpm lint             # run ESLint
pnpm eslint . --fix   # auto-fix ESLint issues (import order, etc.)
```

## Architecture

Two-layer app: a React frontend (`src/`) rendered inside a Tauri 2 native shell (`src-tauri/`).

**Frontend (`src/`)** — React 19 + TypeScript + Tailwind v4. Tailwind is loaded via the `@tailwindcss/vite` plugin; there is no `tailwind.config.js`. The only CSS entry point is `src/App.css` with `@import "tailwindcss"`.

**Backend (`src-tauri/`)** — Rust. Logic lives in `src-tauri/src/lib.rs`; `main.rs` just calls `run()`. Rust commands are registered in `lib.rs` via `tauri::generate_handler![]` and called from the frontend with `@tauri-apps/api`'s `invoke()`.

**Window characteristics** — 320×480px, transparent, no decorations, not resizable, positioned top-left. This is a widget-style always-visible overlay; the UI must draw its own drag handle and visual chrome since the OS titlebar is disabled.

**Capabilities** — `src-tauri/capabilities/default.json` controls what the frontend window is allowed to do (currently `core:default` + `opener:default`). Add new Tauri plugin permissions here.

**Vite dev port is fixed at 1420** — Tauri's dev config hardcodes `devUrl: http://localhost:1420`. Do not change the port.

## Feature structure (clean architecture)

Each feature lives in `src/features/<feature-name>/` with four layers:

```
src/features/goals/
  domain/        # TypeScript interfaces/types and pure domain logic (no framework deps)
  services/      # Tauri invoke() wrappers and external data access
  actions/       # React hooks that orchestrate logic (e.g. useGetGoals, useCreateGoal)
  components/    # Visual React components for this feature
```

`src/shared/` holds cross-feature utilities, shared components, and types.

## Import order (enforced by ESLint)

Imports must follow four sections separated by blank lines:

```ts
// 1. React first, then external libraries
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// 2. Global imports via @ alias
import { Goal } from "@/features/goals/domain/Goal";

// 3. Relative imports
import { GoalCard } from "./GoalCard";

// 4. CSS / assets
import "./styles.css";
```

Run `pnpm eslint . --fix` to auto-sort imports. The `@` alias resolves to `src/`.

## Testing

Tests use Vitest + React Testing Library. Place test files next to the code they test as `*.test.ts` or `*.test.tsx`. The jsdom environment and `@testing-library/jest-dom` matchers are available globally (no imports needed).
