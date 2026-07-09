## REMOVED Requirements

### Requirement: QueryClientProvider setup
**Reason**: Retained as infrastructure but re-specified under `habit-actions` since it now wraps habit/completion queries.
**Migration**: None — pre-release pivot.

### Requirement: useGetGoals hook
**Reason**: Replaced by `useGetHabits` (and `useGetCompletions`) in `habit-actions`.
**Migration**: None — pre-release pivot.

### Requirement: useCreateGoal hook
**Reason**: Replaced by `useCreateHabit` in `habit-actions`.
**Migration**: None — pre-release pivot.

### Requirement: useUpdateGoal hook
**Reason**: Replaced by `useUpdateHabit` and `useToggleHabitCompletion` in `habit-actions`.
**Migration**: None — pre-release pivot.

### Requirement: useDeleteGoal hook
**Reason**: Replaced by `useDeleteHabit` (soft delete) in `habit-actions`.
**Migration**: None — pre-release pivot.
