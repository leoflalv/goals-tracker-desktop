use std::sync::Mutex;

use rusqlite::Connection;
use tauri::{AppHandle, Emitter};

use crate::commands;

fn notify_habits_changed(app: &AppHandle) {
    let _ = app.emit("habits:changed", ());
}

#[tauri::command]
pub fn create_habit(
    state: tauri::State<'_, Mutex<Connection>>,
    app: AppHandle,
    name: String,
    color: String,
) -> Result<commands::Habit, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    let habit = commands::create_habit(&conn, &name, &color)?;
    notify_habits_changed(&app);
    Ok(habit)
}

#[tauri::command]
pub fn get_habits(
    state: tauri::State<'_, Mutex<Connection>>,
) -> Result<Vec<commands::Habit>, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::get_habits(&conn)
}

#[tauri::command]
pub fn get_all_habits(
    state: tauri::State<'_, Mutex<Connection>>,
) -> Result<Vec<commands::Habit>, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::get_all_habits(&conn)
}

#[tauri::command]
pub fn update_habit(
    state: tauri::State<'_, Mutex<Connection>>,
    app: AppHandle,
    id: String,
    name: Option<String>,
    color: Option<String>,
) -> Result<commands::Habit, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    let habit = commands::update_habit(&conn, &id, name.as_deref(), color.as_deref())?;
    notify_habits_changed(&app);
    Ok(habit)
}

#[tauri::command]
pub fn delete_habit(
    state: tauri::State<'_, Mutex<Connection>>,
    app: AppHandle,
    id: String,
) -> Result<(), String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::delete_habit(&conn, &id)?;
    notify_habits_changed(&app);
    Ok(())
}

#[tauri::command]
pub fn toggle_habit_completion(
    state: tauri::State<'_, Mutex<Connection>>,
    app: AppHandle,
    habit_id: String,
    date: String,
) -> Result<commands::ToggleResult, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    let result = commands::toggle_habit_completion(&conn, &habit_id, &date)?;
    notify_habits_changed(&app);
    Ok(result)
}

#[tauri::command]
pub fn get_completions(
    state: tauri::State<'_, Mutex<Connection>>,
    from: String,
    to: String,
) -> Result<Vec<commands::HabitCompletion>, String> {
    let conn = state.lock().map_err(|e| e.to_string())?;
    commands::get_completions(&conn, &from, &to)
}
