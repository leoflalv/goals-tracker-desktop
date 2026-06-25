## Context

The goals-tracker-desktop app is a Tauri 2 widget. The backend is Rust; there is currently no database and no real commands — only the scaffold. This change adds the full Rust data layer.

## Goals / Non-Goals

**Goals:**
- Establish a persistent SQLite database for goals via `tauri-plugin-sql`
- Expose goals CRUD as Tauri commands callable from the frontend
- Test all commands with Rust integration tests

**Non-Goals:**
- Any frontend or UI work (deferred to a separate change)
- Authentication or multi-user support
- Categories, tags, or priority levels

## Decisions

### D1: SQLite via `tauri-plugin-sql` (not a custom Rust SQLite crate)

`tauri-plugin-sql` is the first-party Tauri plugin for database access. It handles connection management and integrates directly with Tauri's builder. Alternative considered: `rusqlite` directly — rejected because `tauri-plugin-sql` provides built-in migration versioning and is the idiomatic Tauri choice.

### D2: Programmatic migrations in a dedicated `migrations.rs` module

Migrations are defined in `src-tauri/src/migrations.rs` and exposed via a `migrations::all()` function called from `lib.rs`. This uses `MigrationKind::Up` structs registered with `tauri_plugin_sql::Builder::add_migrations`. Keeping them in a separate file prevents `lib.rs` from growing with inline SQL as the schema evolves. Alternative considered: migration config in `tauri.conf.json` — rejected because keeping migrations in Rust makes the schema co-located with the commands that use it.

### D3: CRUD commands in Rust, not direct JS SQL

All data access goes through named Tauri commands (`create_goal`, `get_goals`, `update_goal`, `delete_goal`). The frontend never writes raw SQL. This enforces a clean boundary and makes the backend independently testable.

### D4: Two-layer Rust module structure for testability

Business logic lives in `src/commands.rs` as plain functions accepting `&rusqlite::Connection` — no Tauri types. Tauri-specific glue (state extraction, `#[tauri::command]`) lives in `src/handlers.rs`, which delegates to `commands`. `lib.rs` only contains `run()` and registers `handlers::*` in `generate_handler!`. Tests live in `commands.rs` as a `#[cfg(test)]` module: a `setup_db()` helper opens an in-memory rusqlite connection and applies the migration SQL, then each test calls the pure functions directly. No Tauri runtime is needed. `rusqlite` is in `[dependencies]` (not just `[dev-dependencies]`) because the command logic in production also relies on it.

## Risks / Trade-offs

- [Migration versioning] If the schema changes in a future change and the migration version isn't incremented, the plugin won't run the new migration on existing installs → Mitigation: always increment the migration version; document this convention.
- [Plugin capability] `sql:default` must be in `capabilities/default.json` or frontend calls will be rejected → Mitigation: covered explicitly in tasks.

## Migration Plan

No existing users or data. The SQLite file is created fresh on first launch by the plugin's migration runner.
