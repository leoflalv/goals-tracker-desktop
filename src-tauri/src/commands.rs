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
