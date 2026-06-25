use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Goal {
    pub id: i64,
    pub title: String,
    pub description: Option<String>,
    pub completed: bool,
    pub created_at: String,
}

pub fn create_goal(
    conn: &Connection,
    title: &str,
    description: Option<&str>,
) -> Result<Goal, String> {
    let title = title.trim();
    if title.is_empty() {
        return Err("title cannot be empty".into());
    }
    let created_at = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "INSERT INTO goals (title, description, created_at) VALUES (?1, ?2, ?3)",
        params![title, description, created_at],
    )
    .map_err(|e| e.to_string())?;
    Ok(Goal {
        id: conn.last_insert_rowid(),
        title: title.to_string(),
        description: description.map(str::to_string),
        completed: false,
        created_at,
    })
}

pub fn get_goals(conn: &Connection) -> Result<Vec<Goal>, String> {
    let mut stmt = conn
        .prepare(
            "SELECT id, title, description, completed, created_at \
             FROM goals ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;
    let goals: Result<Vec<Goal>, rusqlite::Error> = stmt
        .query_map([], |row| {
            Ok(Goal {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                completed: row.get::<_, i64>(3)? != 0,
                created_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect();
    goals.map_err(|e| e.to_string())
}

pub fn update_goal(
    conn: &Connection,
    id: i64,
    completed: bool,
    title: Option<&str>,
    description: Option<&str>,
) -> Result<(), String> {
    let rows = match (title, description) {
        (None, None) => conn.execute(
            "UPDATE goals SET completed = ?1 WHERE id = ?2",
            params![completed as i64, id],
        ),
        (Some(t), None) => conn.execute(
            "UPDATE goals SET completed = ?1, title = ?2 WHERE id = ?3",
            params![completed as i64, t, id],
        ),
        (None, Some(d)) => conn.execute(
            "UPDATE goals SET completed = ?1, description = ?2 WHERE id = ?3",
            params![completed as i64, d, id],
        ),
        (Some(t), Some(d)) => conn.execute(
            "UPDATE goals SET completed = ?1, title = ?2, description = ?3 WHERE id = ?4",
            params![completed as i64, t, d, id],
        ),
    }
    .map_err(|e| e.to_string())?;
    if rows == 0 {
        return Err(format!("goal {id} not found"));
    }
    Ok(())
}

pub fn delete_goal(conn: &Connection, id: i64) -> Result<(), String> {
    let rows = conn
        .execute("DELETE FROM goals WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    if rows == 0 {
        return Err(format!("goal {id} not found"));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use rusqlite::{params, Connection};

    use super::*;

    fn setup_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch(crate::migrations::migration_sql()).unwrap();
        conn
    }

    // 4.2 — create_goal
    #[test]
    fn create_goal_valid_title_inserts_row() {
        let conn = setup_db();
        let goal = create_goal(&conn, "Buy groceries", Some("at the market")).unwrap();
        assert_eq!(goal.title, "Buy groceries");
        assert_eq!(goal.description.as_deref(), Some("at the market"));
        assert!(!goal.completed);
        assert!(goal.id > 0);
    }

    #[test]
    fn create_goal_empty_title_returns_error_without_inserting() {
        let conn = setup_db();
        assert!(create_goal(&conn, "   ", None).is_err());
        assert!(get_goals(&conn).unwrap().is_empty());
    }

    // 4.3 — get_goals
    #[test]
    fn get_goals_returns_empty_when_no_goals() {
        let conn = setup_db();
        assert!(get_goals(&conn).unwrap().is_empty());
    }

    #[test]
    fn get_goals_returns_newest_first() {
        let conn = setup_db();
        conn.execute(
            "INSERT INTO goals (title, created_at) VALUES (?1, ?2)",
            params!["Older", "2024-01-01T00:00:00+00:00"],
        )
        .unwrap();
        conn.execute(
            "INSERT INTO goals (title, created_at) VALUES (?1, ?2)",
            params!["Newer", "2024-01-02T00:00:00+00:00"],
        )
        .unwrap();
        let goals = get_goals(&conn).unwrap();
        assert_eq!(goals.len(), 2);
        assert_eq!(goals[0].title, "Newer");
        assert_eq!(goals[1].title, "Older");
    }

    // 4.4 — update_goal
    #[test]
    fn update_goal_toggles_completed() {
        let conn = setup_db();
        let goal = create_goal(&conn, "Run 5k", None).unwrap();

        update_goal(&conn, goal.id, true, None, None).unwrap();
        assert!(get_goals(&conn).unwrap()[0].completed);

        update_goal(&conn, goal.id, false, None, None).unwrap();
        assert!(!get_goals(&conn).unwrap()[0].completed);
    }

    #[test]
    fn update_goal_returns_error_for_nonexistent_id() {
        let conn = setup_db();
        assert!(update_goal(&conn, 999, true, None, None).is_err());
    }

    // 4.5 — delete_goal
    #[test]
    fn delete_goal_removes_existing_row() {
        let conn = setup_db();
        let goal = create_goal(&conn, "Read book", None).unwrap();
        delete_goal(&conn, goal.id).unwrap();
        assert!(get_goals(&conn).unwrap().is_empty());
    }

    #[test]
    fn delete_goal_returns_error_for_nonexistent_id() {
        let conn = setup_db();
        assert!(delete_goal(&conn, 999).is_err());
    }
}
