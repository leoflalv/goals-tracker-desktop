mod commands;
mod handlers;
mod migrations;
mod windows;

use std::sync::Mutex;

use rusqlite::Connection;
use tauri::Manager;
use tauri_plugin_sql::Builder as SqlBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            SqlBuilder::default()
                .add_migrations("sqlite:habits.db", migrations::all())
                .build(),
        )
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir)?;
            let db_path = app_data_dir.join("habits.db");
            let conn = Connection::open(&db_path)?;
            conn.execute_batch(migrations::migration_sql())?;
            app.manage(Mutex::new(conn));

            // Keep the Manage Window's state alive across closes so it can be
            // re-shown from the gear icon instead of rebuilt from scratch.
            if let Some(manage_window) = app.get_webview_window("manage") {
                let manage_window_handle = manage_window.clone();
                manage_window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = manage_window_handle.hide();
                    }
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            handlers::create_habit,
            handlers::get_habits,
            handlers::get_all_habits,
            handlers::update_habit,
            handlers::delete_habit,
            handlers::toggle_habit_completion,
            handlers::get_completions,
            windows::open_manage_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
