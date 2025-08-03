/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

export const StoryDataContext = createContext({
  stories: [],
  proposals: [],
  isLoading: false,
  addStory: (formData: any): Promise<any> => Promise.resolve(null),
  addChapter: (story, formData): Promise<any> => Promise.resolve(null),
  voteOnProposal: (proposalId: any, voteType: any): Promise<any> =>
    Promise.resolve(null),
  voteOnChapter: (
    storyId: any,
    chapterId: any,
    choiceIndex: any
  ): Promise<any> => Promise.resolve(null),
  resolveStoryProposal: (storyId: any): Promise<any> => Promise.resolve(null),
  resolveStoryChapter: (storyId: any, chapterId: any): Promise<any> =>
    Promise.resolve(null),
  endStory: (storyId: any): Promise<any> => Promise.resolve(null),
});
