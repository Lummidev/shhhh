import Post from "../../Types/Post";
import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import updateLocalePluin from "dayjs/plugin/updateLocale";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import {
  faPenToSquare,
  faRepeat,
  faTrash,
  faHeart as faHeartSolid,
  faEllipsis,
  faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import "./post.css";
import { useState } from "react";
dayjs.extend(relativeTimePlugin);
dayjs.extend(updateLocalePluin);
dayjs.updateLocale("en", {
  relativeTime: {
    s: "now",
    m: "1min",
    mm: "%dmin",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1y",
    yy: "%dy",
  },
});
dayjs.locale("en");
const PostElement = ({
  displayName,
  username,
  handleDeleteClick,
  handleRemoveLikesClick,
  handleEditClick,
  post,
  onLike,
  likes,
  refProp,
}: {
  displayName: string;
  username: string;
  handleDeleteClick: (id: string) => Promise<void>;
  handleRemoveLikesClick: (id: string) => Promise<void>;
  handleEditClick: (id: string, currentContent: string) => Promise<void>;
  onLike: (id: string) => Promise<void>;
  likes: number;
  post: Post;
  refProp: ((node: HTMLDivElement) => void) | undefined;
}) => {
  const edited = post.created_at !== post.updated_at;
  const [showMore, setShowMore] = useState(false);
  const likeCounterStyle = () => {
    switch (true) {
      case likes >= 100:
        return "likedALot";
      case likes >= 20:
        return "veryLiked";
      case likes >= 5:
        return "kindaLiked";
      default:
        return "";
    }
  };
  return (
    <div className="postContainer">
      {showMore ? (
        <>
          <div
            className="moreMenuScreenBlock"
            onClick={() => {
              setShowMore(false);
            }}
          ></div>
          <ul className="moreMenu">
            <li>
              <button
                onClick={() => {
                  setShowMore(false);
                  handleEditClick(post.id, post.content);
                }}
              >
                <Fa icon={faPenToSquare} /> Edit
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowMore(false);
                  handleDeleteClick(post.id);
                }}
              >
                <Fa icon={faTrash} /> Delete
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowMore(false);
                  handleRemoveLikesClick(post.id);
                }}
              >
                <Fa icon={faHeartBroken} /> Remove All Likes
              </button>
            </li>
          </ul>
        </>
      ) : (
        ""
      )}
      <div className={`post ${showMore ? "active" : ""}`} ref={refProp}>
        <div className="profilePictureWrapper">
          <div className="profilePicture"></div>
        </div>
        <div className="userInfo">
          <div className="displayName">{displayName}</div>
          <div className="username">@{username}</div>
          <div className="dateSeparator">•</div>
          <div className="dateInfo">
            {dayjs.unix(post.created_at).fromNow(true) +
              (edited ? ` (Edited)` : "")}
            <span className="dateTooltip">
              Created: {dayjs.unix(post.created_at).toString()}
              {edited ? (
                <>
                  <br />
                  Edited:{dayjs.unix(post.updated_at).toString()}
                </>
              ) : (
                ""
              )}
            </span>
          </div>
        </div>
        <div className="moreArea">
          <button
            className="moreButton"
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            <Fa icon={faEllipsis} />
          </button>
        </div>

        <div className="postText">{post.content}</div>
        <div className="interactions">
          <button className="commentButton">
            <Fa icon={faComment} />
            <div className="counter">0</div>
          </button>

          <button className="repostButton">
            <Fa icon={faRepeat} />
            <div className="counter">0</div>
          </button>

          <button
            onClick={() => {
              onLike(post.id);
            }}
            className={`${post.likes > 0 ? "likedPost" : ""} likeButton`}
          >
            <Fa icon={post.likes > 0 ? faHeartSolid : faHeartRegular} />
            <div className={`counter ${likeCounterStyle()}`}>{likes}</div>
          </button>
        </div>
      </div>
    </div>
  );
};
export default PostElement;
