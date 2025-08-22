import { PropsWithChildren, MouseEvent } from "react";
import "./Button.css";
export type ButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => any;
  disabled?: boolean;
  buttonType: "primary" | "menu" | "interaction";
  className?: string;
  color?: "red" | "green" | "blue";
};

export const Button = (props: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      disabled={props.disabled}
      className={`button-${props.buttonType} ${props.buttonType === "interaction" ? `interaction-${props.color}` : "button"} ${props.className ? props.className : ""} `}
      onClick={(e) => {
        props.onClick(e);
      }}
    >
      {props.children}
    </button>
  );
};
