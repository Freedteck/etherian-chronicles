import {
  claimStoryCompletionBonus,
  claimWinnerFragment,
  getLeaderboard,
  getUserCompleteProfile,
} from "@/data/proposalData";
import { useCallback, useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { ProfileDataContext } from "./profileDataContext";

const ProfileContext = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [claimableBonuses, setClaimableBonuses] = useState([]);
  const [claimableNFTs, setClaimableNFTs] = useState([]);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const account = useActiveAccount();

  const getUserProfile = useCallback(async (account) => {
    setIsLoading(true);
    try {
      const { claimableBonuses, claimableNFTs, ownedNFTs, profile } =
        await getUserCompleteProfile(account?.address);
      setUserProfile(profile);
      setClaimableBonuses(claimableBonuses);
      setClaimableNFTs(claimableNFTs);
      setOwnedNFTs(ownedNFTs);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const leaderboardData = await getLeaderboard();
      const updatedLeaderboard = await Promise.all(
        leaderboardData.map(async (user) => {
          const { ownedNFTs } = await getUserCompleteProfile(user.user);
          return {
            ...user,
            nfts: ownedNFTs.length,
          };
        })
      );

      setLeaderboard(updatedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchLeaderboard();
    };
    fetchData();
  }, [fetchLeaderboard]);

  const mintLoreFragment = async (storyId, chapterIndex) => {
    const transactionHash = await claimWinnerFragment(
      storyId,
      chapterIndex,
      account
    );
    if (transactionHash) {
      console.log("Transaction successful:", transactionHash);
      await getUserProfile(account);
    } else {
      console.error("Failed to claim lore fragment");
    }
  };

  const mintCompletionFragment = async (storyId) => {
    const transactionHash = await claimStoryCompletionBonus(storyId, account);
    if (transactionHash) {
      console.log("Transaction successful:", transactionHash);
      await getUserProfile(account);
    } else {
      console.error("Failed to claim completion fragment");
    }
  };

  return (
    <ProfileDataContext.Provider
      value={{
        userProfile,
        claimableBonuses,
        claimableNFTs,
        ownedNFTs,
        leaderboard,
        isLoading,
        mintLoreFragment,
        mintCompletionFragment,
        getUserProfile,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

export default ProfileContext;
