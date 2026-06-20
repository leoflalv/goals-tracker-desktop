## Context

Starting from a blank Tauri 2 scaffold (React 19 + TypeScript + Tailwind v4 frontend, Rust backend). The app is a widget-style overlay with no OS titlebar. Window dimensions are not fixed — they will be adjusted as the UI is built to best fit the content. All data lives locally on-device. This design covers the full daily habit tracking core: data model, persistence, Rust commands, and frontend architecture.

## Goals / Non-Goals

**Goals:**
- Define the SQLite schema and Rust commands for habits and logs
- Establish the frontend feature structure under `src/features/habits/`
- Specify the three-screen navigation model (today / history / habit-detail)
- Keep all interaction within the 320×480 widget without companion windows

**Non-Goals:**
- Weekly or timed habits (deferred to v2)
- Cloud sync or multi-device support
- Push notifications or reminders
- Habit ordering / drag-to-reorder
- Onboarding or empty-state tutorial

## Decisions

### 1. SQLite over JSON file

**Decision**: Use `tauri-plugin-sql` (SQLite) for persistence.

**Rationale**: Habit logs accumulate one record per habit per day indefinitely. The calendar and streak features require date-range queries — doing these in memory over a flat JSON file becomes unwieldy quickly. SQLite handles this cleanly and is the idiomatic Tauri approach for structured local data.

**Alternatives considered**: A JSON file in the app data dir would be simpler to set up, but querying logs by date range and computing streaks would require loading the full dataset each time.

### 2. Streak calculated at query time, not stored

**Decision**: Streak is computed on-the-fly in Rust by walking backward from today through `habit_logs`.

**Rationale**: Storing streak in the `habits` table creates a derived-data consistency problem — any retroactive log toggle could silently invalidate it. Computing at query time is always correct, and for ≤100 habits with ≤365 log rows each, it's negligible cost.

**Today-is-not-yet-marked rule**: If today has no log entry (or `completed = false`), the streak counts from yesterday backward. This prevents the streak from "breaking" just because the user hasn't checked in yet today.

### 3. Database schema

Two tables:

```sql
CREATE TABLE IF NOT EXISTS habits (
  id         TEXT PRIMARY KEY,         -- UUID v4
  name       TEXT NOT NULL,
  type       TEXT NOT NULL CHECK(type IN ('positive', 'negative')),
  color      TEXT NOT NULL,            -- hex string e.g. "#6366f1"
  created_at TEXT NOT NULL,            -- ISO 8601 date
  archived   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habit_logs (
  habit_id   TEXT NOT NULL REFERENCES habits(id),
  date       TEXT NOT NULL,            -- YYYY-MM-DD
  completed  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (habit_id, date)
);
```

`habit_logs` uses `(habit_id, date)` as a composite primary key — one row per habit per day. Toggling uses `INSERT OR REPLACE`.

### 4. Rust command surface

Minimal set of `#[tauri::command]` functions:

| Command | Description |
|---|---|
| `get_habits` | Returns all non-archived habits |
| `create_habit` | Inserts a new habit |
| `update_habit` | Updates name, type, and/or color for a given habit id |
| `archive_habit` | Sets `archived = 1` for a habit |
| `toggle_log` | Inserts or updates `habit_logs` for a given habit+date |
| `get_logs_for_month` | Returns all logs for a habit in a given year-month |
| `get_streak` | Computes and returns the current streak for a habit |

### 5. Frontend architecture

Clean architecture under `src/features/habits/`:

```
src/features/habits/
  domain/
    Habit.ts          # Habit interface + HabitType enum
    HabitLog.ts       # HabitLog interface
  services/
    habitService.ts   # invoke() wrappers for all Rust commands
  actions/
    useGetHabits.ts
    useCreateHabit.ts
    useArchiveHabit.ts
    useToggleLog.ts
    useGetLogsForMonth.ts
    useGetStreak.ts
  components/
    TodayView.tsx
    HistoryView.tsx
    HabitDetailView.tsx
    HabitRow.tsx
    HabitCalendar.tsx
    AddHabitForm.tsx
```

### 6. Three-screen navigation model

Navigation state is managed in `App.tsx` with a simple discriminated union — no router needed at this widget scale:

```
type Screen =
  | { type: 'today' }
  | { type: 'history' }
  | { type: 'habit-detail'; habitId: string }
```

- Header toggle (`Today` / `History`) switches between `today` and `history`
- Tapping a habit name pushes `habit-detail` from either screen
- Back arrow in habit-detail returns to the previous screen

### 7. Positive/negative habit symmetry

`completed = 1` means **success** in both cases. The data model is identical; only the display layer differs:
- Positive: unchecked circle → filled circle, copy "Done"
- Negative: unchecked circle (red tint) → filled circle (green tint), copy "Avoided"

## Risks / Trade-offs

- **SQLite cold-start migration** → Migration SQL runs in `tauri::Builder::setup()` with `CREATE TABLE IF NOT EXISTS`, making it idempotent. No separate migration tool needed for v1.
- **Streak O(n) per habit at load** → Acceptable for ≤100 habits. If the today-view becomes slow, batch streak computation into a single query using a recursive CTE.
- **No habit ordering** → Habits appear in creation order. Users cannot reorder; deferred to v2.
- **Retroactive toggle UX** → Toggling a past day silently updates the streak counter. No confirmation dialog — simplicity over guardrails for v1.
