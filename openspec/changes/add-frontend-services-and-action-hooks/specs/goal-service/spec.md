## ADDED Requirements

### Requirement: Result type and tryCatch utility
The system SHALL export a `Result<T>` type and a `tryCatch<T>(promise: Promise<T>): Promise<Result<T>>` function from `src/shared/utils/result.ts`. `Result<T>` is a readonly tuple: `[T, null]` on success or `[null, Error]` on failure. `tryCatch` SHALL convert non-Error throws (e.g. Tauri IPC strings) to `Error` objects. Service functions SHALL use `tryCatch` internally and hooks SHALL use `tryCatch` to call services — no try/catch blocks anywhere.

#### Scenario: Successful promise returns data tuple
- **WHEN** `tryCatch(promise)` is called and the promise resolves with a value
- **THEN** it returns `[value, null]`

#### Scenario: Rejected promise returns error tuple
- **WHEN** `tryCatch(promise)` is called and the promise rejects with a string
- **THEN** it returns `[null, Error]` where the Error's message is the rejection string

### Requirement: GoalDto Zod schema and mapper
The system SHALL define a Zod schema `GoalSchema` in `src/features/goals/services/goalDto.ts` that validates the raw object returned by the Tauri backend: `id` (number), `title` (string), `description` (string or null), `completed` (boolean), `created_at` (string). The file SHALL also export a `GoalDto` type inferred from the schema and a `toGoal(dto: GoalDto): Goal` function that converts a validated DTO to the `Goal` domain type. Validation SHALL use `safeParse` (not `parse`) so no exception is thrown.

#### Scenario: Valid backend payload passes safeParse
- **WHEN** `GoalSchema.safeParse()` is called with an object matching the expected shape
- **THEN** it returns `{ success: true, data: GoalDto }`

#### Scenario: Invalid backend payload fails safeParse
- **WHEN** `GoalSchema.safeParse()` is called with a missing or incorrectly typed field (e.g., `id` as a string)
- **THEN** it returns `{ success: false, error: ZodError }`

#### Scenario: toGoal maps all fields to domain type with camelCase
- **WHEN** `toGoal(dto)` is called with a valid `GoalDto`
- **THEN** it returns a `Goal` object with all fields correctly mapped, including `dto.created_at` mapped to `goal.createdAt`

### Requirement: Goal domain type
The system SHALL define a `Goal` TypeScript type alias in `src/features/goals/domain/Goal.ts` with camelCase fields: `id: number`, `title: string`, `description: string | null`, `completed: boolean`, `createdAt: string`. All frontend model fields MUST use camelCase regardless of the backend's snake_case naming. Types (not interfaces) SHALL be used for data shapes; interfaces are reserved for describing objects with methods.

#### Scenario: Type is importable from domain index
- **WHEN** a service or hook imports from `@/features/goals/domain`
- **THEN** the `Goal` type is available without deep path imports

### Requirement: getGoals service function
The system SHALL export an async `getGoals(): Promise<Goal[]>` function from `src/features/goals/services/goalService.ts`. Internally it SHALL use `tryCatch` to invoke `get_goals` and `z.array(GoalSchema).safeParse()` to validate, rethrowing any error. It SHALL map valid results with `toGoal()`.

#### Scenario: Successful fetch returns goal array
- **WHEN** `getGoals()` is called and the backend returns a list of goals
- **THEN** it resolves with a `Goal[]` where each item has been validated and mapped from the DTO

#### Scenario: Backend error propagates as thrown Error
- **WHEN** `getGoals()` is called and the Tauri command rejects
- **THEN** it throws an `Error` with the backend error message

#### Scenario: Invalid backend shape propagates as thrown ZodError
- **WHEN** `getGoals()` is called and the backend returns objects with unexpected field types
- **THEN** it throws a `ZodError`

### Requirement: createGoal service function
The system SHALL export an async `createGoal(title: string, description?: string): Promise<Goal>` function. Internally it SHALL use `tryCatch` to invoke `create_goal` and `GoalSchema.safeParse()` to validate, rethrowing any error. It SHALL map the result with `toGoal()`.

#### Scenario: Valid title resolves with the new goal
- **WHEN** `createGoal("Buy milk")` is called
- **THEN** it resolves with a `Goal` including its assigned `id`

#### Scenario: Empty title propagates backend error
- **WHEN** `createGoal("")` is called
- **THEN** it throws an `Error` with the backend validation message

### Requirement: updateGoal service function
The system SHALL export an async `updateGoal(id: number, completed: boolean, title?: string, description?: string): Promise<void>` function. Internally it SHALL use `tryCatch` to invoke `update_goal` and rethrow any error.

#### Scenario: Successful update resolves
- **WHEN** `updateGoal(1, true)` is called for an existing goal
- **THEN** it resolves without a value

#### Scenario: Non-existent id propagates backend error
- **WHEN** `updateGoal(999, true)` is called for an id that does not exist
- **THEN** it throws an `Error`

### Requirement: deleteGoal service function
The system SHALL export an async `deleteGoal(id: number): Promise<void>` function. Internally it SHALL use `tryCatch` to invoke `delete_goal` and rethrow any error.

#### Scenario: Successful delete resolves
- **WHEN** `deleteGoal(1)` is called for an existing goal
- **THEN** it resolves without a value

#### Scenario: Non-existent id propagates backend error
- **WHEN** `deleteGoal(999)` is called for an id that does not exist
- **THEN** it throws an `Error`
