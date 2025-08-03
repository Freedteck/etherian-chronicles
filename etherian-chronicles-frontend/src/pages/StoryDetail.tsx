import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  Crown,
  Users,
  Clock,
  BookOpen,
  Vote,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import VotingInterface from "@/components/Story/VotingInterface";
import AddChapterModal from "@/components/Story/AddChapterModal";
import { Blobbie, useActiveAccount } from "thirdweb/react";
import { getVoteCastEvents, resolveChapter } from "@/data/proposalData";
import { formatAddress, getTimeAgo } from "@/lib/utils";
import ProposalLoading from "@/components/ui/proposalLoading";
import { StoryDataContext } from "@/contexts/storyDataContext";
import toast from "react-hot-toast";

const StoryDetail = () => {
  const { id } = useParams();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [userVotes, setUserVotes] = useState({});
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [story, setStory] = useState(null);
  const account = useActiveAccount();
  const {
    isLoading,
    stories,
    voteOnChapter,
    addChapter,
    resolveStoryChapter,
    endStory,
  } = useContext(StoryDataContext);

  useEffect(() => {
    const fetchStory = async () => {
      const currentStory = stories.find((p) => p.storyId === +id);
      setStory(currentStory);
      if (currentStory) {
        const userVoteOption = await getVoteCastEvents();
        setUserVotes(
          userVoteOption.filter(
            (vote) =>
              vote.voter === account?.address && Number(vote.storyId) === +id
          )
        );
      }
    };
    fetchStory();
  }, [id, account, stories]);

  if (isLoading) {
    return <ProposalLoading />;
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Story Not Found
          </h1>
          <Link to="/stories">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = story.chapters.reduce(
    (acc, chapter) => acc + chapter.voteCountSum,
    0
  );
  const currentChapter = story.chapters[currentChapterIndex];

  const handleVote = async (chapterId: number, choiceId: number) => {
    console.log("Voting for choice:", choiceId);
    const toastId = toast.loading(`Voting for choice: ${choiceId}`);
    try {
      const transactionHash = await voteOnChapter(
        story.storyId,
        chapterId,
        choiceId
      );
      console.log(`Vote cast successfully: ${transactionHash}`);
      toast.dismiss(toastId);
      toast.success(
        "Vote Recorded, your choice will help shape the story's direction."
      );
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error(`Vote failed, ${error.message}`);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied!, Share this epic tale with others.");
  };

  const handleResolve = async () => {
    if (!story) return;
    const toastId = toast.loading(
      "Please wait while the chapter is being resolved."
    );
    try {
      const transactionHash = await resolveStoryChapter(
        story.storyId,
        currentChapter.chapterId
      );
      toast.dismiss(toastId);
      toast.success(
        `Chapter Resolved!
        The chapter has been resolved successfully.`
      );

      console.log(`Chapter resolved successfully: ${transactionHash}`);
    } catch (error) {
      console.error("Error resolving chapter:", error);
      toast.dismiss(toastId);
      toast.error("There was an error resolving the chapter, please try again");
    }
  };

  const handleEndStory = async () => {
    if (!story) return;
    const toastId = toast.loading("Please wait while we end the story.");
    try {
      const transactionHash = await endStory(story.storyId);
      toast.dismiss(toastId);
      toast.success("The story has been ended successfully.");
      console.log(`Story ended successfully: ${transactionHash}`);
    } catch (error) {
      console.error("Error ending story:", error);
      toast.dismiss(toastId);
      toast.error(`There was an error ending the story: ${error.message}`);
    }
  };

  const handleChapterAdded = async (formData) => {
    const toastId = toast.loading("Please wait while we add your chapter.");

    try {
      const transaction = await addChapter(story, formData);

      console.log(`Chapter added successfully: ${transaction}`);
      toast.dismiss(toastId);
      toast.success("Your chapter has been added to the story.");
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error(
        "There was an error while adding the chapter, please try again"
      );
    }
  };

  // Check if current user is author or collaborator
  const isAuthorOrCollaborator = story.collaborators.includes(account?.address); // In real app, check against user data

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Story Cover */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={story.ipfsHashImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
          <div className="max-w-4xl">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link to="/stories">
                <Button
                  variant="ghost"
                  className="text-foreground hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Stories
                </Button>
              </Link>
            </div>

            {/* Story Title and Meta */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Badge
                  className={
                    story.status === 1 || story.status === 3
                      ? "bg-primary/90 text-white"
                      : "bg-secondary/90 text-white"
                  }
                >
                  {story.status === 1
                    ? "Active Story"
                    : story.status === 3
                    ? "Complete Story"
                    : "Paused Story"}
                </Badge>
                <div className="text-foreground/80 text-sm">
                  Chapter {currentChapterIndex + 1} of {story.chapters.length}
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground  mb-4 leading-tight">
                {story.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-foreground/80 text-sm mb-4">
                <div className="flex items-center space-x-1">
                  <Crown className="h-4 w-4" />
                  <span>by {formatAddress(story?.writer)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{story.collaborators.length} collaborators</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Vote className="h-4 w-4" />
                  <span>{totalVotes} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {getTimeAgo(story.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {isAuthorOrCollaborator &&
                  !currentChapter.isResolved &&
                  !currentChapter.isLastChapter && (
                    <Button className="btn-mystical" onClick={handleResolve}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Resolve Chapter
                    </Button>
                  )}
                {isAuthorOrCollaborator &&
                  // story.chapters[story.chapters.length - 1].isResolved &&
                  story.chapters[story.chapters.length - 1].isLastChapter && (
                    <Button className="btn-mystical" onClick={handleEndStory}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      End Story
                    </Button>
                  )}
                <Button
                  variant="default"
                  onClick={handleShare}
                  // className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Story Summary and Genres */}
        <div className="mb-8">
          <div className="bg-card rounded-xl border border-border p-8">
            <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
              {story.summary}
            </p>

            <div className="flex flex-wrap gap-2">
              {story.chapters[0].genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">
                {currentChapter.title}
              </h2>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))
                  }
                  disabled={currentChapterIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground px-3">
                  {currentChapterIndex + 1} / {story.chapters.length}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentChapterIndex(
                      Math.min(
                        story.chapters.length - 1,
                        currentChapterIndex + 1
                      )
                    )
                  }
                  disabled={currentChapterIndex === story.chapters.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Reading Area */}
        <div className="grid xl:grid-cols-4 gap-8">
          {/* Chapter Content */}
          <div className="xl:col-span-3">
            {/* Chapter Text */}
            <div className="bg-card rounded-xl border border-border p-8 mb-8">
              <div className="prose prose-lg max-w-none font-serif">
                <p className="text-foreground leading-relaxed text-lg">
                  {currentChapter.content}
                </p>
              </div>
            </div>

            {/* Voting Interface */}
            {currentChapter.choices && (
              <VotingInterface
                chapter={currentChapter}
                onVote={(choiceId) =>
                  handleVote(currentChapter.chapterId, choiceId)
                }
                userVote={userVotes[currentChapter.chapterId]}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Story Progress */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Chapters
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {story.chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapterId}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentChapterIndex
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setCurrentChapterIndex(index)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index <= currentChapterIndex
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {chapter.title}
                      </div>
                      {chapter.isResolved ? (
                        <div className="text-xs text-muted-foreground">
                          Resolved
                        </div>
                      ) : (
                        <div className="text-xs text-primary">Voting Open</div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Chapter Button for Authors/Collaborators */}
                {isAuthorOrCollaborator && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setShowAddChapterModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Chapter
                  </Button>
                )}
              </div>
            </div>

            {/* Story Team */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Story Team
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {formatAddress(story?.writer)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Story Creator
                    </div>
                  </div>
                </div>

                {story?.collaborators
                  .filter((collab) => collab !== story?.writer)
                  .slice(0, 3)
                  .map((collaborator, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2"
                    >
                      <Blobbie
                        address={collaborator}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {formatAddress(collaborator)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Collaborator
                        </div>
                      </div>
                    </div>
                  ))}

                {story.collaborators.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    +{story.collaborators.length - 3} more collaborators
                  </div>
                )}
              </div>
            </div>

            {/* Story Stats */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Votes
                  </span>
                  <span className="text-sm font-medium">{totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Collaborators
                  </span>
                  <span className="text-sm font-medium">
                    {story.collaborators.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Update
                  </span>
                  <span className="text-sm font-medium">
                    {getTimeAgo(
                      story.chapters[story.chapters.length - 1].createdAt
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Chapter Modal */}
      <AddChapterModal
        isOpen={showAddChapterModal}
        onClose={() => setShowAddChapterModal(false)}
        storyTitle={story.title}
        chapterNumber={story.chapters.length + 1}
        onChapterAdded={handleChapterAdded}
      />
    </div>
  );
};

export default StoryDetail;
