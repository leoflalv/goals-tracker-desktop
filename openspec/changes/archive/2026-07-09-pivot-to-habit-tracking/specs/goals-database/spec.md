## REMOVED Requirements

### Requirement: SQLite database initializes on startup
**Reason**: Replaced by `habit-database`, which initializes the same SQLite connection with the new habits/habit_completions schema.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: Goals table enforces required fields
**Reason**: The `goals` table is replaced by `habits` and `habit_completions` tables, specified in `habit-database`.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: Create goal command
**Reason**: Replaced by the `create_habit` command in `habit-database`.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: List goals command
**Reason**: Replaced by the `get_habits` command in `habit-database`.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: Update goal command
**Reason**: Replaced by the `update_habit` command in `habit-database`.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: Delete goal command
**Reason**: Replaced by the soft-delete `delete_habit` command in `habit-database`.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: Tauri SQL plugin is registered and permissioned
**Reason**: The plugin registration is retained but re-specified in `habit-database` against the new schema.
**Migration**: None — pre-release pivot, no existing data is preserved.

### Requirement: All commands have Rust integration tests
**Reason**: Re-specified in `habit-database` against the new habit + completion commands.
**Migration**: None — pre-release pivot, no existing data is preserved.
