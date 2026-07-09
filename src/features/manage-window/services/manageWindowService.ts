import { invoke } from "@tauri-apps/api/core";

export async function openManageWindow(): Promise<void> {
  await invoke("open_manage_window");
}
