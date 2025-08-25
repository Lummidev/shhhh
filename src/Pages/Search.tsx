import { PageContext } from "../utils";
import { FeedView } from "./FeedView";

export const Search = ({
  filter,
  openPost,
  context,
}: {
  filter: string;
  openPost: (id: string) => void;
  context: PageContext;
}) => <FeedView context={context} openPost={openPost} filter={filter} />;
