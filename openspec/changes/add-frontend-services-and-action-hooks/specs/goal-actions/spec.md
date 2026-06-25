## ADDED Requirements

### Requirement: QueryClientProvider setup
The system SHALL wrap the React tree in a `QueryClientProvider` in `src/main.tsx` so all hooks can access the TanStack Query client.

#### Scenario: App renders inside QueryClientProvider
- **WHEN** the app mounts
- **THEN** a single `QueryClient` instance is provided to the entire component tree

### Requirement: useGetGoals hook
The system SHALL export a `useGetGoals()` React hook from `src/features/goals/actions/useGetGoals.ts` using `useQuery` with `queryKey: goalsQueryKey` and `queryFn: getGoals`. It SHALL return `{ goals: Goal[], loading: boolean, error: string | null, refetch: () => void }`.

#### Scenario: Hook fetches goals on mount
- **WHEN** a component mounts with `useGetGoals()`
- **THEN** `loading` is `true` initially, then becomes `false` once data arrives and `goals` is populated

#### Scenario: Backend error sets error field
- **WHEN** `getGoals()` throws (via `tryCatch` catching the error inside the hook)
- **THEN** `loading` becomes `false`, `error` contains the error message, and `goals` remains empty

#### Scenario: refetch re-triggers the query
- **WHEN** the `refetch` function returned by the hook is called
- **THEN** TanStack Query re-runs `getGoals()` and updates `goals`

### Requirement: useCreateGoal hook
The system SHALL export a `useCreateGoal()` React hook from `src/features/goals/actions/useCreateGoal.ts` using `useMutation`. On success it SHALL call `queryClient.invalidateQueries({ queryKey: goalsQueryKey })` to refresh the goals list. It SHALL return `{ createGoal: (title: string, description?: string, onSuccess?: () => void) => void, loading: boolean, error: string | null }`.

#### Scenario: Successful create invalidates goals query and calls onSuccess
- **WHEN** `createGoal("My goal", undefined, onSuccess)` is called and the backend succeeds
- **THEN** the goals query is invalidated (triggering a refetch) and `onSuccess` is called

#### Scenario: Failed create sets error
- **WHEN** `createGoal("")` is called and the service throws
- **THEN** `error` is set to the error message and `onSuccess` is NOT called

### Requirement: useUpdateGoal hook
The system SHALL export a `useUpdateGoal()` React hook from `src/features/goals/actions/useUpdateGoal.ts` using `useMutation`. On success it SHALL invalidate `goalsQueryKey`. It SHALL return `{ updateGoal: (id: number, completed: boolean, title?: string, description?: string, onSuccess?: () => void) => void, loading: boolean, error: string | null }`.

#### Scenario: Successful update invalidates goals query and calls onSuccess
- **WHEN** `updateGoal(1, true, undefined, undefined, onSuccess)` is called and the backend succeeds
- **THEN** the goals query is invalidated and `onSuccess` is called

#### Scenario: Failed update sets error
- **WHEN** `updateGoal(999, true)` is called and the service throws
- **THEN** `error` is set and `onSuccess` is NOT called

### Requirement: useDeleteGoal hook
The system SHALL export a `useDeleteGoal()` React hook from `src/features/goals/actions/useDeleteGoal.ts` using `useMutation`. On success it SHALL invalidate `goalsQueryKey`. It SHALL return `{ deleteGoal: (id: number, onSuccess?: () => void) => void, loading: boolean, error: string | null }`.

#### Scenario: Successful delete invalidates goals query and calls onSuccess
- **WHEN** `deleteGoal(1, onSuccess)` is called and the backend succeeds
- **THEN** the goals query is invalidated and `onSuccess` is called

#### Scenario: Failed delete sets error
- **WHEN** `deleteGoal(999)` is called and the service throws
- **THEN** `error` is set and `onSuccess` is NOT called
