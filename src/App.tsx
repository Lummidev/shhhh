import { useCallback, useEffect, useRef, useState } from "react";
import "./reset.css";
import "./App.css";
import PostComponent from "./Components/Post/post";
import EditPostModal from "./Components/PostModal/EditPostModal";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { usePosts } from "./Hooks/usePosts";
function App() {
  const [newPostContent, setNewPostContent] = useState("");
  const [displayName, setDisplayname] = useState("Display Name");
  const [username, setUsername] = useState("Username");
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
  const setUserInfo = () => {
    const newDisplayName = prompt("User's Display Name");
    const newUsername = prompt("User's username");
    setDisplayname(newDisplayName ?? displayName);
    setUsername(newUsername ?? username);
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
  useEffect(() => {
    function consolidateLikes() {
      let totalPostLikes: { id: string; amount: number }[] = [];
      for (let like of likeActions) {
        let likedBefore =
          totalPostLikes.filter(
            (idAmountMap) => idAmountMap.id === like.likedPostID,
          ).length > 0;
        if (!likedBefore) {
          totalPostLikes.push({ id: like.likedPostID, amount: 1 });
        } else {
          totalPostLikes = totalPostLikes.map((idAmountMap) => {
            if (idAmountMap.id === like.likedPostID) {
              idAmountMap.amount += 1;
            }
            return idAmountMap;
          });
        }
      }
      return totalPostLikes;
    }
    async function saveLikes(totalPostLikes: { id: string; amount: number }[]) {
      for (let idAmountMap of totalPostLikes) {
        try {
          await addLikes(idAmountMap.id, idAmountMap.amount);
        } catch (e) {
          console.error(e);
          addLikesLocally(idAmountMap.id, -idAmountMap.amount);
        }
      }
      setLikeActions([]);
    }

    const maxLikesBeforeNotDebouncing = 15;
    const maxUniqueLikedPostsBeforeNotDebouncing = 3;
    const debounceMiliseconds = 500;
    if (likeActions.length < 1) {
      return;
    }
    let likes = consolidateLikes();
    const saveLikesTimeout = setTimeout(async () => {
      saveLikes(likes);
    }, debounceMiliseconds);
    if (
      likeActions.length >= maxLikesBeforeNotDebouncing ||
      likes.length >= maxUniqueLikedPostsBeforeNotDebouncing
    ) {
      clearTimeout(saveLikesTimeout);
      saveLikes(likes);
      return;
    }
    return () => {
      clearTimeout(saveLikesTimeout);
    };
  }, [likeActions]);
  const MenuBar = () => {
    return (
      <>
        <h1 className="appTitle tabTitle">Shhhh</h1>
        <aside className="sidebar-left">
          <ul className="sidebarMenu">
            <li onClick={setUserInfo}>
              <Fa icon={faUser} /> User
            </li>
          </ul>
        </aside>
      </>
    );
  };

  return (
    <>
      <div className="container">
        <MenuBar />
        <div className="postsTitle tabTitle">
          <h2>Posts</h2>
        </div>
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
                displayName={displayName}
                username={username}
                handleDeleteClick={handleDelete}
                handleRemoveLikesClick={handleRemoveLikes}
                handleEditClick={launchModal}
                post={post}
                likes={post.likes}
                onLike={handlePostLike}
              />
            ))}
            {error ? (
              <>{error.toString()}</>
            ) : loading ? (
              <>Loading...</>
            ) : (
              <></>
            )}
          </div>
        </main>
        <div className="searchContainer">
          <div className="searchIcon">
            <Fa icon={faMagnifyingGlass} />
          </div>
          <input type="text" placeholder="Search" className="search" />
        </div>
        <aside className="sidebar-right"></aside>
      </div>
      <EditPostModal
        id={idToEdit}
        username={username}
        displayName={displayName}
        setVisible={(visible: boolean) => {
          setModalVisible(visible);
        }}
        visible={modalVisible}
        handleSave={handleEdit}
        textToEdit={textToEdit}
      />
    </>
  );
}

export default App;
