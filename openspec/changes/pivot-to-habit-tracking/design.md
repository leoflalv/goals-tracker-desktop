## Context

The app currently implements a single-window todo-list widget backed by a `goals` table (`title`, `description`, `completed` boolean). PRODUCT.md specifies a different product: a daily habit tracker with colored habits, streaks, week dots, a daily progress bar, and a secondary Manage Window with My Habits and History tabs. The History tab in particular requires a real day-by-day completion log, which the current `completed` boolean cannot provide. This design covers the schema, command, and window-architecture changes needed to build the full PRODUCT.md feature set in one pivot rather than bolting habit concepts onto the Goal model.

## Goals / Non-Goals

**Goals:**
- Replace the Goal data model with Habit + HabitCompletion, matching PRODUCT.md's schema
- Support streaks, week dots, and daily progress purely from queried completion data (no stored counters)
- Add a second, normal OS window (Manage Window) with My Habits and History tabs
- Keep both windows in sync via a Tauri event, without polling
- Preserve completion history for deleted habits (soft delete)

**Non-Goals:**
- Data migration from the existing `goals` table — this is a pre-release pivot, existing local data is discarded
- Habit target frequency (e.g. 3×/week) — explicitly V2 in PRODUCT.md
- Drag-to-reorder habits — explicitly V2 in PRODUCT.md
- Multi-user/sync — PRODUCT.md is single-user, local-only

## Decisions

**Schema: two tables, no stored counters.** `habits` (id, name, color, sort_order, created_at, deleted_at) and `habit_completions` (id, habit_id, completed_on, unique on habit_id+completed_on), exactly as specified in PRODUCT.md. Streaks, week dots, and daily progress are derived at read time from `habit_completions` rows rather than maintained as columns, so there's no risk of counters drifting from the underlying data — the tradeoff is more client-side computation, which is negligible at this data scale (single user, local SQLite).

**Streak/week-dot/progress computation lives in the frontend domain layer, not Rust.** The Rust `get_completions` command is a dumb range query (from/to → rows). All derivation (streak counting, week-dot mapping, progress fraction) is pure TypeScript in `src/features/habits/domain/`, colocated with the `Habit`/`HabitCompletion` types and unit-testable without a database. Alternative considered: compute streaks in SQL (window functions). Rejected — SQLite window function queries for "consecutive days ending today" are noticeably more complex than a linear scan over an already-small in-memory array, and keeping derivation in TS keeps all business logic in one testable layer per the project's clean-architecture convention.

**Soft delete via `deleted_at`, not a status enum.** Matches PRODUCT.md exactly and keeps the "is this habit active" check a single `IS NULL` filter in `get_habits`.

**Manage Window is a second Tauri window, not a modal/route inside the widget.** PRODUCT.md explicitly describes it as a separate, closeable, normal OS window (titlebar, not desktop-level). This means a second entry point in `tauri.conf.json` and a second React root (or a route split by window label) rather than reusing the transparent overlay window. Both windows import the same `habit-actions` hooks and share one `QueryClient` per window (React Query state is not shared across OS windows/processes — cross-window consistency is handled by the `habits:changed` event, not shared query cache).

**Cross-window sync via a single Tauri event, not polling.** After every mutating command (create/update/delete habit, toggle completion), Rust emits `habits:changed`. Both windows' frontends listen for it and invalidate their React Query caches. This matches the existing PRODUCT.md design and avoids introducing a polling interval or IPC-based state store.

**Capability rename over in-place modification.** The `goal-*` capabilities (`goals-database`, `goal-service`, `goal-actions`, `goal-list-view`) are removed and replaced with `habit-*` capabilities rather than modified in place, because the entity itself is changing (Goal → Habit), not just a requirement within the same entity. This keeps spec history honest: a future reader of `openspec/specs/` sees `habit-database` describing habits, not a goals-named spec that quietly became about habits.

**Window/visual Rust commands live in their own file, separate from data commands.** `commands.rs`/`handlers.rs` are for DB CRUD business logic. Anything about showing/focusing/hiding windows (e.g. `open_manage_window`) lives in `windows.rs` instead — added during group 7 after initially (incorrectly) placing it alongside the habit commands. Any further window-management commands (groups 8/9 shouldn't need any, but future changes might) belong there too. See `CLAUDE.md`.

**Frontend always composes from `src/shared/components/`, never raw HTML elements.** `Button`, `Input`, `Spinner`, `TabButton`, etc. — if a needed UI pattern is missing (as `TabButton` was for the Manage Window's tabs), add it to the shared design system rather than writing one-off markup in a feature component. Applies to the remaining My Habits (group 8) and History (group 9) work in this change. See `CLAUDE.md`.

**`get_all_habits` command added in group 9 for History.** `get_habits` (used by the main widget and My Habits) filters to `deleted_at IS NULL` by design — but History's filter chips and month view must still show soft-deleted habits that have prior completions (per the `history-view` spec's "Deleted habits remain visible in history" requirement), and `HabitCompletion` carries no name/color of its own. This wasn't anticipated in the original command list from group 2, so a new read-only `get_all_habits` command (no `deleted_at` filter) was added specifically for History's needs, backed by its own frontend query key (`allHabitsQueryKey`) so it doesn't collide with the active-only `habitsQueryKey` cache.

## Risks / Trade-offs

- [Existing local `goals.db` data is discarded] → Acceptable since the product is pre-release and PRODUCT.md's `README.md` "Features" list already advertises the habit-tracking behavior as current, implying no real user data exists yet to preserve. Confirm with user before implementation if this assumption is wrong.
- [Two separate windows means two separate React root mounts and, if not careful, duplicated bundle/setup code] → Mitigate by sharing all `src/features/habits/` layers (domain/services/actions) and `src/shared/` between both window entry points; only the top-level component/router per window differs.
- [Client-side streak/week-dot computation re-runs on every render] → Acceptable at this scale (single user, small habit counts); memoize derivation functions per habit/date-range if profiling shows it's needed later.
- [Manage Window and widget window can send conflicting mutations in rare race conditions (e.g. delete in one window while toggling in the other)] → The `habit_completions` foreign key and `toggle_habit_completion`'s existence check in Rust prevent orphaned completions; the UI simply refetches and reconciles via `habits:changed`.

## Migration Plan

1. Add new Rust migration for `habits` + `habit_completions`, replacing the `goals` migration (no data carry-over).
2. Implement and test new Rust commands; remove old goal handlers.
3. Build `src/features/habits/` (domain → services → actions), delete `src/features/goals/`.
4. Rework the main widget against the new hooks/domain logic.
5. Add the Manage Window (Tauri config + React entry) with My Habits, then History.
6. Wire `habits:changed` emission and both windows' listeners last, once both windows exist to sync.

Rollback: this change is developed on a branch; if issues arise, revert the branch — there is no production data to migrate back.

## Open Questions

- Should the Manage Window be a fully separate Vite entry point/HTML file, or a single-page app that branches UI by `getCurrentWindow().label`? Recommend the latter for simplicity (one build, one bundle) unless Tauri multi-window conventions in this codebase say otherwise — confirm during task breakdown.
