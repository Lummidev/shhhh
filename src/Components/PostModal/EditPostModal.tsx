import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";

import "./EditPostModal.css";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button/Button";
const minTextAreaHeight = 32;
const EditPostModal = ({
  id,
  visible,
  setVisible,
  handleSave,
  textToEdit,
}: {
  id: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  handleSave: (id: string, newContent: string) => Promise<void>;
  textToEdit: string;
}) => {
  const [text, setText] = useState("");
  const [inputDisabled, setInputsDisabled] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>();
  const reset = () => {
    setText(textToEdit);
  };
  useLayoutEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, minTextAreaHeight) + 1}px`;
  }, [text]);
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
            <Fa icon={faXmark} />
          </button>
          <textarea
            className="EditPostInput"
            ref={textareaRef}
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            disabled={inputDisabled}
            placeholder="Write your edited post here"
            style={{ minHeight: minTextAreaHeight }}
          />
          <div className="modalActions">
            <Button
              buttonType="primary"
              onClick={() => {
                handleSave(id, text).then(() => {
                  setVisible(false);
                });
              }}
              disabled={inputDisabled}
            >
              <Fa icon={faCheck} /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPostModal;
