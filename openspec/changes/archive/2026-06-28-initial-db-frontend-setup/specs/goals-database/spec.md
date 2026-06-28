## ADDED Requirements

### Requirement: SQLite database initializes on startup
The system SHALL initialize a SQLite database file on first launch using `tauri-plugin-sql` with a programmatic migration (version 1) that creates the `goals` table.

#### Scenario: First launch creates the database
- **WHEN** the Tauri app starts for the first time
- **THEN** a SQLite file is created in the app's data directory and the `goals` table exists with columns: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `title` (TEXT NOT NULL), `description` (TEXT), `completed` (INTEGER NOT NULL DEFAULT 0), `created_at` (TEXT NOT NULL)

#### Scenario: Subsequent launches reuse existing database
- **WHEN** the Tauri app starts and the database file already exists
- **THEN** the migration runner detects version 1 is already applied and does not recreate the table

### Requirement: Goals table enforces required fields
The `goals` table SHALL enforce NOT NULL on `title` and `created_at`.

#### Scenario: Insert without title is rejected
- **WHEN** an INSERT omits or nulls the `title` field
- **THEN** SQLite rejects the insert with a constraint error

#### Scenario: `completed` defaults to 0
- **WHEN** a goal is inserted without specifying `completed`
- **THEN** `completed` is stored as `0`

### Requirement: Create goal command
The `create_goal` Tauri command SHALL insert a new goal and return it with generated `id` and `created_at`.

#### Scenario: Valid title creates a goal
- **WHEN** `create_goal` is called with a non-empty title
- **THEN** a row is inserted and the command returns the new goal including its generated `id`

#### Scenario: Empty title is rejected
- **WHEN** `create_goal` is called with an empty or whitespace-only title
- **THEN** the command returns an error and no row is inserted

### Requirement: List goals command
The `get_goals` Tauri command SHALL return all goals ordered by `created_at` descending.

#### Scenario: Returns goals in recency order
- **WHEN** multiple goals exist and `get_goals` is called
- **THEN** the response is an array sorted newest-first

#### Scenario: Returns empty array when no goals exist
- **WHEN** the database has no goals and `get_goals` is called
- **THEN** the response is an empty array (not an error)

### Requirement: Update goal command
The `update_goal` Tauri command SHALL update the `completed` state (and optionally `title`/`description`) of an existing goal.

#### Scenario: Toggle completion to true
- **WHEN** `update_goal` is called with `completed: true` for an existing goal
- **THEN** the goal's `completed` field is set to `1` in the database

#### Scenario: Toggle completion to false
- **WHEN** `update_goal` is called with `completed: false` for a completed goal
- **THEN** the goal's `completed` field is set to `0`

#### Scenario: Update non-existent goal returns error
- **WHEN** `update_goal` is called with an `id` that does not exist
- **THEN** the command returns an error

### Requirement: Delete goal command
The `delete_goal` Tauri command SHALL permanently delete a goal by its ID.

#### Scenario: Delete existing goal succeeds
- **WHEN** `delete_goal` is called with a valid `id`
- **THEN** the row is removed from the database

#### Scenario: Delete non-existent goal returns error
- **WHEN** `delete_goal` is called with an `id` that does not exist
- **THEN** the command returns an error

### Requirement: Tauri SQL plugin is registered and permissioned
The Rust backend SHALL register `tauri_plugin_sql` in the builder, and the frontend window capability SHALL include the `sql:default` permission.

#### Scenario: Plugin and capability both present allows DB access
- **WHEN** `tauri_plugin_sql` is registered in Rust and `sql:default` is in `capabilities/default.json`
- **THEN** frontend `invoke()` calls to the CRUD commands succeed

### Requirement: All commands have Rust integration tests
Each CRUD command SHALL have at least one Rust test using an in-memory SQLite database.

#### Scenario: Tests run without a full Tauri app
- **WHEN** `cargo test` is run in `src-tauri/`
- **THEN** all command logic tests pass using an in-memory `":memory:"` database via `rusqlite` in `[dev-dependencies]`
