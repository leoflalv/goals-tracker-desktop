## ADDED Requirements

### Requirement: QueryClientProvider setup
The app SHALL wrap its component tree in a single React Query `QueryClientProvider`, shared by both the main widget window and the Manage Window.

#### Scenario: Provider wraps the app
- **WHEN** either window's root component renders
- **THEN** all habit/completion hooks called within it have access to the shared `QueryClient`

### Requirement: useGetHabits hook
The actions layer SHALL expose a `useGetHabits` hook that fetches active habits via `getHabits()` and exposes `data`, `isLoading`, and `error`.

#### Scenario: Successful fetch
- **WHEN** `useGetHabits` mounts and the query resolves
- **THEN** `data` contains the `Habit[]` and `isLoading` becomes `false`

### Requirement: useGetCompletions hook
The actions layer SHALL expose a `useGetCompletions(from, to)` hook that fetches completions for a date range via `getCompletions()` and exposes `data`, `isLoading`, and `error`.

#### Scenario: Successful fetch for a range
- **WHEN** `useGetCompletions(from, to)` mounts and the query resolves
- **THEN** `data` contains the `HabitCompletion[]` for that range

### Requirement: useCreateHabit hook
The actions layer SHALL expose a `useCreateHabit` hook that calls `createHabit()` and invalidates the habits query on success.

#### Scenario: Create invalidates habit list
- **WHEN** `useCreateHabit`'s mutation succeeds
- **THEN** the habits query is invalidated and refetched so the new habit appears

### Requirement: useUpdateHabit hook
The actions layer SHALL expose a `useUpdateHabit` hook that calls `updateHabit()` and invalidates the habits query on success.

#### Scenario: Update invalidates habit list
- **WHEN** `useUpdateHabit`'s mutation succeeds
- **THEN** the habits query is invalidated and refetched so the change appears

### Requirement: useDeleteHabit hook
The actions layer SHALL expose a `useDeleteHabit` hook that calls `deleteHabit()` and invalidates the habits query on success.

#### Scenario: Delete invalidates habit list
- **WHEN** `useDeleteHabit`'s mutation succeeds
- **THEN** the habits query is invalidated and the deleted habit no longer appears

### Requirement: useToggleHabitCompletion hook
The actions layer SHALL expose a `useToggleHabitCompletion` hook that calls `toggleHabitCompletion()` and invalidates the relevant completions query range on success.

#### Scenario: Toggle invalidates completions for the affected range
- **WHEN** `useToggleHabitCompletion`'s mutation succeeds for a given date
- **THEN** the completions query covering that date is invalidated and refetched

### Requirement: Streak, week-dots, and daily-progress derivation
The actions/domain layer SHALL provide pure functions that derive, from a habit and its completions: the current streak (consecutive completed days ending today), the last-7-days completion dots, and the overall daily progress (completed habits / total habits for today). These functions SHALL take no framework dependencies and SHALL NOT rely on any stored counters.

#### Scenario: Streak counts consecutive days ending today
- **WHEN** a habit has completions on today and the 3 preceding consecutive days, with a gap before that
- **THEN** the derived streak is 4

#### Scenario: Week dots reflect the last 7 days
- **WHEN** completions are provided for a habit across the last 7 days
- **THEN** the derived week-dots array has 7 entries, each marked completed or not for its corresponding day

#### Scenario: Daily progress reflects today's completions
- **WHEN** 3 of 5 active habits have a completion for today
- **THEN** the derived daily progress is 3 / 5

### Requirement: Cross-window sync via habits:changed event
Both the main widget and the Manage Window SHALL listen for a `habits:changed` Tauri event and invalidate their habit/completion queries when it is received, so mutations made in one window are reflected in the other without polling.

#### Scenario: Mutation in Manage Window updates the main widget
- **WHEN** a habit is created, updated, deleted, or toggled in the Manage Window
- **THEN** the backend emits `habits:changed` and the main widget's queries are invalidated and refetched

#### Scenario: Mutation in main widget updates the Manage Window
- **WHEN** a habit completion is toggled in the main widget
- **THEN** the backend emits `habits:changed` and the Manage Window's queries (if open) are invalidated and refetched
