use std::sync::Mutex;

use rusqlite::Connection;

use crate::commands;

#[tauri::command]
pub fn create_goal(
    state: tauri::State<'_, Mutex<Connection>>,
    title: String,
    description: Option<String>,
) -> Result<commands::Goal, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::create_goal(&conn, &title, description.as_deref())
}

#[tauri::command]
pub fn get_goals(
    state: tauri::State<'_, Mutex<Connection>>,
) -> Result<Vec<commands::Goal>, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::get_goals(&conn)
}

#[tauri::command]
pub fn update_goal(
    state: tauri::State<'_, Mutex<Connection>>,
    id: i64,
    completed: bool,
    title: Option<String>,
    description: Option<String>,
) -> Result<(), String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::update_goal(&conn, id, completed, title.as_deref(), description.as_deref())
}

#[tauri::command]
pub fn delete_goal(state: tauri::State<'_, Mutex<Connection>>, id: i64) -> Result<(), String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::delete_goal(&conn, id)
}
