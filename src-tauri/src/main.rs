#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Ideally, this should check if the user actually has and is currently using a Nvidia GPU instead of just checking for the nvidia-smi command,
// I just don't want to depend on any gpu crates that have way more features that I don't need right now.
// Check the issue below for more details.
// https://github.com/tauri-apps/tauri/issues/9394
#[cfg(target_os = "linux")]
fn disable_webkit_dmabuf_renderer() {
    use std::env;
    use std::process::Command;
    if !std::env::var("DONT_DISABLE_WEBKIT_DMABUF_RENDERER").is_err() {
        return;
    }
    if let Ok(status) = Command::new("nvidia-smi").status() {
        if status.success() {
            env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }
}

fn main() {
    disable_webkit_dmabuf_renderer();
    shhhh_lib::run()
}
