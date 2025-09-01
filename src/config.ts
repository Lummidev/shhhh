import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { ProfileEditData } from "./Types/ProfileUpdateData";
const configFileName = "config.json";
const getConfig = async () => {
  return JSON.parse(
    await readTextFile(configFileName, {
      baseDir: BaseDirectory.AppConfig,
    }),
  );
};
export const config = {
  username: async () => {
    return (await getConfig()).username;
  },
  displayName: async () => {
    return (await getConfig()).displayName;
  },
  bio: async () => {
    return (await getConfig()).bio;
  },
};
export const updateUserInfo = async (edit: ProfileEditData) => {
  let config = await getConfig();
  config.username = edit.username;
  config.displayName = edit.displayName;
  config.bio = edit.bio;
  writeTextFile(configFileName, JSON.stringify(config, null, " "), {
    baseDir: BaseDirectory.AppConfig,
  });
};
