use tauri_plugin_sql::{Migration, MigrationKind};

const HABITS_SCHEMA_SQL: &str = "CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    deleted_at TEXT
);
CREATE TABLE IF NOT EXISTS habit_completions (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL REFERENCES habits(id),
    completed_on TEXT NOT NULL,
    UNIQUE(habit_id, completed_on)
);";

pub fn all() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_habits_tables",
        sql: HABITS_SCHEMA_SQL,
        kind: MigrationKind::Up,
    }]
}

pub fn migration_sql() -> &'static str {
    HABITS_SCHEMA_SQL
}
