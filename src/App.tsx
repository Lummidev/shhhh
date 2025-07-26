import { useEffect, useState } from "react";
import "./reset.css";
import "./App.css";
import backend from "./backend";
import PostComponent from "./Components/Post/post";
import Post from "./Types/Post";
import EditPostModal from "./Components/PostModal/EditPostModal";
import dayjs from "dayjs";
function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [displayName, setDisplayname] = useState("Display Name");
  const [username, setUsername] = useState("Username");
  const [modalVisible, setModalVisible] = useState(false);
  const [textToEdit, setTextToEdit] = useState("");
  const [idToEdit, setIdToEdit] = useState("");
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
  const launchModal = async (id: string, startText: string) => {
    setTextToEdit(startText);
    setIdToEdit(id);
    setModalVisible(true);
  };
  const handleEdit = async (id: string, newContent: string) => {
    await backend.posts.edit(id, newContent);
    let edited_posts = posts.map((post) => {
      if (post.id === id) {
        post.content = newContent;
        post.updated_at = dayjs().unix();
      }
      return post;
    });
    setPosts(edited_posts);
  };
  const MenuBar = () => {
    return (
      <>
        <h1 className="appTitle tabTitle">🤐 Shhhh</h1>
        <aside className="sidebar-left">
          <ul className="sidebarMenu">
            <li onClick={setUserInfo}>👤 User</li>
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
                  handleEditClick={launchModal}
                  post={post}
                />
              ))}
            </div>
          </div>
        </main>
        <input type="text" placeholder="Search" className="search" />
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
