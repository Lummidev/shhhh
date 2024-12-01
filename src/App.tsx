import { useState } from "react";
import "./reset.css"
import "./App.css";
import Post from "./post";
const placeholder_posts = ["Curabitur id finibus est. Curabitur non urna sodales, laoreet lacus in, viverra metus. Praesent suscipit congue ligula, a lacinia turpis in. ",
  " Mauris vitae ex lobortis, venenatis tortor ut, sollicitudin nisl. Phasellus hendrerit, diam ac ornare aliquam, tortor elit sollicitudin leo. ",
  "Curabitur convallis eros metus, eget tempor ante commodo id. Quisque euismod fringilla nibh, in imperdiet elit elementum id. Ut dapibus nam."]
function App() {
  const [posts, setPosts] = useState<string[]>(placeholder_posts)
  const [newPost, setNewPost] = useState("")
  const [username, setUsername] = useState("ShhhhUser")
  const [handle, setHandle] = useState("ShhhhUserHandle")
  function addPost() {
    setPosts([newPost, ...posts])
    setNewPost("")
  }
  const setUserInfo = () => {

    const newUserName = prompt("User Name")
    const newAtSign = prompt("User handle")
    setUsername(newUserName ?? username);
    setHandle(newAtSign ?? handle);

  }
  const handleLock = () => {
    alert("You just clicked the Lock button!")
  }
  const handleBackup = () => {
    alert("You just clicked the Backup button!")
  }
  const MenuBar = () => {

    return <>
      <h1 className="appTitle tabTitle">🤐 Shhhh</h1>
      <aside className="sidebar-left">
        <ul className="sidebarMenu">
          <li onClick={setUserInfo}>👤 User</li>
          <li onClick={handleLock}>🔒Lock</li>
          <li onClick={handleBackup}>⬇️ Backup</li>
        </ul>
      </aside>
    </>
  }

  return (
    <div className="container" >
      <MenuBar />
      <div className="postsTitle tabTitle">
        <h2>Posts</h2>
      </div>
      <main>
        <div className="newPostForm">
          <div className="profilePictureWrapper">
            <div className="profilePicture"></div>

          </div>

          <textarea placeholder="Say something cool" value={newPost} onChange={(e) => {
            setNewPost(e.target.value)
          }} />
          <button onClick={addPost}>Save</button>
        </div>
        <div className="posts">
          <div className="postsContainer">
            {posts.map((post) =>
              <Post id={post} content={post} username={username} handle={handle} />)}
          </div>
        </div>
      </main>
      <input type="text" placeholder="Search" className="search" />
      <aside className="sidebar-right">
      </aside>

    </div>
  );
}

export default App;
