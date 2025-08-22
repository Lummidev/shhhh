import { useEffect, useState } from "react";
import { usePosts } from "../Hooks/usePosts";
import EditPostModal from "../Components/PostModal/EditPostModal";
import { debounceLikesEffect, PageContext } from "../utils";
import { PostFeed } from "../Components/PostFeed/PostFeed";
import "./Home.css";
import { Button } from "../Components/Button/Button";
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
  const openEditModal = async (id: string, startText: string) => {
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
          <Button onClick={addPost} buttonType="primary">
            Save
          </Button>
        </div>
        <PostFeed
          posts={posts}
          context={context}
          onEdit={openEditModal}
          onLike={handlePostLike}
          onDelete={handleDelete}
          onRemoveLikes={handleRemoveLikes}
          openPost={openPost}
          error={error}
          hasMore={hasMore}
          nextPage={() => {
            setPage(page + 1);
          }}
          loading={loading}
        />
      </main>
      <EditPostModal
        id={idToEdit}
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
