use tauri::Manager;

fn show_and_focus<R: tauri::Runtime>(app: &impl Manager<R>, label: &str) -> Result<(), String> {
    let window = app
        .get_webview_window(label)
        .ok_or_else(|| format!("{label} window not found"))?;
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn open_manage_window(app: tauri::AppHandle) -> Result<(), String> {
    show_and_focus(&app, "manage")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn mock_app() -> tauri::App<tauri::test::MockRuntime> {
        tauri::test::mock_builder()
            .build(tauri::test::mock_context(tauri::test::noop_assets()))
            .unwrap()
    }

    #[test]
    fn show_and_focus_succeeds_for_an_existing_window() {
        let app = mock_app();
        tauri::WebviewWindowBuilder::new(
            &app,
            "manage",
            tauri::WebviewUrl::App("index.html".into()),
        )
        .build()
        .unwrap();

        assert!(show_and_focus(&app, "manage").is_ok());
    }

    #[test]
    fn show_and_focus_errors_when_window_missing() {
        let app = mock_app();

        assert!(show_and_focus(&app, "manage").is_err());
    }
}
