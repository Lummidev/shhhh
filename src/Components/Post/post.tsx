import Post from "../../Types/Post";
import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import "./post.css";
dayjs.extend(relativeTimePlugin);
const PostElement = ({
  displayName,
  username,
  handleDeleteClick,
  handleEditClick,
  post,
}: {
  displayName: string;
  username: string;
  handleDeleteClick: (id: string) => Promise<void>;
  handleEditClick: (id: string, currentContent: string) => Promise<void>;
  post: Post;
}) => {
  const edited = post.created_at !== post.updated_at;
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
            {dayjs.unix(post.created_at).fromNow() +
              (edited
                ? ` (Edited ${dayjs.unix(post.updated_at).fromNow()})`
                : "")}
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
        <button
          className="editButton actionButton"
          onClick={() => {
            handleEditClick(post.id, post.content);
          }}
        >
          ✏️
        </button>
        <button
          className="deleteButton actionButton"
          onClick={() => {
            handleDeleteClick(post.id);
          }}
        >
          🗑️
        </button>

        <div className="postText">{post.content}</div>
        <div className="interactions">
          <button>⬤</button>
          <button>⬤</button>
          <button>⬤</button>
        </div>
      </div>
    </>
  );
};
export default PostElement;
