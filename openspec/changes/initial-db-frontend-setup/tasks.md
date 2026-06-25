## 1. Dependencies

- [x] 1.1 Add `tauri-plugin-sql` with the `sqlite` feature to `src-tauri/Cargo.toml` dependencies
- [x] 1.2 Add `rusqlite` (with `bundled` feature) to `src-tauri/Cargo.toml` — in `[dependencies]` (not `[dev-dependencies]`) since production command logic in `commands.rs` uses it directly
- [x] 1.3 Add `sql:default` permission to `src-tauri/capabilities/default.json`

## 2. Database Schema & Plugin Registration

- [x] 2.1 Register `tauri_plugin_sql` in `lib.rs` with migrations loaded from `src/migrations.rs` — version 1 creates the `goals` table (`id`, `title`, `description`, `completed`, `created_at`)
- [x] 2.2 Remove the placeholder `greet` command from `lib.rs`

## 3. Rust CRUD Commands

- [x] 3.1 Implement `create_goal` in `commands.rs` — validate non-empty title, insert row with current UTC timestamp as `created_at`, return the new goal with its generated `id`
- [x] 3.2 Implement `get_goals` in `commands.rs` — query all rows ordered by `created_at` DESC, return as a Vec
- [x] 3.3 Implement `update_goal` in `commands.rs` — update `completed` (and optionally `title`/`description`) by `id`; return error if row not found
- [x] 3.4 Implement `delete_goal` in `commands.rs` — delete row by `id`; return error if row not found
- [x] 3.5 Register all four Tauri command wrappers from `handlers.rs` in `tauri::generate_handler![]`

## 4. Rust Tests

- [ ] 4.1 Write a test helper that creates an in-memory SQLite database and runs the schema migration
- [ ] 4.2 Test `create_goal` — valid title inserts a row; empty title returns an error without inserting
- [ ] 4.3 Test `get_goals` — returns empty vec when no goals; returns goals newest-first when multiple exist
- [ ] 4.4 Test `update_goal` — toggles `completed` to true then false; returns error for non-existent id
- [ ] 4.5 Test `delete_goal` — removes existing row; returns error for non-existent id
