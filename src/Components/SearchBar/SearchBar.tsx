import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import "./SearchBar.css";

export const SearchBar = ({
  onSearch,
}: {
  onSearch: (search: string) => any;
}) => {
  const [searchText, setSearchText] = useState("");
  return (
    <div className="search-bar">
      <div className="searchIcon">
        <Fa icon={faMagnifyingGlass} />
      </div>
      <form
        onSubmit={(e) => {
          onSearch(searchText);
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Search"
          className="search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </form>
    </div>
  );
};
