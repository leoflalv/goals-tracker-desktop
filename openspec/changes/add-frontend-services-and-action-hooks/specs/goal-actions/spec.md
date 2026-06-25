## ADDED Requirements

### Requirement: useGetGoals hook
The system SHALL export a `useGetGoals()` React hook from `src/features/goals/actions/useGetGoals.ts` that fetches goals on mount and returns `{ goals: Goal[], loading: boolean, error: string | null, refetch: () => void }`.

#### Scenario: Hook fetches goals on mount
- **WHEN** a component mounts with `useGetGoals()`
- **THEN** `loading` is `true` initially, then becomes `false` once data arrives, and `goals` is populated

#### Scenario: Backend error sets error field
- **WHEN** `getGoals()` throws (via `tryCatch` catching the error inside the hook)
- **THEN** `loading` becomes `false`, `error` contains the error message, and `goals` remains empty

#### Scenario: refetch re-triggers the fetch
- **WHEN** the `refetch` function returned by the hook is called
- **THEN** the hook re-invokes `getGoals()` and updates `goals`

### Requirement: useCreateGoal hook
The system SHALL export a `useCreateGoal()` React hook from `src/features/goals/actions/useCreateGoal.ts` that returns `{ createGoal: (title: string, description?: string, onSuccess?: () => void) => Promise<void>, loading: boolean, error: string | null }`.

#### Scenario: Successful create calls onSuccess
- **WHEN** `createGoal("My goal", undefined, onSuccess)` is called and the backend succeeds
- **THEN** `loading` transitions from `true` to `false` and `onSuccess` is called

#### Scenario: Failed create sets error
- **WHEN** `createGoal("")` is called and the service throws
- **THEN** `error` is set to the error message and `onSuccess` is NOT called

### Requirement: useUpdateGoal hook
The system SHALL export a `useUpdateGoal()` React hook from `src/features/goals/actions/useUpdateGoal.ts` that returns `{ updateGoal: (id: number, completed: boolean, title?: string, description?: string, onSuccess?: () => void) => Promise<void>, loading: boolean, error: string | null }`.

#### Scenario: Successful update calls onSuccess
- **WHEN** `updateGoal(1, true, undefined, undefined, onSuccess)` is called and the backend succeeds
- **THEN** `onSuccess` is called after the operation completes

#### Scenario: Failed update sets error
- **WHEN** `updateGoal(999, true)` is called and the backend rejects
- **THEN** `error` is set and `onSuccess` is NOT called

### Requirement: useDeleteGoal hook
The system SHALL export a `useDeleteGoal()` React hook from `src/features/goals/actions/useDeleteGoal.ts` that returns `{ deleteGoal: (id: number, onSuccess?: () => void) => Promise<void>, loading: boolean, error: string | null }`.

#### Scenario: Successful delete calls onSuccess
- **WHEN** `deleteGoal(1, onSuccess)` is called and the backend succeeds
- **THEN** `onSuccess` is called after the operation completes

#### Scenario: Failed delete sets error
- **WHEN** `deleteGoal(999)` is called and the backend rejects
- **THEN** `error` is set and `onSuccess` is NOT called
