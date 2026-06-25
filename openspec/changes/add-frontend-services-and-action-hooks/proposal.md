## Why

The Rust backend exposes four Tauri commands (`create_goal`, `get_goals`, `update_goal`, `delete_goal`) but the React frontend has no typed wrappers or hooks to call them — `App.tsx` is a bare shell with no feature code. This change wires the frontend to the backend so UI components can actually read and mutate goals.

## What Changes

- Add `src/features/goals/domain/Goal.ts` — TypeScript interface mirroring the Rust `Goal` struct
- Add `src/features/goals/services/goalDto.ts` — Zod schema validating raw backend payloads + `toGoal()` map function from DTO to domain type
- Add `src/features/goals/services/goalService.ts` — typed `invoke()` wrappers that validate responses through the DTO schema before returning domain types
- Add `src/features/goals/actions/useGetGoals.ts` — hook that fetches goals on mount and exposes loading/error state
- Add `src/features/goals/actions/useCreateGoal.ts` — hook that calls `create_goal` and refreshes the list
- Add `src/features/goals/actions/useUpdateGoal.ts` — hook that calls `update_goal`
- Add `src/features/goals/actions/useDeleteGoal.ts` — hook that calls `delete_goal`

## Capabilities

### New Capabilities

- `goal-service`: Typed Tauri `invoke()` wrappers with Zod DTO validation and mapping for all four goal CRUD commands
- `goal-actions`: React hooks that orchestrate goal data fetching and mutations, exposing loading/error state to components

### Modified Capabilities

## Impact

- New files only under `src/features/goals/` — no existing files are modified
- Adds `zod` as a new runtime dependency
- Depends on `@tauri-apps/api` (already in deps) and the four registered Tauri handlers
- No new Rust changes needed
