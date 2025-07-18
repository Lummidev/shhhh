import Post from "../../Types/Post";
import "./post.css";
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
  return (
    <>
      <div className="post">
        <div className="profilePictureWrapper">
          <div className="profilePicture"></div>
        </div>
        <div className="userInfo">
          <div className="displayName">{displayName}</div>
          <div className="username">@{username}</div>
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
