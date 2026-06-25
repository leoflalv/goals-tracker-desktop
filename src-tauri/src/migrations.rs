use tauri_plugin_sql::{Migration, MigrationKind};

const GOALS_TABLE_SQL: &str = "CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);";

pub fn all() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_goals_table",
        sql: GOALS_TABLE_SQL,
        kind: MigrationKind::Up,
    }]
}

pub fn migration_sql() -> &'static str {
    GOALS_TABLE_SQL
}
