## Why

The app has a complete backend (CRUD Tauri commands), typed service layer, React Query hooks, and shared UI primitives — but `App.tsx` is a bare shell that renders nothing useful. This change builds the actual goals UI so the app is functional end-to-end.

## What Changes

- Add `GoalCard` component — displays a single goal with title, optional description, a completion toggle checkbox, and a delete button
- Add `GoalList` component — renders the list of `GoalCard` items; shows an empty state when no goals exist and a loading spinner while fetching
- Add `AddGoalForm` component — inline form with a title input and optional description field that creates a new goal on submit
- Add `GoalWidget` component — top-level layout that composes the list and form, draws the drag handle, and acts as the widget chrome (transparent rounded panel)
- Wire everything into `App.tsx` replacing the placeholder title

## Capabilities

### New Capabilities
- `goal-list-view`: The main widget view — lists goals, allows adding new ones, toggling completion, and deleting; includes the drag handle and widget chrome

### Modified Capabilities
<!-- none -->

## Impact

- New files under `src/features/goals/components/`
- `App.tsx` updated to mount `<GoalWidget />` instead of the bare title
- Uses existing hooks (`useGetGoals`, `useCreateGoal`, `useUpdateGoal`, `useDeleteGoal`) and shared components (`Button`, `Input`, `Spinner`, `ToastContainer`)
- No new dependencies, no Rust changes, no breaking changes
