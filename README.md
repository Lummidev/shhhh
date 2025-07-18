# Shhhh

Offline social media-like app.

Have you ever wanted to write stuff somewhere that isn't necessarily meant for other people to see? That's a diary. Have you ever wanted to have images, URLs and stuff like that in your diary? That's your notes app. Ok, but maybe you like the look and feel of micro-blogging and wish there was something like that but private and that resides only on your devices? That's the idea.

## (Planned) Features:

- Offline micro-blogging experience (like Twitter, Bluesky, Mastodon, etc)
- Change your profile picture, username, and @ to anything you want!
- Encrypt your "posts" and data with a password.
- Backup your data.

## Development

_Shhhh_ is currently being developed with [Tauri](https://tauri.app/) and [React](https://react.dev/), so you need [Rust](https://www.rust-lang.org/) and [Node.js](https://nodejs.org/) installed to build and run it in development mode.

To get started, open up a shell in the project's root folder and run:

```sh
npm install
```

To build an executable (or an installer/bundle), run:

```sh
npm run tauri build
```

And everything you need will be placed at `src-tauri/target/release/`.
Or, to just see it in action, run:

```sh
npm run tauri dev
```

Right now, when running the application, the environment variable `DATABASE_URL` needs to where you want your SQLite database to exist for everything to work correctly. This will be fixed soon. So, something like this, depending on your shell:

```sh
DATABASE_URL=/path/to/your/database.db npm run tauri dev
```

Give it a minute (or more) for the first build and the app will open.

# Information and Acknowledgements

This is a toy project. It started as a joke, then I talked about it with my friends, one of which suggested the name "Shhhh" (it's a pun on how we pronnounce "X")( :brazil: obrigado Jean), and realized this might actually be _fun_ to develop.

Currently, the colors I'm using are from [Catppuccin](https://catppuccin.com/), primarily because it's an awesome color scheme, and secondly because I also use it in my editor. Just sticking to what I know for now.
