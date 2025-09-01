import { useLayoutEffect, useRef, ChangeEvent } from "react";

export const AutoHeightTextArea = ({
  id,
  value,
  minTextAreaHeight,
  disabled,
  onChange,
  className,
}: {
  id?: string;
  value: string;
  minTextAreaHeight: number;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => any;
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>();
  useLayoutEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "inherit";
    textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, minTextAreaHeight) + 1}px`;
  }, [value]);
  return (
    <textarea
      id={id}
      className={className}
      ref={textareaRef}
      onChange={(e) => {
        onChange(e);
      }}
      value={value}
      disabled={disabled}
      placeholder="Write your edited post here"
      style={{ minHeight: minTextAreaHeight }}
    />
  );
};
