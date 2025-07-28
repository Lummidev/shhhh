use crate::database::{models::Post, post_repository};

#[tauri::command]
pub fn get_many(amount: u32, offset: u32) -> Vec<Post> {
    post_repository::get_many(amount, offset)
}

#[tauri::command]
pub fn get(post_id: String) -> Option<Post> {
    post_repository::get(post_id)
}
#[tauri::command]
pub fn save(content: String) -> Post {
    post_repository::save(content.trim().to_owned())
}
#[tauri::command]
pub fn get_all() -> Vec<Post> {
    post_repository::get_all()
}
#[tauri::command]
pub fn remove(delete_id: String) {
    post_repository::remove(delete_id);
}
#[tauri::command]
pub fn edit(id: String, new_content: String) -> Post {
    post_repository::edit(id, new_content.trim().to_owned())
}
