## ADDED Requirements

### Requirement: GoalDto Zod schema and mapper
The system SHALL define a Zod schema `GoalSchema` in `src/features/goals/services/goalDto.ts` that validates the raw object returned by the Tauri backend: `id` (number), `title` (string), `description` (string or null), `completed` (boolean), `created_at` (string). The file SHALL also export a `GoalDto` type inferred from the schema and a `toGoal(dto: GoalDto): Goal` function that converts a validated DTO to the `Goal` domain type.

#### Scenario: Valid backend payload passes schema parse
- **WHEN** `GoalSchema.parse()` is called with an object matching the expected shape
- **THEN** it returns a typed `GoalDto` without throwing

#### Scenario: Invalid backend payload throws ZodError
- **WHEN** `GoalSchema.parse()` is called with a missing or incorrectly typed field (e.g., `id` as a string)
- **THEN** it throws a `ZodError` describing the invalid field

#### Scenario: toGoal maps all fields to domain type
- **WHEN** `toGoal(dto)` is called with a valid `GoalDto`
- **THEN** it returns a `Goal` object with all fields correctly mapped

### Requirement: Goal domain type
The system SHALL define a `Goal` TypeScript type alias in `src/features/goals/domain/Goal.ts` that mirrors the Rust `Goal` struct: `id: number`, `title: string`, `description: string | null`, `completed: boolean`, `created_at: string`. Types (not interfaces) SHALL be used for data shapes; interfaces are reserved for describing objects with methods.

#### Scenario: Type is importable from domain index
- **WHEN** a service or hook imports from `@/features/goals/domain`
- **THEN** the `Goal` type is available without deep path imports

### Requirement: getGoals service function
The system SHALL export an async `getGoals()` function from `src/features/goals/services/goalService.ts` that invokes the Tauri `get_goals` command, validates each item in the response through `GoalSchema.array().parse()`, maps them with `toGoal()`, and returns `Promise<Goal[]>`.

#### Scenario: Successful fetch returns validated goal array
- **WHEN** `getGoals()` is called and the backend returns a list of goals
- **THEN** the function resolves with a typed `Goal[]` array where each item has been validated and mapped from the DTO

#### Scenario: Backend error propagates as thrown Error
- **WHEN** `getGoals()` is called and the Tauri command rejects
- **THEN** the function throws an `Error` with the backend error message as its `message`

#### Scenario: Invalid backend shape throws ZodError
- **WHEN** `getGoals()` is called and the backend returns objects with unexpected field types
- **THEN** the function throws a `ZodError` before returning any data

### Requirement: createGoal service function
The system SHALL export an async `createGoal(title: string, description?: string)` function that invokes `create_goal`, validates the response through `GoalSchema.parse()`, maps it with `toGoal()`, and returns `Promise<Goal>`.

#### Scenario: Valid title creates and returns validated goal
- **WHEN** `createGoal("Buy milk")` is called
- **THEN** the function resolves with a validated and mapped `Goal` including its assigned `id`

#### Scenario: Empty title propagates backend error
- **WHEN** `createGoal("")` is called
- **THEN** the function throws an `Error` with the backend validation message

### Requirement: updateGoal service function
The system SHALL export an async `updateGoal(id: number, completed: boolean, title?: string, description?: string)` function that invokes `update_goal` and returns `Promise<void>`.

#### Scenario: Successful update resolves
- **WHEN** `updateGoal(1, true)` is called for an existing goal
- **THEN** the function resolves without a value

#### Scenario: Non-existent id propagates backend error
- **WHEN** `updateGoal(999, true)` is called for an id that does not exist
- **THEN** the function throws an `Error`

### Requirement: deleteGoal service function
The system SHALL export an async `deleteGoal(id: number)` function that invokes `delete_goal` and returns `Promise<void>`.

#### Scenario: Successful delete resolves
- **WHEN** `deleteGoal(1)` is called for an existing goal
- **THEN** the function resolves without a value

#### Scenario: Non-existent id propagates backend error
- **WHEN** `deleteGoal(999)` is called for an id that does not exist
- **THEN** the function throws an `Error`
