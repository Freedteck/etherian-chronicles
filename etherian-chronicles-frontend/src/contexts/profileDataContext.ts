/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

export const ProfileDataContext = createContext({
  userProfile: null,
  claimableBonuses: [],
  claimableNFTs: [],
  ownedNFTs: [],
  isLoading: false,
  mintLoreFragment: (storyId, chapterIndex): Promise<any> => Promise.resolve(null),
  mintCompletionFragment: (storyId): Promise<any> => Promise.resolve(null),
});
