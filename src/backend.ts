import { invoke } from "@tauri-apps/api/core";
import Post from "./Types/Post";
interface Page {
  posts: Post[];
  total: number;
}
export default {
  posts: {
    get: async (id: string): Promise<Post | undefined> => {
      return (await invoke("get", { id })) as Post | undefined;
    },
    _get_all: async () => {
      return (await invoke("get_all")) as Post[];
    },
    getPage: async (page: number, amountPerPage: number = 6): Promise<Page> => {
      return (await invoke("get_page", { amountPerPage, page })) as Page;
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
    addLikes: async (id: string, amount: number) => {
      return (await invoke("add_likes", { id, amount })) as Post;
    },
    removeLikes: async (id: string) => {
      return (await invoke("remove_likes", { id })) as Post;
    },
  },
};
