## 1. Setup

- [ ] 1.1 Install `zod` as a runtime dependency (`pnpm add zod`)

## 2. Domain Type

- [ ] 2.1 Create `src/features/goals/domain/Goal.ts` with the `Goal` interface (`id`, `title`, `description`, `completed`, `created_at`)
- [ ] 2.2 Create `src/features/goals/domain/index.ts` re-exporting `Goal`

## 3. DTO and Validation

- [ ] 3.1 Create `src/features/goals/services/goalDto.ts` with `GoalSchema` Zod schema matching the backend `Goal` struct shape
- [ ] 3.2 Export `GoalDto` type inferred from `GoalSchema` in `goalDto.ts`
- [ ] 3.3 Export `toGoal(dto: GoalDto): Goal` map function in `goalDto.ts`

## 4. Service Layer

- [ ] 4.1 Create `src/features/goals/services/goalService.ts` with `getGoals()` — invokes `get_goals`, validates via `GoalSchema.array().parse()`, maps with `toGoal()`, wraps IPC errors as `Error`
- [ ] 4.2 Add `createGoal(title, description?)` to `goalService.ts` — invokes `create_goal`, validates via `GoalSchema.parse()`, maps with `toGoal()`
- [ ] 4.3 Add `updateGoal(id, completed, title?, description?)` to `goalService.ts` — invokes `update_goal`, returns `Promise<void>`
- [ ] 4.4 Add `deleteGoal(id)` to `goalService.ts` — invokes `delete_goal`, returns `Promise<void>`

## 5. Action Hooks

- [ ] 5.1 Create `src/features/goals/actions/useGetGoals.ts` — fetches on mount, returns `{ goals, loading, error, refetch }`
- [ ] 5.2 Create `src/features/goals/actions/useCreateGoal.ts` — returns `{ createGoal, loading, error }` with optional `onSuccess` callback
- [ ] 5.3 Create `src/features/goals/actions/useUpdateGoal.ts` — returns `{ updateGoal, loading, error }` with optional `onSuccess` callback
- [ ] 5.4 Create `src/features/goals/actions/useDeleteGoal.ts` — returns `{ deleteGoal, loading, error }` with optional `onSuccess` callback

## 6. Tests

- [ ] 6.1 Write unit tests for `goalDto.ts` (valid shape passes, invalid shape throws `ZodError`, `toGoal` maps all fields correctly)
- [ ] 6.2 Write unit tests for `goalService.ts` (mock `invoke`, verify command names, argument shapes, DTO validation path, and error wrapping)
- [ ] 6.3 Write unit tests for `useGetGoals` (mock service, assert loading transitions and error state)
- [ ] 6.4 Write unit tests for `useCreateGoal`, `useUpdateGoal`, `useDeleteGoal` (mock service, assert `onSuccess` called on success and not on failure)
