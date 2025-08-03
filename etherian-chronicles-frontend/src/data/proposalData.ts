/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClaimableBonus,
  ClaimableNFT,
  mapChapterDetails,
  mapLeaderboardEntry,
  mapLoreFragmentData,
  mapStoryDetails,
  mapUserProfile,
} from "@/lib/mappers";
import { contract, getIpfsDetails } from "@/lib/utils";
import {
  getContractEvents,
  prepareContractCall,
  prepareEvent,
  readContract,
  sendTransaction,
} from "thirdweb";

const totalStories = async () => {
  const totalStories = await readContract({
    contract: contract,
    method: "getTotalStories",
    params: [],
  });
  return Number(totalStories);
};

let isStoryLoading = false;

const getStories = async () => {
  isStoryLoading = true;
  const stories = [];
  try {
    const totalStoriesCount = await totalStories();
    for (let i = 0; i < totalStoriesCount; i++) {
      const rawStory = await readContract({
        contract: contract,
        method: "getStoryDetails",
        params: [BigInt(i)],
      });

      const story = mapStoryDetails(rawStory);

      const chapters = [];
      for (let j = 0; j < story.totalChapters; j++) {
        const rawChapter = await readContract({
          contract: contract,
          method: "getChapter",
          params: [BigInt(i), BigInt(j)],
        });
        let chapter = mapChapterDetails(rawChapter);
        const chapterDetails = await getIpfsDetails(chapter.ipfsHash);
        chapter = { ...chapter, ...chapterDetails };
        chapters.push(chapter);
      }
      story["chapters"] = chapters;
      stories.push(story);
    }
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  } finally {
    isStoryLoading = false;
  }
  return { stories, isStoryLoading };
};

