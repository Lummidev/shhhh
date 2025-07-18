use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::database::schema::posts;

#[derive(Queryable, Selectable, Insertable, Serialize, Deserialize)]
#[diesel(table_name = posts)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Post {
    pub id: String,
    pub content: String,
    pub created_at: i64,
    pub updated_at: i64,
}
