import { useState, createContext, useEffect } from "react";
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
import { Profile } from "./Pages/Profile/Profile";
import { config, updateUserInfo } from "./config";
import { ProfileEditData } from "./Types/ProfileUpdateData.ts";
function App() {
  const [currentSearch, setCurrentSearch] = useState("");
  const [pageContext, setPageContext] = useState<PageContext>({
    currentPage: Pages.Home,
    username: "Username",
    displayName: "Display Name",
  });

  const loadUserInfo = async () => {
    let newContext = {
      ...pageContext,
      displayName: await config.displayName(),
      username: await config.username(),
    };
    setPageContext(newContext);
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
    let searchTrim = search.trim();

    if (searchTrim.length > 0) {
      setCurrentSearch(searchTrim);
      setPageContext({ ...pageContext, currentPage: Pages.Search });
    } else {
      goToHome();
    }
  };
  const goToProfile = () => {
    setPageContext({ ...pageContext, currentPage: Pages.Profile });
  };
  const onProfileEdit = async (edit: ProfileEditData) => {
    await updateUserInfo(edit);
    setPageContext({
      ...pageContext,
      displayName: edit.displayName,
      username: edit.username,
    });
  };
  useEffect(() => {
    loadUserInfo();
  }, []);
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
              <Button onClick={goToProfile} buttonType="menu">
                <Fa icon={faUser} /> {pageContext.displayName}
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
      case Pages.Profile:
        return (
          <Profile
            onProfileEdit={onProfileEdit}
            context={pageContext}
            openPost={openPost}
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
      case Pages.Profile:
        return <h2>Profile</h2>;
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