export const getActiveStories = async () => {
  try {
    const { stories, isStoryLoading } = await getStories();
    // console.log("Fetched stories:", stories);
    const activeStories = stories.filter(
      (story) => story.status === 1 || story.status === 3
    ); // 1: Active, 3: Completed
    return { activeStories, isStoryLoading };
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};

export const getActiveProposals = async () => {
  const { stories: proposals, isStoryLoading: isProposalLoading } =
    await getStories();
  const activeProposals = proposals.filter(
    (proposal) => proposal?.status === 0
  );
  return { activeProposals, isProposalLoading };
};

export const getUserProposalVote = async (storyId, voter) => {
  if (!voter) return 0;
  try {
    const hasVoted = await readContract({
      contract: contract,
      method: "getUserProposalVote",
      params: [BigInt(storyId), voter],
    });
    return hasVoted;
  } catch (error) {
    console.error("Error checking if user has voted:", error);
    throw error;
  }
};

// Write Functions

const executeTransaction = async (method: any, params: any[], account: any) => {
  try {
    // Prepare the contract call
    const transaction = prepareContractCall({
      contract,
      method: method,
      params: params,
    });

    // Send the transaction
    const { transactionHash } = await sendTransaction({
      account, // the account sending the transaction
      transaction, // the prepared transaction
    });
    console.log(`Transaction successful: ${transactionHash}`);
    return transactionHash;
  } catch (error) {
    console.error(`Error executing ${method}:`, error);
    throw error;
  }
};

export const createStory = async (storyData: any, account: any) => {
  const storyDataValues = Object.values(storyData);
  try {
    const transactionHash = await executeTransaction(
      "createStoryProposal",
      storyDataValues,
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
};

export const voteOnProposal = async (
  storyId: number,
  voteType: 1 | 2, // 1 for Yes, 2 for No
  account: any
) => {
  try {
    const transactionHash = await executeTransaction(
      "voteOnProposal",
      [BigInt(storyId), voteType],
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error voting on proposal:", error);
    throw error;
  }
};

export const voteOnChapter = async (
  storyId: number,
  chapterId: number,
  choiceIndex: number,
  account: any
) => {
  try {
    const transactionHash = await executeTransaction(
      "voteOnChapter",
      [BigInt(storyId), BigInt(chapterId), BigInt(choiceIndex)],
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error voting on chapter:", error);
    throw error;
  }
};

export const resolveProposal = async (storyId: number, account: any) => {
  try {
    const transactionHash = await executeTransaction(
      "resolveProposal",
      [BigInt(storyId)],
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error resolving proposal:", error);
    throw error;
  }
};

export const resolveChapter = async (
  storyId: number,
  chapterId: number,
  account: any
) => {
  try {
    const transactionHash = await executeTransaction(
      "resolveChapter",
      [BigInt(storyId), BigInt(chapterId)],
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error resolving chapter:", error);
    throw error;
  }
};

export const addChapter = async (
  storyId: number,
  chapterData: any,
  account: any
) => {
  const chapterDataValues = Object.values(chapterData);
  try {
    const transactionHash = await executeTransaction(
      "addChapter",
      [BigInt(storyId), ...chapterDataValues],
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error adding chapter:", error);
    throw error;
  }
};

// Events
const getContractEvent = async (eventName: string) => {
  const myEvent = prepareEvent({
    signature: `event ${eventName}`,
  });

  const events = await getContractEvents({
    contract, // your thirdweb contract instance
    events: [myEvent],
  });

  return events.map((event: any) => event.args);
};

export const getVoteCastEvents = async () => {
  return await getContractEvent(
    "VoteCast(uint256 indexed storyId, uint256 indexed chapterId, address indexed voter, uint256 choiceIndex)"
  );
};

// User Profile Functions
const getUserProfile = async (userAddress: string) => {
  if (!userAddress) return null;
  try {
    const rawProfile = await readContract({
      contract: contract,
      method: "getUserProfile",
      params: [userAddress],
    });

    return mapUserProfile(rawProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const getUserFragments = async (userAddress: string) => {
  if (!userAddress) return [];
  try {
    const fragmentIds = await readContract({
      contract: contract,
      method: "getUserFragments",
      params: [userAddress],
    });
    return fragmentIds.map((id: any) => Number(id));
  } catch (error) {
    console.error("Error fetching user fragments:", error);
    throw error;
  }
};

const getFragmentData = async (tokenId: number) => {
  try {
    const rawFragment = await readContract({
      contract: contract,
      method: "getFragmentData",
      params: [BigInt(tokenId)],
    });

    return mapLoreFragmentData(rawFragment);
  } catch (error) {
    console.error("Error fetching fragment data:", error);
    throw error;
  }
};

const getTokenURI = async (tokenId: number) => {
  try {
    const tokenURI = await readContract({
      contract: contract,
      method: "tokenURI",
      params: [BigInt(tokenId)],
    });
    return tokenURI;
  } catch (error) {
    console.error("Error fetching token URI:", error);
    throw error;
  }
};

// Claimable NFTs
const canClaimFragment = async (
  storyId: number,
  chapterIndex: number,
  userAddress: string
) => {
  if (!userAddress) return false;
  try {
    const canClaim = await readContract({
      contract: contract,
      method: "canClaimFragment",
      params: [BigInt(storyId), BigInt(chapterIndex), userAddress],
    });
    return canClaim;
  } catch (error) {
    console.error("Error checking claimable fragment:", error);
    return false;
  }
};

const canClaimCompletionBonus = async (
  storyId: number,
  userAddress: string
) => {
  if (!userAddress) return false;
  try {
    const canClaim = await readContract({
      contract: contract,
      method: "canClaimCompletionBonus",
      params: [BigInt(storyId), userAddress],
    });
    return canClaim;
  } catch (error) {
    console.error("Error checking completion bonus:", error);
    return false;
  }
};

// Leaderboard
export const getLeaderboard = async (start: number = 0, count: number = 50) => {
  try {
    const rawLeaderboard = await readContract({
      contract: contract,
      method: "getLeaderboard",
      params: [BigInt(start), BigInt(count)],
    });
    return rawLeaderboard.map(mapLeaderboardEntry);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
};

export const getUserCompleteProfile = async (userAddress: string) => {
  if (!userAddress) return null;

  try {
    // Get basic profile
    const profile = await getUserProfile(userAddress);

    // Get owned NFTs
    const fragmentIds = await getUserFragments(userAddress);
    const ownedNFTs = [];

    for (const tokenId of fragmentIds) {
      const fragmentData = await getFragmentData(tokenId);
      const storyDetails = await readContract({
        contract: contract,
        method: "getStoryDetails",
        params: [BigInt(fragmentData.storyId)],
      });
      const story = mapStoryDetails(storyDetails);

      ownedNFTs.push({
        tokenId,
        ...fragmentData,
        storyTitle: story.title,
        tokenURI: await getTokenURI(tokenId),
        image: story.ipfsHashImage, // Use story image for NFT
      });
    }

    // Get claimable NFTs
    const claimableNFTs: ClaimableNFT[] = [];
    const claimableBonuses: ClaimableBonus[] = [];

    const totalStoriesCount = await totalStories();

    for (let storyId = 0; storyId < totalStoriesCount; storyId++) {
      const storyDetails = await readContract({
        contract: contract,
        method: "getStoryDetails",
        params: [BigInt(storyId)],
      });
      const story = mapStoryDetails(storyDetails);

      // Check each chapter for claimable NFTs
      for (
        let chapterIndex = 0;
        chapterIndex < story.totalChapters;
        chapterIndex++
      ) {
        const canClaim = await canClaimFragment(
          storyId,
          chapterIndex,
          userAddress
        );
        if (canClaim) {
          // Check if early voter
          const isEarlyVote = await readContract({
            contract: contract,
            method: "earlyVoters",
            params: [BigInt(storyId), BigInt(chapterIndex), userAddress],
          });

          const rawChapter = await readContract({
            contract: contract,
            method: "getChapter",
            params: [BigInt(storyId), BigInt(chapterIndex)],
          });
          const chapter = mapChapterDetails(rawChapter);
          const chapterContent = await getIpfsDetails(chapter.ipfsHash);

          claimableNFTs.push({
            storyId,
            chapterIndex,
            storyTitle: story.title,
            chapterTitle: chapterContent.title,
            choiceIndex: chapterContent?.votingOptions?.findIndex(
              (option: any) => option.owner === userAddress
            ),
            estimatedPoints: isEarlyVote ? 75 : 50, // 50 base + 25 early bonus
            isEarlyVote,
            image: story.ipfsHashImage, // Use story image for claimable NFT
          });
        }
      }

      // Check completion bonus
      const canClaimCompletion = await canClaimCompletionBonus(
        storyId,
        userAddress
      );
      if (canClaimCompletion) {
        claimableBonuses.push({
          storyId,
          storyTitle: story.title,
          bonusPoints: 100,
          type: "completion",
          image: story.ipfsHashImage,
        });
      }
    }

    // console.log("User complete profile:", {
    //   profile,
    //   ownedNFTs,
    //   claimableNFTs,
    //   claimableBonuses,
    // });

    return {
      profile,
      ownedNFTs,
      claimableNFTs,
      claimableBonuses,
    };
  } catch (error) {
    console.error("Error fetching complete user profile:", error);
    throw error;
  }
};

export const registerUser = async (referrerAddress: string, account: any) => {
  try {
    const transactionHash = await executeTransaction(
      "registerUser",
      [referrerAddress || "0x0000000000000000000000000000000000000000"],
      account
    );
    return transactionHash;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const claimWinnerFragment = async (
  storyId: number,
  chapterIndex: number,
  account: any
) => {
  try {
    const transactionHash = await executeTransaction(
      "claimWinnerFragment",
      [BigInt(storyId), BigInt(chapterIndex)],
      account
    );
    setTimeout(async () => {
      await getUserCompleteProfile(account?.address); // Refresh user profile after claiming
    }, 1000); // Delay to ensure state updates
    return transactionHash;
  } catch (error) {
    console.error("Error claiming winner fragment:", error);
    throw error;
  }
};

export const claimStoryCompletionBonus = async (
  storyId: number,
  account: any
) => {
  try {
    const transactionHash = await executeTransaction(
      "claimStoryCompletionBonus",
      [BigInt(storyId)],
      account
    );

    return transactionHash;
  } catch (error) {
    console.error("Error claiming completion bonus:", error);
    throw error;
  }
};

export const endStory = async (storyId: number, account: any) => {
  try {
    const transactionHash = await executeTransaction(
      "endStory",
      [BigInt(storyId)],
      account
    );
    setTimeout(async () => {
      await getActiveStories(); // Refresh active stories after ending
    }, 1000); // Delay to ensure state updates
    return transactionHash;
  } catch (error) {
    console.error("Error ending story:", error);
    throw error;
  }
};
