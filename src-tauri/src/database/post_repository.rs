use crate::database::{connection::establish_connection, models::Post};
use chrono::Utc;
use diesel::{dsl::count_star, prelude::*};
use uuid::Uuid;
pub fn get(post_id: String) -> Result<Option<Post>, diesel::result::Error> {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    posts
        .filter(id.eq(post_id))
        .select(Post::as_select())
        .first(connection)
        .optional()
}
pub fn get_all() -> Vec<Post> {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    posts
        .order(created_at.desc())
        .select(Post::as_select())
        .load(connection)
        .expect("Error loading posts")
}
pub fn get_page(amount: u32, offset: u32) -> Result<Vec<Post>, diesel::result::Error> {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    posts
        .order(created_at.desc())
        .select(Post::as_select())
        .limit(amount.into())
        .offset(offset.into())
        .load(connection)
}
pub fn count_total() -> Result<u32, diesel::result::Error> {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    posts
        .select(count_star())
        .first(connection)
        .map(|x: i64| x as u32)
}
pub fn save(content: String) -> Post {
    use crate::database::schema::posts;
    let now = Utc::now().timestamp();
    let new_uuid = Uuid::new_v4();
    let connection = &mut establish_connection();
    let post = Post {
        id: new_uuid.to_string(),
        content,
        likes: 0,
        created_at: now,
        updated_at: now,
    };
    diesel::insert_into(posts::table)
        .values(post)
        .returning(Post::as_returning())
        .get_result(connection)
        .expect("Error saving post")
}
pub fn edit(id: String, new_content: String) -> Post {
    use crate::database::schema::posts::dsl::{content, posts, updated_at};
    let connection = &mut establish_connection();
    let now = Utc::now().timestamp();

    diesel::update(posts.find(id))
        .set((content.eq(new_content), updated_at.eq(now)))
        .returning(Post::as_returning())
        .get_result(connection)
        .expect("Error updating post")
}

pub fn remove(delete_id: String) {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    diesel::delete(posts.filter(id.eq(delete_id)))
        .execute(connection)
        .expect("Error deleting post");
}

pub fn add_likes(liked_post_id: String, amount: i32) -> Result<Post, diesel::result::Error> {
    use crate::database::schema::posts::dsl::{likes, posts};
    let connection = &mut establish_connection();
    diesel::update(posts.find(liked_post_id))
        .set(likes.eq(likes + amount))
        .returning(Post::as_returning())
        .get_result(connection)
}
pub fn remove_likes(post_id: String) -> Result<Post, diesel::result::Error> {
    use crate::database::schema::posts::dsl::{likes, posts};
    let connection = &mut establish_connection();
    diesel::update(posts.find(post_id))
        .set(likes.eq(0))
        .returning(Post::as_returning())
        .get_result(connection)
}
