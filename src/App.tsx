import { useEffect, useState } from "react";
import "./reset.css";
import "./App.css";
import backend from "./backend";
import PostComponent from "./Components/Post/post";
import Post from "./Types/Post";
import EditPostModal from "./Components/PostModal/EditPostModal";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [displayName, setDisplayname] = useState("Display Name");
  const [username, setUsername] = useState("Username");
  const [modalVisible, setModalVisible] = useState(false);
  const [textToEdit, setTextToEdit] = useState("");
  const [idToEdit, setIdToEdit] = useState("");
  const [likeActions, setLikeActions] = useState<{ likedPostID: string }[]>([]);
  async function addPost() {
    let added_post = await backend.posts.save(newPostContent);
    setPosts([added_post, ...posts]);
    setNewPostContent("");
  }
  useEffect(() => {
    const loadFirstPosts = async () => {
      setPosts(await backend.posts._get_all());
    };
    loadFirstPosts();
  }, []);
  const changePostLikesLocally = (id: string, amount: number) => {
    let post = posts.filter((post) => post.id === id).shift();
    if (post) {
      post.likes += amount;
      updatePost(post);
    }
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
          let updatedPost = await backend.posts.addLikes(
            idAmountMap.id,
            idAmountMap.amount,
          );
          updatePost(updatedPost);
        } catch (e) {
          console.error(e);
          changePostLikesLocally(idAmountMap.id, -idAmountMap.amount);
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
  const setUserInfo = () => {
    const newDisplayName = prompt("User's Display Name");
    const newUsername = prompt("User's username");
    setDisplayname(newDisplayName ?? displayName);
    setUsername(newUsername ?? username);
  };
  const handleDelete = async (id: string) => {
    await backend.posts.remove(id);
    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);
  };
  const handleRemoveLikes = async (id: string) => {
    let post: Post = await backend.posts.removeLikes(id);
    updatePost(post);
  };
  const launchModal = async (id: string, startText: string) => {
    setTextToEdit(startText);
    setIdToEdit(id);
    setModalVisible(true);
  };
  const updatePost = (updatedPost: Post) => {
    let edited_posts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post,
    );
    setPosts(edited_posts);
  };
  const handleEdit = async (id: string, newContent: string) => {
    let savedPost = await backend.posts.edit(id, newContent);
    updatePost(savedPost);
  };

  const handlePostLike = async (id: string) => {
    setLikeActions([...likeActions, { likedPostID: id }]);
    changePostLikesLocally(id, 1);
  };

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
          <div className="posts">
            <div className="postsContainer">
              {posts.map((post) => (
                <PostComponent
                  key={post.id}
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
            </div>
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
