import "./post.css"
const Post = ({ id, content, username, handle }: { id: string, content: string, username: string, handle: string }) => {
  return <>
    <div className="post" key={id}>
      <div className="profilePictureWrapper">
        <div className="profilePicture"></div>
      </div>
      <div className="userInfo">
        <div className="username">{username}</div>
        <div className="handle">@{handle}</div>
      </div>

      <div className="postText">
        {content}
      </div>
      <div className="interactions">
        <button>⬤</button>
        <button>⬤</button>
        <button>⬤</button>
      </div>
    </div>
  </>
}
export default Post;
