import { useState } from "react";
import "./reset.css";
import "./variables.css";
import "./App.css";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import { PostPage } from "./Pages/Post";
import { PageContext, Pages } from "./utils";
import { Home } from "./Pages/Home";
import { Button } from "./Components/Button/Button";
import { Search } from "./Pages/Search";
import { SearchBar } from "./Components/SearchBar/SearchBar";
function App() {
  const [currentSearch, setCurrentSearch] = useState("");
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
    setCurrentSearch("");
  };
  const startSearch = (search: string) => {
    console.log("started search");
    let searchTrim = search.trim();

    if (searchTrim.length > 0) {
      setCurrentSearch(searchTrim);
      setPageContext({ ...pageContext, currentPage: Pages.Search });
    } else {
      goToHome();
    }
  };
  const MenuBar = () => {
    return (
      <>
        <h1 className="appTitle tabTitle" onClick={goToHome}>
          Shhhh
        </h1>
        <aside className="sidebar-left">
          <ul className="sidebarMenu">
            <li>
              <Button onClick={goToHome} buttonType="menu">
                <Fa icon={faHome} /> Home
              </Button>
            </li>
            <li>
              <Button onClick={setUserInfo} buttonType="menu">
                <Fa icon={faUser} /> User
              </Button>
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
      case Pages.Search:
        return (
          <Search
            context={pageContext}
            openPost={openPost}
            filter={currentSearch}
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
      case Pages.Search:
        return (
          <h2>
            Searching for <i>{currentSearch}</i>
          </h2>
        );
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
        <SearchBar onSearch={startSearch} />
        <aside className="sidebar-right"></aside>
      </div>
    </>
  );
}

export default App;
