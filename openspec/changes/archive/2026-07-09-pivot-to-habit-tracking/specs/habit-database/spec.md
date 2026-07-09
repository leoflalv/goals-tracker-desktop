## ADDED Requirements

### Requirement: SQLite database initializes on startup
The app SHALL create the app data directory and open (or create) a SQLite database file on startup, applying all pending migrations before any command is handled.

#### Scenario: First launch creates the database
- **WHEN** the app launches and no database file exists yet
- **THEN** the app data directory and database file are created and the `habits` and `habit_completions` tables exist

#### Scenario: Subsequent launch reuses the database
- **WHEN** the app launches and a database file already exists
- **THEN** the existing file is opened and no data is lost

### Requirement: Habits table enforces required fields
The `habits` table SHALL require `name` and `color`, auto-generate `id` (uuid) and `created_at`, default `sort_order` to the next available position, and support a nullable `deleted_at` for soft delete.

#### Scenario: Insert without name fails
- **WHEN** an insert into `habits` omits `name`
- **THEN** the database rejects the insert with a constraint error

#### Scenario: Insert without color fails
- **WHEN** an insert into `habits` omits `color`
- **THEN** the database rejects the insert with a constraint error

### Requirement: Habit completions table enforces one completion per habit per day
The `habit_completions` table SHALL have a unique constraint on `(habit_id, completed_on)` and a foreign key to `habits.id`.

#### Scenario: Duplicate completion for the same day is rejected
- **WHEN** an insert into `habit_completions` uses a `(habit_id, completed_on)` pair that already exists
- **THEN** the database rejects the insert with a uniqueness constraint error

### Requirement: Create habit command
The backend SHALL expose a `create_habit` command accepting `name` and `color`, inserting a new row with an auto-generated `id`, `created_at`, and `sort_order` set to the next position, and returning the created habit.

#### Scenario: Successful creation
- **WHEN** `create_habit` is called with a non-empty `name` and a valid hex `color`
- **THEN** a new row is inserted and the created habit (with generated `id` and `created_at`) is returned

### Requirement: List habits command
The backend SHALL expose a `get_habits` command that returns all habits where `deleted_at IS NULL`, ordered by `sort_order`.

#### Scenario: Listing excludes soft-deleted habits
- **WHEN** `get_habits` is called and a habit has a non-null `deleted_at`
- **THEN** that habit is not included in the returned list

### Requirement: List all habits command including soft-deleted
The backend SHALL expose a `get_all_habits` command that returns every habit regardless of `deleted_at`, ordered by `sort_order`, so callers needing historical habit metadata (name, color) — such as the History view — can resolve soft-deleted habits.

#### Scenario: Listing includes soft-deleted habits
- **WHEN** `get_all_habits` is called and a habit has a non-null `deleted_at`
- **THEN** that habit is included in the returned list

### Requirement: Update habit command
The backend SHALL expose an `update_habit` command accepting `id` and optional `name`/`color`, updating only the provided fields and returning the updated habit.

#### Scenario: Update name and color
- **WHEN** `update_habit` is called with an existing `id`, a new `name`, and a new `color`
- **THEN** the row is updated and the returned habit reflects both new values

#### Scenario: Update unknown id fails
- **WHEN** `update_habit` is called with an `id` that does not exist
- **THEN** the command returns an error and no row is modified

### Requirement: Delete habit command is a soft delete
The backend SHALL expose a `delete_habit` command that sets `deleted_at` to the current timestamp rather than removing the row, preserving historical completions.

#### Scenario: Soft delete preserves completions
- **WHEN** `delete_habit` is called for a habit that has existing `habit_completions` rows
- **THEN** the habit's `deleted_at` is set and its completion rows remain in the database unchanged

### Requirement: Toggle habit completion command
The backend SHALL expose a `toggle_habit_completion` command accepting `habit_id` and `date` (`YYYY-MM-DD`) that inserts a completion row if none exists for that day, or deletes it if one already exists, and returns the resulting completion state.

#### Scenario: Marking done inserts a completion row
- **WHEN** `toggle_habit_completion` is called for a habit/date with no existing completion
- **THEN** a `habit_completions` row is inserted for that `habit_id`/`date` and the command returns `completed: true`

#### Scenario: Marking undone removes the completion row
- **WHEN** `toggle_habit_completion` is called for a habit/date that already has a completion
- **THEN** the matching `habit_completions` row is deleted and the command returns `completed: false`

### Requirement: Get completions command
The backend SHALL expose a `get_completions` command accepting a date range (`from`, `to`) and returning all `habit_completions` rows with `completed_on` within that range (inclusive), for all habits.

#### Scenario: Range query returns matching rows
- **WHEN** `get_completions` is called with `from`/`to` covering a date range
- **THEN** all completion rows with `completed_on` between `from` and `to` (inclusive) are returned, regardless of habit

### Requirement: Tauri SQL plugin is registered and permissioned
The Tauri SQL plugin SHALL be registered against the habits database file with the schema migrations applied, and the app capabilities file SHALL grant the permissions needed to use it.

#### Scenario: Plugin registration
- **WHEN** the app builds its Tauri instance
- **THEN** the SQL plugin is registered with the habits/habit_completions migrations and the `sql:default` capability is granted

### Requirement: All commands have Rust integration tests
Every habit and completion command SHALL have Rust integration test coverage for its success path and its documented failure path.

#### Scenario: Test suite covers all commands
- **WHEN** the Rust test suite runs
- **THEN** `create_habit`, `get_habits`, `get_all_habits`, `update_habit`, `delete_habit`, `toggle_habit_completion`, and `get_completions` each have at least one passing integration test
