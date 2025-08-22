import { useEffect, useState } from "react";
import { debounceLikesEffect, likeCounterStyle, PageContext } from "../utils";
import backend from "../backend";
import Post from "../Types/Post";
import "./Post.css";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import {
  faRepeat,
  faHeart as faHeartSolid,
  faEllipsis,
  faPenToSquare,
  faTrash,
  faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import { MoreMenu, MoreMenuAction } from "../Components/MoreMenu/moreMenu";
import EditPostModal from "../Components/PostModal/EditPostModal";
import { Button } from "../Components/Button/Button";
dayjs.extend(LocalizedFormat);
export const PostPage = ({
  context,
  openPost,
  goToHome,
}: {
  context: PageContext;
  openPost: (id: string) => void;
  goToHome: () => void;
}) => {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>();
  const [showMore, setShowMore] = useState(false);
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [textToEdit, setTextToEdit] = useState("");
  const [idToEdit, setIdToEdit] = useState("");
  const [likeActions, setLikeActions] = useState<{ likedPostID: string }[]>([]);
  const handlePostLike = async (id: string) => {
    if (!post) return;
    setLikeActions([...likeActions, { likedPostID: id }]);
    setPost({ ...post, likes: post.likes + 1 });
  };
  const dateFormat = "h[:]mm A [•] MMM D[,] YYYY";
  const moreMenuActions: MoreMenuAction[] = [
    {
      icon: faPenToSquare,
      effect: () => {
        if (post) handleEditClick(post.id, post.content);
      },
      text: "Edit",
    },
    {
      icon: faTrash,
      effect: () => {
        if (post) handleDeleteClick(post.id);
      },
      text: "Delete",
    },
    {
      icon: faHeartBroken,
      effect: () => {
        if (post) handleRemoveLikesClick(post.id);
      },
      text: "Remove All Likes",
    },
  ];
  function handleEditClick(id: string, content: string) {
    setTextToEdit(content);
    setIdToEdit(id);
    setEditModalIsVisible(true);
  }
  async function saveEdit(id: string, newContent: string) {
    let savedPost = await backend.posts.edit(id, newContent);
    setPost(savedPost);
  }
  async function handleDeleteClick(id: string) {
    await backend.posts.remove(id);
    goToHome();
  }
  async function handleRemoveLikesClick(id: string) {
    let updatedPost = await backend.posts.removeLikes(id);
    setPost(updatedPost);
  }
  useEffect(() => {
    setLoading(true);
    if (!context.post_id) {
      return;
    }
    backend.posts
      .get(context.post_id)
      .then((post) => {
        setPost(post);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.toString());
      });
  }, [context]);

  useEffect(
    debounceLikesEffect({
      likeActions,
      sendLikes: async (id, amount) => {
        let updated_post = await backend.posts.addLikes(id, amount);
        setPost(updated_post);
      },
      revertLocalLikes: (_, amount) => {
        if (!post) return;
        setPost({ ...post, likes: post.likes + amount });
      },
      clearLikeActions: () => {
        setLikeActions([]);
      },
    }),
    [likeActions],
  );
  return (
    <>
      <main>
        {error ? (
          <>Error: {error}</>
        ) : loading ? (
          <>Loading</>
        ) : !post ? (
          <>Post not found</>
        ) : (
          <div className="mainPostContainer">
            {showMore ? (
              <div className="mainPostMoreMenu">
                <MoreMenu
                  closeMenu={() => {
                    setShowMore(false);
                  }}
                  actions={moreMenuActions}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="mainPost">
              <div className="profilePicture"></div>
              <div className="userInfo">
                <div className="displayName">{context.displayName}</div>
                <div className="username">@{context.username}</div>
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

              <div className="content">{post.content}</div>
              <div className="dateInfo">
                <div className="postDate">
                  {dayjs.unix(post.created_at).format(dateFormat)}
                </div>{" "}
                {post.created_at !== post.updated_at ? (
                  <div className="editedDate">
                    (Edited {dayjs.unix(post.updated_at).format(dateFormat)})
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="interactions">
                <Button
                  onClick={() => {}}
                  buttonType="interaction"
                  color="blue"
                  className="commentButton"
                >
                  <Fa icon={faComment} />
                  <div className="counter">0</div>
                </Button>

                <Button
                  onClick={() => {}}
                  buttonType="interaction"
                  color="green"
                  className="repostButton"
                >
                  <Fa icon={faRepeat} />
                  <div className="counter">0</div>
                </Button>

                <Button
                  buttonType="interaction"
                  color="red"
                  onClick={() => {
                    handlePostLike(post.id);
                  }}
                  className={`${post.likes > 0 ? "likedPost" : ""} likeButton`}
                >
                  <Fa icon={post.likes > 0 ? faHeartSolid : faHeartRegular} />
                  <div className={`counter ${likeCounterStyle(post.likes)}`}>
                    {post.likes}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      {post ? (
        <EditPostModal
          id={idToEdit}
          username={context.username}
          displayName={context.displayName}
          setVisible={(visible: boolean) => {
            setEditModalIsVisible(visible);
          }}
          visible={editModalIsVisible}
          handleSave={saveEdit}
          textToEdit={textToEdit}
        />
      ) : (
        <></>
      )}
    </>
  );
};
