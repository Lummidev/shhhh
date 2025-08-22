import { useCallback, useRef } from "react";
import Post from "../../Types/Post";
import { PageContext } from "../../utils";
import PostComponent from "../Post/post.tsx";
import "./PostFeed.css";
export const PostFeed = ({
  posts,
  context,
  loading,
  error,
  hasMore,
  nextPage,
  onDelete,
  onRemoveLikes,
  onEdit,
  onLike,
  openPost,
}: {
  posts: Post[];
  context: PageContext;
  loading: boolean;
  error: string;
  hasMore: boolean;
  nextPage: () => void;
  onDelete: (id: string) => Promise<void>;
  onRemoveLikes: (id: string) => Promise<void>;
  onEdit: (id: string, currentContent: string) => Promise<void>;
  onLike: (id: string) => Promise<void>;
  openPost: (id: string) => void;
}) => {
  const paginationObserver = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) {
        return;
      }

      if (paginationObserver.current) {
        paginationObserver.current.disconnect();
      }

      paginationObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          nextPage();
        }
      });
      if (node) {
        paginationObserver.current.observe(node);
      }
    },
    [loading, hasMore],
  );
  return (
    <div className="postsContainer">
      {posts.map((post, index) => (
        <PostComponent
          key={post.id}
          refProp={posts.length === index + 1 ? lastPostElementRef : undefined}
          displayName={context.displayName}
          username={context.username}
          onDelete={onDelete}
          onRemoveLikes={onRemoveLikes}
          onEdit={onEdit}
          post={post}
          likes={post.likes}
          onLike={onLike}
          onClick={() => {
            openPost(post.id);
          }}
        />
      ))}
      {error ? <>{error.toString()}</> : loading ? <>Loading...</> : <></>}
    </div>
  );
};
