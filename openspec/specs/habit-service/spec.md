# Habit Service Spec

## Purpose

Frontend data-access layer: the shared `Result`/`tryCatch` utility, the `Habit`/`HabitCompletion` domain types, the Zod DTOs/mappers, and the service functions that wrap Tauri `invoke()` calls for habit CRUD and completions.

## Requirements

### Requirement: Result type and tryCatch utility
The service layer SHALL expose a shared `Result<T>` type and a `tryCatch` helper that wraps a promise-returning call and returns either the resolved value or a typed error, without throwing.

#### Scenario: Wrapped call succeeds
- **WHEN** `tryCatch` wraps a promise that resolves
- **THEN** it returns a success result containing the resolved value

#### Scenario: Wrapped call fails
- **WHEN** `tryCatch` wraps a promise that rejects
- **THEN** it returns a failure result containing the error, without throwing

### Requirement: Habit and HabitCompletion domain types
The domain layer SHALL define a `Habit` type (`id`, `name`, `color`, `sortOrder`, `createdAt`, `deletedAt`) and a `HabitCompletion` type (`id`, `habitId`, `completedOn`), independent of any framework.

#### Scenario: Domain types have no framework imports
- **WHEN** `Habit` and `HabitCompletion` are defined
- **THEN** their module imports no React, Tauri, or query-library dependencies

### Requirement: HabitDto and HabitCompletionDto Zod schemas and mappers
The service layer SHALL define Zod schemas validating the raw snake_case backend payloads for habits and completions, and `toHabit()` / `toHabitCompletion()` functions mapping validated DTOs to domain types.

#### Scenario: Valid payload maps to domain type
- **WHEN** a raw backend payload matching the DTO schema is passed to the mapper
- **THEN** a domain object with camelCase fields is returned

#### Scenario: Invalid payload fails validation
- **WHEN** a raw backend payload is missing a required field or has a wrong type
- **THEN** schema validation throws/reports an error before mapping occurs

### Requirement: getHabits service function
The service layer SHALL expose a `getHabits()` function that invokes the `get_habits` Tauri command, validates the response array through `HabitDto`, and returns `Habit[]`.

#### Scenario: Fetch habits
- **WHEN** `getHabits()` is called
- **THEN** `invoke("get_habits")` is called and the validated, mapped `Habit[]` is returned

### Requirement: getAllHabits service function
The service layer SHALL expose a `getAllHabits()` function that invokes the `get_all_habits` Tauri command, validates the response array through `HabitDto`, and returns `Habit[]` including soft-deleted habits.

#### Scenario: Fetch all habits including deleted
- **WHEN** `getAllHabits()` is called
- **THEN** `invoke("get_all_habits")` is called and the validated, mapped `Habit[]` (including any with `deletedAt` set) is returned

### Requirement: createHabit service function
The service layer SHALL expose a `createHabit(name, color)` function that invokes the `create_habit` Tauri command and returns the created `Habit`.

#### Scenario: Create habit
- **WHEN** `createHabit(name, color)` is called
- **THEN** `invoke("create_habit", { name, color })` is called and the created `Habit` is returned

### Requirement: updateHabit service function
The service layer SHALL expose an `updateHabit(id, changes)` function that invokes the `update_habit` Tauri command and returns the updated `Habit`.

#### Scenario: Update habit
- **WHEN** `updateHabit(id, { name, color })` is called
- **THEN** `invoke("update_habit", { id, name, color })` is called and the updated `Habit` is returned

### Requirement: deleteHabit service function
The service layer SHALL expose a `deleteHabit(id)` function that invokes the `delete_habit` Tauri command (soft delete).

#### Scenario: Delete habit
- **WHEN** `deleteHabit(id)` is called
- **THEN** `invoke("delete_habit", { id })` is called

### Requirement: toggleHabitCompletion service function
The service layer SHALL expose a `toggleHabitCompletion(habitId, date)` function that invokes the `toggle_habit_completion` Tauri command and returns the resulting completion state.

#### Scenario: Toggle completion
- **WHEN** `toggleHabitCompletion(habitId, date)` is called
- **THEN** `invoke("toggle_habit_completion", { habitId, date })` is called and the resulting `{ completed: boolean }` state is returned

### Requirement: getCompletions service function
The service layer SHALL expose a `getCompletions(from, to)` function that invokes the `get_completions` Tauri command, validates the response array through `HabitCompletionDto`, and returns `HabitCompletion[]`.

#### Scenario: Fetch completions for a range
- **WHEN** `getCompletions(from, to)` is called
- **THEN** `invoke("get_completions", { from, to })` is called and the validated, mapped `HabitCompletion[]` is returned
