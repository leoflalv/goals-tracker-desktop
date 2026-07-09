## 1. Rust: schema migration

- [x] 1.1 Replace `migrations.rs`'s goals migration with a new migration creating `habits` (id, name, color, sort_order, created_at, deleted_at) and `habit_completions` (id, habit_id, completed_on, unique on habit_id+completed_on, FK to habits)
- [x] 1.2 Update `lib.rs`'s SQL plugin registration to use the new migrations and habits database file

## 2. Rust: habit + completion commands

- [x] 2.1 Implement `create_habit(name, color)` returning the created habit
- [x] 2.2 Implement `get_habits()` returning active (non-deleted) habits ordered by `sort_order`
- [x] 2.3 Implement `update_habit(id, name?, color?)` returning the updated habit, erroring on unknown id
- [x] 2.4 Implement `delete_habit(id)` as a soft delete (sets `deleted_at`)
- [x] 2.5 Implement `toggle_habit_completion(habit_id, date)` inserting/deleting the completion row and returning `{ completed }`
- [x] 2.6 Implement `get_completions(from, to)` returning completion rows in the inclusive date range
- [x] 2.7 Emit a `habits:changed` event after every mutating command (create/update/delete habit, toggle completion)
- [x] 2.8 Register all six commands in `lib.rs`'s `generate_handler!`; remove the old goal handlers
- [x] 2.9 Update `capabilities/default.json` if new permissions are needed
- [x] 2.10 Write Rust integration tests for all six commands (success + documented failure paths)

## 3. Frontend: habit domain layer

- [x] 3.1 Delete `src/features/goals/` (domain/services/actions/components)
- [x] 3.2 Add `src/features/habits/domain/Habit.ts` and `HabitCompletion.ts` domain types
- [x] 3.3 Add pure derivation functions in `src/features/habits/domain/`: streak calculation, last-7-days week-dot mapping, daily progress fraction
- [x] 3.4 Write `*.test.ts` unit tests for the derivation functions covering every `habit-actions` spec scenario: streak counts consecutive days ending today, week dots reflect the last 7 days, daily progress reflects today's completions

## 4. Frontend: habit service layer

- [x] 4.1 Add `Result`/`tryCatch` utility (or move existing one) under the new feature
- [x] 4.2 Add `HabitDto`/`HabitCompletionDto` Zod schemas and `toHabit()`/`toHabitCompletion()` mappers in `src/features/habits/services/`
- [x] 4.3 Implement `getHabits`, `createHabit`, `updateHabit`, `deleteHabit`, `toggleHabitCompletion`, `getCompletions` service functions wrapping `invoke()` calls
- [x] 4.4 Write `*.test.ts` unit tests for the DTO schemas/mappers (valid payload maps correctly, invalid payload fails validation) and for each service function (invokes the right command with the right args, returns mapped domain types)

## 5. Frontend: habit actions (hooks)

- [x] 5.1 Add `useGetHabits` and `useGetCompletions(from, to)` query hooks
- [x] 5.2 Add `useCreateHabit`, `useUpdateHabit`, `useDeleteHabit`, `useToggleHabitCompletion` mutation hooks with query invalidation
- [x] 5.3 Add a `habits:changed` event listener hook that invalidates habit/completion queries, used by both windows
- [x] 5.4 Write `*.test.ts` unit tests for each hook: successful fetch/mutation state, error state, and that mutations invalidate the expected query keys

## 6. Main widget rework

- [x] 6.1 Rebuild the habit row component: color checkbox, name, week dots, flame + streak count
- [x] 6.2 Rebuild the list component using `useGetHabits` + `useGetCompletions`: loading spinner, empty state, dynamic height capped at 10 rows with scroll beyond that
- [x] 6.3 Add the daily progress bar (completed/total for today)
- [x] 6.4 Rework the header: drag handle, current date, gear icon
- [x] 6.5 Wire the gear icon to open (or focus) the Manage Window
- [x] 6.6 Wire toggle-completion errors to the toast system
- [x] 6.7 Update `App.tsx` to mount the reworked widget
- [x] 6.8 Write `*.test.tsx` component tests covering every `main-widget-view` spec scenario: habits display with week dots/streak, loading state, empty state, mark done/undone, progress bar reflects completions, gear icon opens Manage Window, drag handle triggers `startDragging()`, dynamic height/scroll past 10 habits, toggle error surfaces via toast

## 7. Manage Window shell

- [x] 7.1 Add a second window definition in `tauri.conf.json` for the Manage Window (titlebar, closeable, not desktop-level)
- [x] 7.2 Add the Rust-side command/logic to open or focus the Manage Window from the gear icon click
- [x] 7.3 Add a window-label-based split in the frontend entry point so the Manage Window renders its own root component instead of the widget
- [x] 7.4 Build the tab navigation shell (My Habits default, History) inside the Manage Window root
- [x] 7.5 Write Rust tests for the open-or-focus-existing-window command logic
- [x] 7.6 Write `*.test.tsx` component tests for the tab shell: My Habits selected by default, switching to History shows its content and hides My Habits

## 8. My Habits tab

- [x] 8.1 Build the habit list (color swatch, name, edit button, delete button) with empty state
- [x] 8.2 Build the create/edit form (name + color picker), wired to `useCreateHabit`/`useUpdateHabit`
- [x] 8.3 Wire delete button to `useDeleteHabit` with a confirmation step
- [x] 8.4 Wire create/update/delete errors to the toast system
- [x] 8.5 Write `*.test.tsx` component tests covering every `my-habits-view` spec scenario: list + empty state, create (success + empty-name prevented), edit, delete (removes from list, history preserved), create/update/delete errors surface via toast

## 9. History tab

- [x] 9.0 Add `get_all_habits` Rust command + `getAllHabits`/`useGetAllHabits` frontend wrappers (not in the original plan — discovered during this group that `get_habits` excludes soft-deleted habits, but History needs their name/color for filter chips and the month view; see `design.md`)
- [x] 9.1 Build the month-grid component driven by `useGetCompletions` for the visible month's range
- [x] 9.2 Add previous/next month navigation, disabling "next" at the current month
- [x] 9.3 Add per-habit filter chips (including habits with `deleted_at` set but existing completions)
- [x] 9.4 Add loading state for the month grid while completions are being fetched
- [x] 9.5 Write `*.test.tsx` component tests covering every `history-view` spec scenario: month renders completions, loading state, prev/next month navigation and "next" disabled at current month, filter by habit and clearing filters, deleted habits still shown with their history

## 10. Cleanup and verification

- [ ] 10.1 Remove any leftover references to the old Goal model across the codebase (imports, tests, docs)
- [ ] 10.2 Run `pnpm test:run` and `pnpm coverage`; ensure every new capability (`habit-database`, `habit-service`, `habit-actions`, `main-widget-view`, `manage-window`, `my-habits-view`, `history-view`) has passing test coverage for each spec scenario, then run `pnpm lint` and fix failures
- [ ] 10.3 Manually verify in `pnpm tauri dev`: mark habits done/undone, create/edit/delete a habit, confirm both windows stay in sync, and browse History across months
