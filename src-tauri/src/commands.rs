use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Habit {
    pub id: String,
    pub name: String,
    pub color: String,
    pub sort_order: i64,
    pub created_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HabitCompletion {
    pub id: String,
    pub habit_id: String,
    pub completed_on: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ToggleResult {
    pub completed: bool,
}

fn next_sort_order(conn: &Connection) -> Result<i64, String> {
    conn.query_row("SELECT COALESCE(MAX(sort_order), -1) + 1 FROM habits", [], |row| {
        row.get(0)
    })
    .map_err(|e| e.to_string())
}

pub fn create_habit(conn: &Connection, name: &str, color: &str) -> Result<Habit, String> {
    let name = name.trim();
    if name.is_empty() {
        return Err("name cannot be empty".into());
    }
    if color.trim().is_empty() {
        return Err("color cannot be empty".into());
    }
    let id = Uuid::new_v4().to_string();
    let created_at = chrono::Utc::now().to_rfc3339();
    let sort_order = next_sort_order(conn)?;
    conn.execute(
        "INSERT INTO habits (id, name, color, sort_order, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![id, name, color, sort_order, created_at],
    )
    .map_err(|e| e.to_string())?;
    Ok(Habit {
        id,
        name: name.to_string(),
        color: color.to_string(),
        sort_order,
        created_at,
        deleted_at: None,
    })
}

pub fn get_habits(conn: &Connection) -> Result<Vec<Habit>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, name, color, sort_order, created_at, deleted_at \
             FROM habits WHERE deleted_at IS NULL ORDER BY sort_order",
        )
        .map_err(|e| e.to_string())?;
    let habits: Result<Vec<Habit>, rusqlite::Error> = stmt
        .query_map([], |row| {
            Ok(Habit {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                sort_order: row.get(3)?,
                created_at: row.get(4)?,
                deleted_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect();
    habits.map_err(|e| e.to_string())
}

/// Includes soft-deleted habits, so History can still label/color their past completions.
pub fn get_all_habits(conn: &Connection) -> Result<Vec<Habit>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, name, color, sort_order, created_at, deleted_at \
             FROM habits ORDER BY sort_order",
        )
        .map_err(|e| e.to_string())?;
    let habits: Result<Vec<Habit>, rusqlite::Error> = stmt
        .query_map([], |row| {
            Ok(Habit {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                sort_order: row.get(3)?,
                created_at: row.get(4)?,
                deleted_at: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect();
    habits.map_err(|e| e.to_string())
}

fn get_habit(conn: &Connection, id: &str) -> Result<Habit, String> {
    conn.query_row(
        "SELECT id, name, color, sort_order, created_at, deleted_at FROM habits WHERE id = ?1",
        params![id],
        |row| {
            Ok(Habit {
                id: row.get(0)?,
                name: row.get(1)?,
                color: row.get(2)?,
                sort_order: row.get(3)?,
                created_at: row.get(4)?,
                deleted_at: row.get(5)?,
            })
        },
    )
    .map_err(|_| format!("habit {id} not found"))
}

pub fn update_habit(
    conn: &Connection,
    id: &str,
    name: Option<&str>,
    color: Option<&str>,
) -> Result<Habit, String> {
    // Ensure the habit exists before (and after a no-op update) so unknown ids always error.
    get_habit(conn, id)?;

    match (name, color) {
        (None, None) => {}
        (Some(n), None) => {
            conn.execute("UPDATE habits SET name = ?1 WHERE id = ?2", params![n, id])
                .map_err(|e| e.to_string())?;
        }
        (None, Some(c)) => {
            conn.execute("UPDATE habits SET color = ?1 WHERE id = ?2", params![c, id])
                .map_err(|e| e.to_string())?;
        }
        (Some(n), Some(c)) => {
            conn.execute(
                "UPDATE habits SET name = ?1, color = ?2 WHERE id = ?3",
                params![n, c, id],
            )
            .map_err(|e| e.to_string())?;
        }
    }
    get_habit(conn, id)
}

pub fn delete_habit(conn: &Connection, id: &str) -> Result<(), String> {
    let deleted_at = chrono::Utc::now().to_rfc3339();
    let rows = conn
        .execute(
            "UPDATE habits SET deleted_at = ?1 WHERE id = ?2",
            params![deleted_at, id],
        )
        .map_err(|e| e.to_string())?;
    if rows == 0 {
        return Err(format!("habit {id} not found"));
    }
    Ok(())
}

pub fn toggle_habit_completion(
    conn: &Connection,
    habit_id: &str,
    date: &str,
) -> Result<ToggleResult, String> {
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM habit_completions WHERE habit_id = ?1 AND completed_on = ?2",
            params![habit_id, date],
            |row| row.get(0),
        )
        .ok();

    match existing {
        Some(completion_id) => {
            conn.execute(
                "DELETE FROM habit_completions WHERE id = ?1",
                params![completion_id],
            )
            .map_err(|e| e.to_string())?;
            Ok(ToggleResult { completed: false })
        }
        None => {
            let id = Uuid::new_v4().to_string();
            conn.execute(
                "INSERT INTO habit_completions (id, habit_id, completed_on) VALUES (?1, ?2, ?3)",
                params![id, habit_id, date],
            )
            .map_err(|e| e.to_string())?;
            Ok(ToggleResult { completed: true })
        }
    }
}

pub fn get_completions(
    conn: &Connection,
    from: &str,
    to: &str,
) -> Result<Vec<HabitCompletion>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, habit_id, completed_on FROM habit_completions \
             WHERE completed_on BETWEEN ?1 AND ?2 ORDER BY completed_on",
        )
        .map_err(|e| e.to_string())?;
    let completions: Result<Vec<HabitCompletion>, rusqlite::Error> = stmt
        .query_map(params![from, to], |row| {
            Ok(HabitCompletion {
                id: row.get(0)?,
                habit_id: row.get(1)?,
                completed_on: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect();
    completions.map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(crate::migrations::migration_sql()).unwrap();
        conn
    }

    // create_habit
    #[test]
    fn create_habit_valid_inputs_inserts_row() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Morning workout", "#ff0000").unwrap();
        assert_eq!(habit.name, "Morning workout");
        assert_eq!(habit.color, "#ff0000");
        assert_eq!(habit.sort_order, 0);
        assert!(habit.deleted_at.is_none());
    }

    #[test]
    fn create_habit_assigns_increasing_sort_order() {
        let conn = setup_db();
        let first = create_habit(&conn, "First", "#111111").unwrap();
        let second = create_habit(&conn, "Second", "#222222").unwrap();
        assert_eq!(first.sort_order, 0);
        assert_eq!(second.sort_order, 1);
    }

    #[test]
    fn create_habit_empty_name_returns_error() {
        let conn = setup_db();
        assert!(create_habit(&conn, "   ", "#ff0000").is_err());
        assert!(get_habits(&conn).unwrap().is_empty());
    }

    // get_habits
    #[test]
    fn get_habits_returns_empty_when_none() {
        let conn = setup_db();
        assert!(get_habits(&conn).unwrap().is_empty());
    }

    #[test]
    fn get_habits_excludes_soft_deleted() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Read", "#00ff00").unwrap();
        delete_habit(&conn, &habit.id).unwrap();
        assert!(get_habits(&conn).unwrap().is_empty());
    }

    // get_all_habits
    #[test]
    fn get_all_habits_includes_soft_deleted() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Read", "#00ff00").unwrap();
        delete_habit(&conn, &habit.id).unwrap();

        let all = get_all_habits(&conn).unwrap();
        assert_eq!(all.len(), 1);
        assert!(all[0].deleted_at.is_some());
    }

    // update_habit
    #[test]
    fn update_habit_changes_name_and_color() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Read", "#00ff00").unwrap();
        let updated = update_habit(&conn, &habit.id, Some("Read daily"), Some("#0000ff")).unwrap();
        assert_eq!(updated.name, "Read daily");
        assert_eq!(updated.color, "#0000ff");
    }

    #[test]
    fn update_habit_unknown_id_returns_error() {
        let conn = setup_db();
        assert!(update_habit(&conn, "does-not-exist", Some("X"), None).is_err());
    }

    // delete_habit
    #[test]
    fn delete_habit_preserves_completions() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Cold shower", "#00aaff").unwrap();
        toggle_habit_completion(&conn, &habit.id, "2026-07-01").unwrap();
        delete_habit(&conn, &habit.id).unwrap();
        let completions = get_completions(&conn, "2026-07-01", "2026-07-01").unwrap();
        assert_eq!(completions.len(), 1);
        assert_eq!(completions[0].habit_id, habit.id);
    }

    #[test]
    fn delete_habit_unknown_id_returns_error() {
        let conn = setup_db();
        assert!(delete_habit(&conn, "does-not-exist").is_err());
    }

    // toggle_habit_completion
    #[test]
    fn toggle_habit_completion_marks_done_then_undone() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Meditate", "#abcdef").unwrap();

        let done = toggle_habit_completion(&conn, &habit.id, "2026-07-08").unwrap();
        assert!(done.completed);
        assert_eq!(
            get_completions(&conn, "2026-07-08", "2026-07-08").unwrap().len(),
            1
        );

        let undone = toggle_habit_completion(&conn, &habit.id, "2026-07-08").unwrap();
        assert!(!undone.completed);
        assert_eq!(
            get_completions(&conn, "2026-07-08", "2026-07-08").unwrap().len(),
            0
        );
    }

    // get_completions
    #[test]
    fn get_completions_filters_by_inclusive_range() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Stretch", "#123123").unwrap();
        toggle_habit_completion(&conn, &habit.id, "2026-07-01").unwrap();
        toggle_habit_completion(&conn, &habit.id, "2026-07-05").unwrap();
        toggle_habit_completion(&conn, &habit.id, "2026-07-10").unwrap();

        let in_range = get_completions(&conn, "2026-07-01", "2026-07-05").unwrap();
        assert_eq!(in_range.len(), 2);
    }

    #[test]
    fn get_completions_returns_empty_outside_range() {
        let conn = setup_db();
        let habit = create_habit(&conn, "Stretch", "#123123").unwrap();
        toggle_habit_completion(&conn, &habit.id, "2026-07-01").unwrap();

        let out_of_range = get_completions(&conn, "2026-08-01", "2026-08-31").unwrap();
        assert!(out_of_range.is_empty());
    }
}
