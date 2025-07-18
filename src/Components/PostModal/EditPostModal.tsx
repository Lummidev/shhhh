import { useEffect, useState } from "react";
import "./EditPostModal.css";
const EditPostModal = ({
  id,
  displayName,
  username,
  visible,
  setVisible,
  handleSave,
  textToEdit,
}: {
  id: string;
  displayName: string;
  username: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  handleSave: (id: string, newContent: string) => Promise<void>;
  textToEdit: string;
}) => {
  const [text, setText] = useState("");
  const [inputDisabled, setInputsDisabled] = useState(true);
  const reset = () => {
    setText(textToEdit);
  };
  useEffect(() => {
    reset();
  }, [textToEdit]);
  useEffect(() => {
    setInputsDisabled(!visible);
  }, [visible]);
  return (
    <>
      <div className={`EditPostModal ${visible ? "open" : ""}`}>
        <div className="EditPostModalContent">
          <h2 className="ModalTitle">Edit Post</h2>
          <div className="ModalUserInfo">
            <div className="ModalUsername">{displayName}</div>
            <div className="ModalHandle">@{username}</div>
          </div>

          <div className="ModalProfilePictureWrapper">
            <div className="ModalProfilePicture"></div>
          </div>
          <button
            className="closeModal"
            onClick={() => {
              setVisible(false);
              reset();
            }}
            disabled={inputDisabled}
          >
            ❌
          </button>
          <textarea
            className="EditPostInput"
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            disabled={inputDisabled}
          />
          <div className="modalActions">
            <button
              className="cancelEditButton"
              onClick={() => {
                setVisible(false);
                reset();
              }}
              disabled={inputDisabled}
            >
              ❎Cancel
            </button>
            <button
              className="saveEditButton"
              onClick={() => {
                handleSave(id, text).then(() => {
                  setVisible(false);
                });
              }}
              disabled={inputDisabled}
            >
              ✅Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPostModal;
