## Why

The app is currently a bare scaffold with no real functionality. This change bootstraps the persistent data layer so goals can be stored and retrieved across sessions.

## What Changes

- Add `tauri-plugin-sql` (SQLite) to the Rust backend with a migration that creates the `goals` table
- Implement Tauri commands for goals CRUD (`create_goal`, `get_goals`, `update_goal`, `delete_goal`)
- Wire the Tauri SQL plugin capability and permissions in `default.json`
- Add Rust integration tests for all commands

## Capabilities

### New Capabilities

- `goals-database`: SQLite database setup via `tauri-plugin-sql`, including schema migration for the `goals` table and Rust CRUD commands

### Modified Capabilities

<!-- none — this is the first functional code in the project -->

## Impact

- **Rust**: `Cargo.toml` gains `tauri-plugin-sql` with SQLite feature and `[dev-dependencies]` for testing; `lib.rs` gains four commands and plugin registration
- **Tauri config**: `capabilities/default.json` needs `sql:default` permission
- No frontend changes in this change
