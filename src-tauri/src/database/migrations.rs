use std::error::Error;

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

use crate::database::connection;
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

pub fn run_migrations() -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    let mut conn = connection::establish_connection();
    conn.run_pending_migrations(MIGRATIONS)?;

    Ok(())
}
