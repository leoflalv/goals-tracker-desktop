## Why

The app currently implements a simple todo-style Goal (title/description/completed) with a single view. PRODUCT.md defines a richer daily-habit-tracking product — colored habits, streaks, week dots, a daily progress bar, and a secondary Manage Window (My Habits + History tabs) — none of which exist yet. This change builds "the rest of the views" called for in PRODUCT.md, which requires replacing the Goal data model with the Habit/HabitCompletion model it depends on.

## What Changes

- **BREAKING**: Replace the `goals` table with `habits` and `habit_completions` tables (soft-delete on habits, one completion row per habit per day). Existing goal data is not migrated — this is a pre-release pivot.
- **BREAKING**: Replace Rust commands `create_goal/get_goals/update_goal/delete_goal` with habit commands: `create_habit`, `get_habits`, `update_habit`, `delete_habit` (soft delete), `toggle_habit_completion`, `get_completions` (range query for week dots/history/streaks)
- **BREAKING**: Replace the frontend `goal-service`/`goal-actions` layers with `habit-service`/`habit-actions` (Zod DTOs, React Query hooks) for habits and completions
- Rework the main widget: header with date + gear icon, daily progress bar, per-habit rows showing a color-coded completion checkbox, last-7-days dots, and a flame + streak count
- Add a Manage Window: a normal (non-widget) OS window opened via the gear icon, with tab navigation
- Add the **My Habits** tab: list of habits (color swatch, name, edit, delete), create/edit form with name + color picker, soft delete
- Add the **History** tab: month view of day-by-day completions, month navigation, per-habit filter chips
- Emit a `habits:changed` Tauri event after every mutation so the widget and Manage Window stay in sync without polling
- Remove the `goals-database`, `goal-service`, `goal-actions`, and `goal-list-view` capabilities (superseded — see Impact)

## Capabilities

### New Capabilities

- `habit-database`: SQLite schema migration for `habits` and `habit_completions` tables, plus Rust CRUD + completion-toggle commands, replacing `goals-database`
- `habit-service`: Typed Tauri `invoke()` wrappers with Zod DTO validation for habit CRUD and completion commands, replacing `goal-service`
- `habit-actions`: React hooks orchestrating habit/completion data fetching and mutations, including streak and week-dot derivation, replacing `goal-actions`
- `main-widget-view`: The reworked always-visible widget — date header, gear icon, daily progress bar, habit rows with color checkbox, week dots, and streak counter, replacing `goal-list-view`
- `manage-window`: Secondary on-demand OS window opened from the gear icon, with tab navigation between My Habits and History
- `my-habits-view`: Manage Window tab listing habits with color swatch, edit, and delete; create/edit form with name + color picker; soft delete preserves history
- `history-view`: Manage Window tab showing a month view of day-by-day completions with month navigation and per-habit filter chips

### Modified Capabilities

<!-- No in-place requirement modifications — goal-* capabilities are superseded and removed; see Impact -->

## Impact

- **Rust**: `migrations.rs` replaces the goals migration with habits + habit_completions migrations; `handlers.rs`/`commands.rs` replace goal handlers with habit + completion handlers; `lib.rs` registers the new commands and emits `habits:changed`
- **Frontend**: `src/features/goals/` is replaced by `src/features/habits/` (domain/services/actions/components); `App.tsx` mounts the reworked widget; a new Manage Window (separate Tauri window config) hosts `ManageWindow`, `MyHabitsTab`, `HistoryTab`
- **Tauri config**: new window definition for the Manage Window in `tauri.conf.json`; capabilities file may need window-management permissions for opening/closing it
- **Removed specs**: `openspec/specs/goals-database/`, `goal-service/`, `goal-actions/`, `goal-list-view/` are deleted as part of this change (their behavior is fully superseded by the new habit-* capabilities)
- **No data migration**: this is a pre-release schema pivot; no backward compatibility with existing `goals.db` data is provided
