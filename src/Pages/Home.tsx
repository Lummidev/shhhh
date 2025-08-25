import { PageContext } from "../utils";
import { FeedView } from "./FeedView";
export const Home = ({
  context,
  openPost,
}: {
  context: PageContext;
  openPost: (id: string) => void;
}) => <FeedView context={context} openPost={openPost} />;
