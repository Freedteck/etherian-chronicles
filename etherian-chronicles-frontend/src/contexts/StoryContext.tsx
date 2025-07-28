import { useCallback, useEffect, useState } from "react";
import { StoryDataContext } from "./storyDataContext";
import { uploadJsonToPinata } from "@/lib/pinata";
import {
  addChapter,
  createStory,
  getActiveProposals,
  getActiveStories,
  resolveChapter,
  resolveProposal,
  voteOnChapter,
  voteOnProposal,
} from "@/data/proposalData";
import { useActiveAccount } from "thirdweb/react";

const StoryContext = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const account = useActiveAccount();

  const getStories = useCallback(async () => {
    const { activeStories, isStoryLoading } = await getActiveStories();
    setStories(activeStories);
    setIsLoading(isStoryLoading);
  }, []);

  const getProposals = useCallback(async () => {
    const { activeProposals, isProposalLoading } = await getActiveProposals();
    setProposals(activeProposals);
    setIsLoading(isProposalLoading);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getStories(), getProposals()]);
      } catch (error) {
        console.error("Error fetching stories or proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getStories, getProposals]);

  const addStory = async (formData) => {
    try {
      const firstChapter = {
        title: formData.chapterTitle,
        content: formData.firstChapter,
        votingOptions: formData.votingOptions,
        genres: formData.genres,
      };

      const firstChapterIpfsUrl = await uploadJsonToPinata(firstChapter);

      const storyData = {
        _title: formData.title,
        _summary: formData.summary,
        _ipfsHashImage: formData.coverImage,
        _ipfsHashChapter1Content: firstChapterIpfsUrl,
        _chapter1Choices: formData.votingOptions,
        _collaborators: formData.collaborators.map((c) => c.address),
      };

      const transactionHash = await createStory(storyData, account);
      await getProposals(); // Refresh proposals after adding a new one
      return transactionHash;
    } catch (error) {
      console.error("Error creating story:", error);
      throw error;
    }
  };

  const addStoryChapter = async (story, formData) => {
    try {
      const chapterMetadata = {
        title: formData.title,
        content: formData.content,
        votingOptions: formData.votingOptions,
        genres: formData.genres,
      };

      const chapterIpfsUrl = await uploadJsonToPinata(chapterMetadata);
      const chapterData = {
        _previousChapterIndex: story.currentChapterIndex,
        _previousChapterWinningChoiceIndex:
          story.chapters[story.currentChapterIndex].winningChoiceIndex,
        _ipfsHash: chapterIpfsUrl,
        _choices: formData.votingOptions,
      };
      const transactionHash = await addChapter(
        story.storyId,
        chapterData,
        account
      );
      await getStories(); // Refresh stories after adding a chapter
      return transactionHash;
    } catch (error) {
      console.error("Error adding chapter:", error);
      throw error;
    }
  };

  const voteOnStoryChapter = async (storyId, chapterId, choiceIndex) => {
    try {
      const transactionHash = await voteOnChapter(
        storyId,
        chapterId,
        choiceIndex,
        account
      );
      await getStories(); // Refresh stories after voting
      return transactionHash;
    } catch (error) {
      console.error("Error voting on chapter:", error);
      throw error;
    }
  };

  const voteOnStoryProposal = async (proposalId, voteType) => {
    try {
      const transactionHash = await voteOnProposal(
        proposalId,
        voteType,
        account // the account sending the transaction
      );
      await getProposals(); // Refresh proposals after voting
      return transactionHash;
    } catch (error) {
      console.error("Error voting on proposal:", error);
      throw error;
    }
  };

  const resolveStoryProposal = async (storyId) => {
    try {
      const transactionHash = await resolveProposal(storyId, account);
      await getProposals(); // Refresh proposals after resolving
      await getStories(); // Refresh stories after resolving
      return transactionHash;
    } catch (error) {
      console.error("Error resolving proposal:", error);
      throw error;
    }
  };

  const resolveStoryChapter = async (storyId, chapterId) => {
    try {
      const transactionHash = await resolveChapter(storyId, chapterId, account);
      await getStories(); // Refresh stories after resolving chapter
      return transactionHash;
    } catch (error) {
      console.error("Error resolving chapter:", error);
      throw error;
    }
  };
  return (
    <StoryDataContext.Provider
      value={{
        stories,
        proposals,
        isLoading,
        addStory,
        addChapter: addStoryChapter,
        voteOnProposal: voteOnStoryProposal,
        voteOnChapter: voteOnStoryChapter,
        resolveStoryProposal,
        resolveStoryChapter,
      }}
    >
      {children}
    </StoryDataContext.Provider>
  );
};

export default StoryContext;
