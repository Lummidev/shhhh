import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import "./moreMenu.css";
export interface MoreMenuAction {
  icon?: IconDefinition;
  text: string;
  effect: () => void;
}
export const MoreMenu = ({
  closeMenu,
  actions,
}: {
  closeMenu: () => void;
  actions: MoreMenuAction[];
}) => {
  return (
    <>
      <div
        className="moreMenuScreenBlock"
        onClick={() => {
          closeMenu();
        }}
      ></div>
      <ul className="moreMenu">
        {actions.map((action) => (
          <li key={action.text}>
            <button
              onClick={() => {
                action.effect();
                closeMenu();
              }}
            >
              {action.icon ? <Fa icon={action.icon} /> : <></>} {action.text}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
