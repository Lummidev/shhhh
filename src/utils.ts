export enum Pages {
  Home,
  Post,
  Search,
  Profile,
}
export interface PageContext {
  currentPage: Pages;
  displayName: string;
  username: string;
  post_id?: string;
}
export const likeCounterStyle = (likes: number) => {
  switch (true) {
    case likes >= 100:
      return "likedALot";
    case likes >= 20:
      return "veryLiked";
    case likes >= 5:
      return "kindaLiked";
    default:
      return "";
  }
};
function consolidateLikes(likeActions: { likedPostID: string }[]) {
  let totalPostLikes: { id: string; amount: number }[] = [];
  for (let like of likeActions) {
    let likedBefore =
      totalPostLikes.filter(
        (idAmountMap) => idAmountMap.id === like.likedPostID,
      ).length > 0;
    if (!likedBefore) {
      totalPostLikes.push({ id: like.likedPostID, amount: 1 });
    } else {
      totalPostLikes = totalPostLikes.map((idAmountMap) => {
        if (idAmountMap.id === like.likedPostID) {
          idAmountMap.amount += 1;
        }
        return idAmountMap;
      });
    }
  }
  return totalPostLikes;
}
export const debounceLikesEffect = ({
  likeActions,
  clearLikeActions,
  sendLikes,
  revertLocalLikes,
}: {
  likeActions: { likedPostID: string }[];
  clearLikeActions: () => void;
  sendLikes: (id: string, amount: number) => Promise<void>;
  revertLocalLikes: (id: string, amount: number) => void;
}) => {
  return () => {
    async function saveLikes(totalPostLikes: { id: string; amount: number }[]) {
      for (let idAmountMap of totalPostLikes) {
        try {
          await sendLikes(idAmountMap.id, idAmountMap.amount);
        } catch (e) {
          console.error(e);
          revertLocalLikes(idAmountMap.id, -idAmountMap.amount);
        }
      }
      clearLikeActions();
    }

    const maxLikesBeforeNotDebouncing = 15;
    const maxUniqueLikedPostsBeforeNotDebouncing = 3;
    const debounceMiliseconds = 500;
    if (likeActions.length < 1) {
      return;
    }
    let likes = consolidateLikes(likeActions);
    const saveLikesTimeout = setTimeout(async () => {
      saveLikes(likes);
    }, debounceMiliseconds);
    if (
      likeActions.length >= maxLikesBeforeNotDebouncing ||
      likes.length >= maxUniqueLikedPostsBeforeNotDebouncing
    ) {
      clearTimeout(saveLikesTimeout);
      saveLikes(likes);
      return;
    }
    return () => {
      clearTimeout(saveLikesTimeout);
    };
  };
};
