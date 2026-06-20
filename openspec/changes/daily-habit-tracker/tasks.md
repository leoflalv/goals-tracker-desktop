## 1. Rust Backend — Database & Habit Commands

- [x] 1.1 Add `tauri-plugin-sql` with SQLite feature to `src-tauri/Cargo.toml`
- [ ] 1.2 Register `tauri-plugin-sql` in `src-tauri/src/lib.rs` builder setup
- [ ] 1.3 Add `core:sql:default` permission to `src-tauri/capabilities/default.json`
- [ ] 1.4 Write `CREATE TABLE IF NOT EXISTS` migration for `habits` table; run in `setup()` hook
- [ ] 1.5 Implement `get_habits` command — returns all non-archived habits ordered by `created_at`
- [ ] 1.6 Implement `create_habit` command — accepts name, type, color; generates UUID; inserts into `habits`
- [ ] 1.7 Implement `update_habit` command — accepts habit id plus name, type, color; updates the record
- [ ] 1.8 Implement `archive_habit` command — sets `archived = 1` for a given habit id
- [ ] 1.9 Register all commands in `tauri::generate_handler![]`

## 2. Domain Types & Service Layer (Frontend)

- [ ] 2.1 Create `src/features/habits/domain/Habit.ts` — `Habit` interface and `HabitType` enum (`positive` | `negative`)
- [ ] 2.2 Create `src/features/habits/services/habitService.ts` — `invoke()` wrappers for `get_habits`, `create_habit`, `update_habit`, `archive_habit`

## 3. React Action Hooks

- [ ] 3.1 Create `useGetHabits` — fetches and caches the active habit list
- [ ] 3.2 Create `useCreateHabit` — calls `create_habit`, invalidates habit list
- [ ] 3.3 Create `useUpdateHabit` — calls `update_habit`, invalidates habit list
- [ ] 3.4 Create `useArchiveHabit` — calls `archive_habit`, invalidates habit list

## 4. UI Components

- [ ] 4.1 Create `AddHabitForm` component — inline form with name input, type selector (positive/negative), and color picker; submits via `useCreateHabit`
- [ ] 4.2 Create `EditHabitForm` component — same fields as `AddHabitForm` but pre-populated with existing habit data; submits via `useUpdateHabit`
- [ ] 4.3 Create a basic `HabitList` component — renders active habits with name, type indicator, color swatch, edit button, and archive button; wires edit to `EditHabitForm` and archive to `useArchiveHabit`
- [ ] 4.4 Wire `App.tsx` to render `HabitList` and a "+" button that shows `AddHabitForm`

## 5. Verification

- [ ] 5.1 Manually verify: create a positive habit and a negative habit; both appear in the list
- [ ] 5.2 Manually verify: edit a habit's name, type, and color; changes reflect in the list
- [ ] 5.3 Manually verify: archive a habit; it disappears from the list but its DB row remains
- [ ] 5.4 Manually verify: habit name cannot be empty (form rejects submission)
- [ ] 5.5 Run `pnpm lint` and `pnpm test:run`; fix any issues
