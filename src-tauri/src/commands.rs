use serde::Serialize;

use crate::database::{models::Post, post_repository};
#[derive(Serialize)]
pub struct Page {
    posts: Vec<Post>,
    total: u32,
}
#[tauri::command]
pub fn get_page(amount_per_page: u32, page: u32) -> Result<Page, String> {
    if page == 0 {
        return Err("Pages start at 1".to_string());
    }
    if amount_per_page == 0 {
        return Err("0 posts per page is not allowed".to_string());
    }
    let total = match post_repository::count_total() {
        Err(e) => return Err(e.to_string()),
        Ok(count) => count,
    };
    if total == 0 {
        return Ok(Page {
            posts: vec![],
            total: 0,
        });
    }
    let offset = (page - 1) * amount_per_page;
    if offset >= total {
        return Err(format!(
            "Tried to get the {}th post when there were {} total",
            offset + 1,
            total
        ));
    }
    let posts = match post_repository::get_page(amount_per_page, offset) {
        Err(e) => return Err(e.to_string()),
        Ok(posts) => posts,
    };
    Ok(Page { posts, total })
}

#[tauri::command]
pub fn get(id: String) -> Result<Option<Post>, String> {
    match post_repository::get(id) {
        Ok(post) => Ok(post),
        Err(e) => Err(e.to_string()),
    }
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
#[tauri::command]
pub fn add_likes(id: String, amount: i32) -> Result<Post, String> {
    match post_repository::add_likes(id, amount) {
        Ok(post) => Ok(post),
        Err(e) => Err(e.to_string()),
    }
}
#[tauri::command]
pub fn remove_likes(id: String) -> Result<Post, String> {
    match post_repository::remove_likes(id) {
        Ok(post) => Ok(post),
        Err(e) => Err(e.to_string()),
    }
}
