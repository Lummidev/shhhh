import { invoke } from "@tauri-apps/api/core";
import Post from "./Types/Post";

export default {
  posts: {
    get: async (id: string): Promise<Post | undefined> => {
      return (await invoke("get", { id })) as Post | undefined;
    },
    _get_all: async () => {
      return (await invoke("get_all")) as Post[];
    },
    get_many: async (amount: number, offset: number): Promise<Post[]> => {
      return (await invoke("get_many", { amount, offset })) as Post[];
    },
    save: async (content: String): Promise<Post> => {
      return (await invoke("save", { content })) as Post;
    },
    edit: async (id: string, newContent: string) => {
      return (await invoke("edit", { id, newContent })) as Post;
    },
    remove: async (deleteId: string) => {
      await invoke("remove", { deleteId });
    },
  },
};
