import { mapChapterDetails, mapStoryDetails } from "@/lib/mappers";
import { contract, getIpfsDetails } from "@/lib/utils";
import { readContract } from "thirdweb";

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
    console.log("Fetched stories:", stories);
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
  const activeProposals = proposals.filter((proposal) => proposal.status === 0);
  return { activeProposals, isProposalLoading };
};
