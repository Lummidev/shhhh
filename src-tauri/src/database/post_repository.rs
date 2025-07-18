use crate::database::{connection::establish_connection, models::Post};
use chrono::Utc;
use diesel::prelude::*;
use uuid::Uuid;
pub fn get(post_id: String) -> Option<Post> {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    posts
        .filter(id.eq(post_id))
        .select(Post::as_select())
        .first(connection)
        .optional()
        .expect("Error loading posts")
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
pub fn get_many(amount: u32, offset: u32) -> Vec<Post> {
    use crate::database::schema::posts::dsl::*;
    let connection = &mut establish_connection();
    posts
        .order(created_at.desc())
        .select(Post::as_select())
        .limit(amount.into())
        .offset(offset.into())
        .load(connection)
        .expect("Error loading posts")
}
pub fn save(content: String) -> Post {
    use crate::database::schema::posts;
    let now = Utc::now().timestamp();
    let new_uuid = Uuid::new_v4();
    let connection = &mut establish_connection();
    let post = Post {
        id: new_uuid.to_string(),
        content,
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
