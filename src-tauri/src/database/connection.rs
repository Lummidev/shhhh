use std::path::Path;
use std::path::PathBuf;

use diesel::prelude::*;
use directories::ProjectDirs;
pub fn database_url() -> String {
    let dirs = ProjectDirs::from("", "", "shhhh");
    let db_url: PathBuf = if let Some(dirs) = dirs {
        dirs.data_dir().join("database.db")
    } else {
        Path::new("database.db").into()
    };
    db_url
        .to_str()
        .expect("Path should be valid unicode")
        .to_owned()
}
pub fn establish_connection() -> SqliteConnection {
    let db_url = database_url();
    SqliteConnection::establish(&db_url)
        .unwrap_or_else(|err| panic!("Error connecting to {}: {}", db_url, err))
}
