## REMOVED Requirements

### Requirement: Result type and tryCatch utility
**Reason**: Retained as a shared utility but re-specified under `habit-service` against habit/completion calls.
**Migration**: None — pre-release pivot.

### Requirement: GoalDto Zod schema and mapper
**Reason**: Replaced by `HabitDto`/`HabitCompletionDto` Zod schemas and mappers in `habit-service`.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: Goal domain type
**Reason**: Replaced by the `Habit` and `HabitCompletion` domain types in `habit-service`.
**Migration**: None — pre-release pivot.

### Requirement: getGoals service function
**Reason**: Replaced by `getHabits` in `habit-service`.
**Migration**: None — pre-release pivot.

### Requirement: createGoal service function
**Reason**: Replaced by `createHabit` in `habit-service`.
**Migration**: None — pre-release pivot.

### Requirement: updateGoal service function
**Reason**: Replaced by `updateHabit` in `habit-service`.
**Migration**: None — pre-release pivot.

### Requirement: deleteGoal service function
**Reason**: Replaced by `deleteHabit` (soft delete) in `habit-service`.
**Migration**: None — pre-release pivot.
