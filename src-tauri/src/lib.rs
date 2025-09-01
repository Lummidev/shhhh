use crate::database::migrations::run_migrations;

mod commands;
mod database;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if let Err(err) = run_migrations() {
        eprintln!("{}", err);
        return;
    }
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_page,
            commands::save,
            commands::get_all,
            commands::remove,
            commands::edit,
            commands::get,
            commands::add_likes,
            commands::remove_likes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
