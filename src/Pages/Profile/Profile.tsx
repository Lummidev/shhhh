import { faHeart, faNoteSticky } from "@fortawesome/free-regular-svg-icons";
import { PageContext } from "../../utils";
import { FeedView } from "../FeedView";
import "./Profile.css";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { Button } from "../../Components/Button/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { config } from "../../config";
import { AutoHeightTextArea } from "../../Components/AutoHeightTextArea/AutoHeightTextArea";
import { ProfileEditData } from "../../Types/ProfileUpdateData";
const minTextAreaHeight = 32;
export const Profile = ({
  context,
  openPost,
  onProfileEdit,
}: {
  context: PageContext;
  openPost: (id: string) => void;
  onProfileEdit: (edit: ProfileEditData) => Promise<any>;
}) => {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const loadBio = async () => {
    setBio(await config.bio());
  };

  useEffect(() => {
    loadBio();
  }, []);
  const onEdit = async (edit: ProfileEditData) => {
    await onProfileEdit(edit);
    setBio(edit.bio);
    setEditing(false);
  };
  const Counters = () => (
    <div className="counters">
      <div className="post-count counter">
        <Fa icon={faHeart} /> <b>999</b>{" "}
        <div className="counter-name">Likes</div>
      </div>
      <div className="like-count counter">
        <Fa icon={faNoteSticky} /> <b>999</b>{" "}
        <div className="counter-name">Posts</div>
      </div>
    </div>
  );
  const EditFormInput = ({
    label,
    id,
    className,
    value,
    onChange,
    textarea,
  }: {
    label: string;
    id: string;
    className: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    textarea?: boolean;
  }) => (
    <div className="edit-form-input">
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <AutoHeightTextArea
          id={id}
          className={className}
          value={value}
          onChange={onChange}
          minTextAreaHeight={minTextAreaHeight}
        />
      ) : (
        <input
          id={id}
          className={className}
          type="text"
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
  const EditForm = ({ onEdit }: { onEdit: (edit: ProfileEditData) => any }) => {
    const [displayNameInput, setDisplayNameInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [bioInput, setBioInput] = useState("");
    useEffect(() => {
      setDisplayNameInput(context.displayName);
      setUsernameInput(context.username);
      setBioInput(bio);
    }, [bio, context]);
    return (
      <>
        <form
          className="profile-content"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="profile-picture-header">
            <div className="profile-picture"></div>
            <div className="edit-form-buttons">
              <Button
                onClick={() => {
                  setEditing(false);
                }}
                buttonType="secondary"
              >
                Cancel Editing
              </Button>
              <Button
                onClick={() => {
                  onEdit({
                    displayName: displayNameInput,
                    username: usernameInput,
                    bio: bioInput,
                  });
                }}
                buttonType="primary"
              >
                Save Edit
              </Button>
            </div>
          </div>
          <div className="profile-info-edit">
            <EditFormInput
              label="Display Name"
              id="display-name-input"
              className="display-name-input"
              value={displayNameInput}
              onChange={(e) => {
                setDisplayNameInput(e.target.value);
              }}
            />
            <EditFormInput
              label="Username"
              id="username-input"
              className="username-input"
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value);
              }}
            />
            <EditFormInput
              label="Bio"
              id="bio-input"
              className="bio-input"
              value={bioInput}
              onChange={(e) => {
                setBioInput(e.target.value);
              }}
              textarea
            />
          </div>
        </form>
      </>
    );
  };
  return (
    <div className="profile-page">
      <div className="user-profile">
        <div className="profile-banner"></div>
        {editing ? (
          <EditForm onEdit={onEdit} />
        ) : (
          <div className="profile-content">
            <div className="profile-picture-header">
              <div className="profile-picture"></div>
              <Button
                buttonType="secondary"
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit Profile
              </Button>
            </div>
            <div className="profile-info">
              <div className="user-info">
                <>
                  <h3 className="display-name">{context.displayName}</h3>
                  <span className="username">@{context.username}</span>
                </>
              </div>
              <div className="user-bio">{bio}</div>
              <Counters />
            </div>
          </div>
        )}
      </div>
      <div className="user-posts">
        <FeedView context={context} openPost={openPost} hideCompose />
      </div>
    </div>
  );
};
