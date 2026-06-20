## Why

The app needs a core habit tracking system — the foundational feature that lets users define daily habits, mark them as done (or avoided), and visualize their consistency over time. Without this, the app has no purpose. This is v1: daily habits only.

## What Changes

- Introduce the **Habit** entity: name, type (positive/negative), color, created date, archived flag
- Introduce the **HabitLog** entity: one record per habit per day, tracking success/failure
- Build the **Today view**: checklist of today's habits with streak counts
- Build the **History view**: scrollable list of all habits with monthly calendar grids (global toggle from header)
- Build the **Habit detail view**: full-screen monthly calendar for a single habit, opened by tapping its name; supports retroactive day toggling
- Persist all data locally via SQLite (Tauri plugin)
- Expose Rust commands via Tauri `invoke()` for all data operations

## Capabilities

### New Capabilities

- `habit-management`: Create, edit (name, type, color), archive, and list habits

> Remaining capabilities (`habit-logging`, `streak-calculation`, `today-view`, `history-view`, `habit-detail-view`) will be specced and implemented in subsequent iterations.

### Modified Capabilities

## Impact

- **New Tauri plugin**: `tauri-plugin-sql` (SQLite) added to `src-tauri/Cargo.toml` and `capabilities/default.json`
- **New Rust commands** in `src-tauri/src/lib.rs`: habit CRUD, log toggle, streak query
- **New frontend feature tree** under `src/features/habits/` following the clean architecture (domain / services / actions / components)
- **`src/App.tsx`**: wired up to render the Today view as default
- **Database schema**: two tables (`habits`, `habit_logs`) created on first run via migration
