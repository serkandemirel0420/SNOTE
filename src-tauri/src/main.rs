#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Menu, Submenu, MenuItem};
use tauri_plugin_sql::TauriSql;

fn main() {
  
  let menu = Menu::new()
    .add_submenu(Submenu::new(
      "AppName",
      Menu::new()
        .add_native_item(MenuItem::Services)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit),
    ))
    .add_submenu(Submenu::new(
      "Menu",
      Menu::new()
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::SelectAll)
    ));
    
  

  tauri::Builder::default()
    .plugin(TauriSql::default())
    .menu(menu)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
