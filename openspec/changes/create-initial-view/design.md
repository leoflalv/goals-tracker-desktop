## Context

The Tauri app runs as a borderless, transparent widget (no OS titlebar). The backend exposes four commands (`get_goals`, `create_goal`, `update_goal`, `delete_goal`) and the frontend has typed service wrappers, React Query hooks, and shared primitives (`Button`, `Input`, `Spinner`, `ToastContainer`). `App.tsx` currently renders only a heading and the toast container — no actual goals UI exists.

## Goals / Non-Goals

**Goals:**
- Render a scrollable goal list using the existing `useGetGoals` hook
- Allow adding a new goal inline without navigating away
- Allow toggling completion and deleting each goal
- Draw a drag handle so the user can reposition the widget
- Compose the view entirely from existing hooks and shared components

**Non-Goals:**
- Editing goal title/description in-place (create + delete covers the MVP)
- Search, filter, or sort controls
- Animations or drag-to-reorder
- Multiple views or routing

## Decisions

### Component decomposition

Four components under `src/features/goals/components/`:

| Component | Responsibility |
|---|---|
| `GoalCard` | Single goal row — checkbox, title, optional description, delete button |
| `GoalList` | Renders the list of `GoalCard`s; owns loading and empty states |
| `AddGoalForm` | Controlled form with title input + optional description; calls `useCreateGoal` |
| `GoalWidget` | Root layout — drag handle + scrollable list + add form |

`App.tsx` mounts only `<GoalWidget />` (plus the existing `<ToastContainer />`). No routing or context needed.

**Alternative considered:** a single monolithic `GoalView` component. Rejected because it would make each interaction scenario harder to isolate in tests.

### Drag handle

Tauri 2 provides `getCurrentWindow().startDragging()` (from `@tauri-apps/api/window`). The `GoalWidget` renders a thin strip at the top that calls `startDragging()` on `mousedown`. This requires no extra Tauri capability — `core:default` already covers window dragging.

**Alternative considered:** `data-tauri-drag-region` HTML attribute. This works for Tauri 1 but is not the recommended approach for Tauri 2 with `decorations: false`.

### Form placement

The `AddGoalForm` sits at the bottom of the widget, always visible. A "+" button to reveal/hide the form adds an extra interaction step for a widget that is permanently on screen.

### Error surfacing

Mutation errors (create, update, delete) are surfaced at the action layer via React Query's `onError` callback. Each action hook (`useCreateGoal`, `useUpdateGoal`, `useDeleteGoal`) calls `addToast` from `useToast()` inside `onError`. Components stay free of any error-handling or toast logic and have no `useEffect` watchers for errors.

**Alternative considered:** watching the hook's `error` return value in each component with `useEffect`. Rejected because it couples error display to the component render cycle, requires boilerplate in every component that uses mutations, and makes `useEffect` dependencies fragile.

## Risks / Trade-offs

- [Drag handle UX] The drag strip is a narrow hit target → Mitigation: make it visually distinct (cursor: grab) and give it sufficient height (≥ 20 px).
- [Form without description] Description is optional; the form should submit with only a title without requiring the user to clear the description field → Mitigation: send `undefined` (not empty string) when description is blank.
- [List height] Without a fixed max-height the widget could grow unbounded → Mitigation: set `max-h` on the list container with `overflow-y-auto` so it scrolls.
