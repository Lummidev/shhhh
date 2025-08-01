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
  handleEditClick,
  post,
  onLike,
  likes,
}: {
  displayName: string;
  username: string;
  handleDeleteClick: (id: string) => Promise<void>;
  handleEditClick: (id: string, currentContent: string) => Promise<void>;
  onLike: (id: string) => Promise<void>;
  likes: number;
  post: Post;
}) => {
  const edited = post.created_at !== post.updated_at;
  const [showMore, setShowMore] = useState(false);
  const likeCounterStyle = () => {
    switch (true) {
      case likes >= 100:
        return "likedALot";
        break;
      case likes >= 20:
        return "veryLiked";
        break;
      case likes >= 5:
        return "kindaLiked";
        break;

      default:
        return "";
        break;
    }
  };
  return (
    <>
      <div className="post">
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
            className="actionButton moreButton"
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            <Fa icon={faEllipsis} />
          </button>
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
              </ul>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="postText">{post.content}</div>
        <div className="interactions">
          <button>
            <Fa icon={faComment} />
            <div className="counter">0</div>
          </button>

          <button>
            <Fa icon={faRepeat} />
            <div className="counter">0</div>
          </button>

          <button
            onClick={() => {
              onLike(post.id);
            }}
            className={post.likes > 0 ? "likedPost" : ""}
          >
            <Fa icon={post.likes > 0 ? faHeartSolid : faHeartRegular} />
            <div className={`counter ${likeCounterStyle()}`}>{likes}</div>
          </button>
        </div>
      </div>
    </>
  );
};
export default PostElement;
