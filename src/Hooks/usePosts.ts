import { useEffect, useState } from "react";
import Post from "../Types/Post";
import backend from "../backend";
export const usePosts = (page: number, amountPerPage: number = 6) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<any>();
  async function savePost(newPostContent: string) {
    let added_post = await backend.posts.save(newPostContent);
    setPosts([added_post, ...posts]);
  }
  const removePost = async (id: string) => {
    await backend.posts.remove(id);
    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);
  };
  const _updatePostLocally = (updatedPost: Post) => {
    let edited_posts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post,
    );
    setPosts(edited_posts);
  };
  const editPost = async (id: string, newContent: string) => {
    let savedPost = await backend.posts.edit(id, newContent);
    _updatePostLocally(savedPost);
  };

  const removeLikes = async (id: string) => {
    let post: Post = await backend.posts.removeLikes(id);
    _updatePostLocally(post);
  };
  const addLikes = async (id: string, amount: number) => {
    let updatedPost = await backend.posts.addLikes(id, amount);
    _updatePostLocally(updatedPost);
  };
  const addLikesLocally = (id: string, amount: number) => {
    let postToUpdate = posts.filter((post) => post.id === id).shift();
    if (postToUpdate) {
      postToUpdate.likes += amount;
      _updatePostLocally(postToUpdate);
    }
  };
  useEffect(() => {
    const getPage = async () => {
      setLoading(true);
      setError(null);
      try {
        let page_response = await backend.posts.getPage(page, amountPerPage);
        const newPosts = [...posts, ...page_response.posts];
        setPosts(newPosts);
        setHasMore(newPosts.length < page_response.total);
        setLoading(false);
      } catch (e) {
        setError(e);
      }
    };
    if (page <= 0 || amountPerPage <= 0 || !hasMore) {
      return;
    }
    getPage();
  }, [page, amountPerPage]);
  return {
    posts,
    loading,
    hasMore,
    error,
    savePost,
    removePost,
    editPost,
    removeLikes,
    addLikes,
    addLikesLocally,
  };
};
