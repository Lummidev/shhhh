import { useState } from "react";
import "./reset.css";
import "./variables.css";
import "./App.css";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { PostPage } from "./Pages/Post";
import { PageContext, Pages } from "./utils";
import { Home } from "./Pages/Home";
function App() {
  const [pageContext, setPageContext] = useState<PageContext>({
    currentPage: Pages.Home,
    username: "Username",
    displayName: "Display Name",
  });
  const setUserInfo = () => {
    const newDisplayName = prompt("User's Display Name");
    const newUsername = prompt("User's username");
    setPageContext({
      ...pageContext,
      displayName: newDisplayName ?? pageContext.displayName,
      username: newUsername ?? pageContext.username,
    });
  };
  const openPost = (id: string) => {
    setPageContext({ ...pageContext, currentPage: Pages.Post, post_id: id });
  };
  const goToHome = () => {
    setPageContext({
      ...pageContext,
      currentPage: Pages.Home,
      post_id: undefined,
    });
  };
  const MenuBar = () => {
    return (
      <>
        <h1 className="appTitle tabTitle" onClick={goToHome}>
          Shhhh
        </h1>
        <aside className="sidebar-left">
          <ul className="sidebarMenu">
            <li onClick={goToHome}>
              <Fa icon={faHome} /> Home
            </li>
            <li onClick={setUserInfo}>
              <Fa icon={faUser} /> User
            </li>
          </ul>
        </aside>
      </>
    );
  };
  const CurrentPage = () => {
    switch (pageContext.currentPage) {
      case Pages.Home:
        return <Home context={pageContext} openPost={openPost} />;
      case Pages.Post:
        return (
          <PostPage
            context={pageContext}
            openPost={openPost}
            goToHome={goToHome}
          />
        );
    }
  };
  const CurrentTab = () => {
    switch (pageContext.currentPage) {
      case Pages.Home:
        return <h2>Home</h2>;
      case Pages.Post:
        return <h2>Post</h2>;
    }
  };

  return (
    <>
      <div className="container">
        <MenuBar />
        <div className="postsTitle tabTitle">
          <CurrentTab />
        </div>
        <CurrentPage />
        <div className="searchContainer">
          <div className="searchIcon">
            <Fa icon={faMagnifyingGlass} />
          </div>
          <input type="text" placeholder="Search" className="search" />
        </div>
        <aside className="sidebar-right"></aside>
      </div>
    </>
  );
}

export default App;
