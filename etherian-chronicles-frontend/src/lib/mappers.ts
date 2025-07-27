/* eslint-disable @typescript-eslint/no-explicit-any */
// Contract Response Mappers for EtherianChronicle

export interface Choice {
  text: string;
  voteCount: any;
  nextChapterIndex: any;
}

export interface ChapterDetails {
  chapterId: number;
  ipfsHash: string;
  choices: any[];
  createdAt: number;
  voteEndTime: number;
  winningChoiceIndex: number;
  isResolved: boolean;
  voteCountSum: number;
}

export interface ChapterBasicInfo {
  chapterId: number;
  ipfsHash: string;
  createdAt: number;
  voteEndTime: number;
  winningChoiceIndex: number;
  isResolved: boolean;
  voteCountSum: number;
  totalChoices: number;
}

export interface MultipleStoriesBasicInfo {
  storyIds: number[];
  titles: string[];
  writers: string[];
  statuses: number[];
}

export interface ProposalInfo {
  proposalVoteEndTime: number;
  proposalYesVotes: number;
  proposalNoVotes: number;
  isVotingActive: boolean;
}

export interface ProposalVoteCounts {
  yesVotes: number;
  noVotes: number;
}

export interface StoryBasicInfo {
  title: string;
  summary: string;
  writer: string;
  status: number;
  totalChapters: number;
}

export interface StoryDetails {
  storyId: number;
  writer: string;
  title: string;
  summary: string;
  ipfsHashImage: string;
  collaborators: string[];
  status: number;
  createdAt: number;
  proposalVoteEndTime: number;
  proposalYesVotes: number;
  proposalNoVotes: number;
  currentChapterIndex: number;
  totalChapters: number;
}

export interface Story {
  storyId: number;
  writer: string;
  title: string;
  summary: string;
  ipfsHashImage: string;
  status: number;
  createdAt: number;
  proposalVoteEndTime: number;
  proposalYesVotes: number;
  proposalNoVotes: number;
  currentChapterIndex: number;
}

// Mapping functions
export const mapChoice = (rawChoice: any): Choice => ({
  text: rawChoice?.text?.toString(),
  voteCount: Number(rawChoice.voteCount),
  nextChapterIndex: Number(rawChoice.nextChapterIndex),
});

export const mapChapterDetails = (rawChapter: any): ChapterDetails => {
  return {
    chapterId: Number(rawChapter[0]),
    ipfsHash: rawChapter[1],
    choices: rawChapter[2].map(mapChoice),
    createdAt: Number(rawChapter[3]),
    voteEndTime: Number(rawChapter[4]),
    winningChoiceIndex: Number(rawChapter[5]),
    isResolved: rawChapter[6],
    voteCountSum: Number(rawChapter[7]),
  };
};

export const mapChapterBasicInfo = (rawChapter: any): ChapterBasicInfo => ({
  chapterId: Number(rawChapter[0]),
  ipfsHash: rawChapter[1],
  createdAt: Number(rawChapter[2]),
  voteEndTime: Number(rawChapter[3]),
  winningChoiceIndex: Number(rawChapter[4]),
  isResolved: rawChapter[5],
  voteCountSum: Number(rawChapter[6]),
  totalChoices: Number(rawChapter[7]),
});

export const mapChapterChoices = (rawChoices: any[]): Choice[] =>
  rawChoices.map(mapChoice);

export const mapMultipleStoriesBasicInfo = (
  rawData: any
): MultipleStoriesBasicInfo => ({
  storyIds: rawData[0].map((id: any) => Number(id)),
  titles: rawData[1],
  writers: rawData[2],
  statuses: rawData[3].map((status: any) => Number(status)),
});

export const mapProposalInfo = (rawProposal: any): ProposalInfo => ({
  proposalVoteEndTime: Number(rawProposal[0]),
  proposalYesVotes: Number(rawProposal[1]),
  proposalNoVotes: Number(rawProposal[2]),
  isVotingActive: rawProposal[3],
});

export const mapProposalVoteCounts = (rawVotes: any): ProposalVoteCounts => ({
  yesVotes: Number(rawVotes[0]),
  noVotes: Number(rawVotes[1]),
});

export const mapStoryBasicInfo = (rawStory: any): StoryBasicInfo => ({
  title: rawStory[0],
  summary: rawStory[1],
  writer: rawStory[2],
  status: Number(rawStory[3]),
  totalChapters: Number(rawStory[4]),
});

export const mapStoryDetails = (rawStory: any): StoryDetails => ({
  storyId: Number(rawStory[0]),
  writer: rawStory[1],
  title: rawStory[2],
  summary: rawStory[3],
  ipfsHashImage: rawStory[4],
  collaborators: rawStory[5],
  status: Number(rawStory[6]),
  createdAt: Number(rawStory[7]),
  proposalVoteEndTime: Number(rawStory[8]),
  proposalYesVotes: Number(rawStory[9]),
  proposalNoVotes: Number(rawStory[10]),
  currentChapterIndex: Number(rawStory[11]),
  totalChapters: Number(rawStory[12]),
});

export const mapStory = (rawStory: any): Story => ({
  storyId: Number(rawStory[0]),
  writer: rawStory[1],
  title: rawStory[2],
  summary: rawStory[3],
  ipfsHashImage: rawStory[4],
  status: Number(rawStory[5]),
  createdAt: Number(rawStory[6]),
  proposalVoteEndTime: Number(rawStory[7]),
  proposalYesVotes: Number(rawStory[8]),
  proposalNoVotes: Number(rawStory[9]),
  currentChapterIndex: Number(rawStory[10]),
});

// Helper function to map story collaborators (already string array, no mapping needed)
export const mapStoryCollaborators = (rawCollaborators: string[]): string[] =>
  rawCollaborators;
