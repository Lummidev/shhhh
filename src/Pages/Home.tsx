import { useCallback, useEffect, useRef, useState } from "react";
import PostComponent from "../Components/Post/post";
import { usePosts } from "../Hooks/usePosts";
import EditPostModal from "../Components/PostModal/EditPostModal";
import { debounceLikesEffect, PageContext } from "../utils";

export const Home = ({
  context,
  openPost,
}: {
  context: PageContext;
  openPost: (id: string) => void;
}) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [textToEdit, setTextToEdit] = useState("");
  const [idToEdit, setIdToEdit] = useState("");
  const [likeActions, setLikeActions] = useState<{ likedPostID: string }[]>([]);
  const [page, setPage] = useState(1);
  const paginationObserver = useRef<IntersectionObserver | null>(null);
  const {
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
  } = usePosts(page);

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
          setPage(page + 1);
        }
      });
      if (node) {
        paginationObserver.current.observe(node);
      }
    },
    [loading, hasMore],
  );

  const addPost = async () => {
    await savePost(newPostContent);
    setNewPostContent("");
  };
  const handleDelete = async (id: string) => {
    removePost(id);
  };

  const handleRemoveLikes = async (id: string) => {
    removeLikes(id);
  };
  const launchModal = async (id: string, startText: string) => {
    setTextToEdit(startText);
    setIdToEdit(id);
    setModalVisible(true);
  };
  const handleEdit = async (id: string, newContent: string) => {
    editPost(id, newContent);
  };

  const handlePostLike = async (id: string) => {
    setLikeActions([...likeActions, { likedPostID: id }]);
    addLikesLocally(id, 1);
  };
  // Debounce liking posts to save disk I/O
  useEffect(
    debounceLikesEffect({
      likeActions,
      clearLikeActions: () => {
        setLikeActions([]);
      },
      sendLikes: async (id, amount) => {
        await addLikes(id, amount);
      },
      revertLocalLikes: (id, amount) => {
        addLikesLocally(id, amount);
      },
    }),
    [likeActions],
  );
  return (
    <>
      <main>
        <div className="newPostForm">
          <div className="profilePictureWrapper">
            <div className="profilePicture"></div>
          </div>

          <textarea
            placeholder="Say something cool"
            value={newPostContent}
            onChange={(e) => {
              setNewPostContent(e.target.value);
            }}
          />
          <button onClick={addPost}>Save</button>
        </div>
        <div className="postsContainer">
          {posts.map((post, index) => (
            <PostComponent
              key={post.id}
              refProp={
                posts.length === index + 1 ? lastPostElementRef : undefined
              }
              displayName={context.displayName}
              username={context.username}
              handleDeleteClick={handleDelete}
              handleRemoveLikesClick={handleRemoveLikes}
              handleEditClick={launchModal}
              post={post}
              likes={post.likes}
              onLike={handlePostLike}
              onClick={() => {
                openPost(post.id);
              }}
            />
          ))}
          {error ? <>{error.toString()}</> : loading ? <>Loading...</> : <></>}
        </div>
      </main>
      <EditPostModal
        id={idToEdit}
        username={context.username}
        displayName={context.displayName}
        setVisible={(visible: boolean) => {
          setModalVisible(visible);
        }}
        visible={modalVisible}
        handleSave={handleEdit}
        textToEdit={textToEdit}
      />
    </>
  );
};
