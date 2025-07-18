// @generated automatically by Diesel CLI.

diesel::table! {
    posts (id) {
        id -> Text,
        content -> Text,
        created_at -> BigInt,
        updated_at -> BigInt,
    }
}
