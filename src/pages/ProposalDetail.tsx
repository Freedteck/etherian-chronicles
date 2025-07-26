import { useParams, Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Crown,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  Share2,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import { useToast } from "@/hooks/use-toast";
import {
  getActiveProposals,
  getUserProposalVote,
  voteOnProposal,
} from "@/data/proposalData";
import { formatAddress, getTimeAgo, getTimeRemaining } from "@/lib/utils";
import { useActiveAccount } from "thirdweb/react";

const ProposalDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [isProposalLoading, setIsProposalLoading] = useState(false);
  const account = useActiveAccount();

  const fetchProposal = useCallback(async () => {
    setIsProposalLoading(true);
    const { activeProposals, isProposalLoading } = await getActiveProposals();
    const currentProposal = activeProposals.find((p) => p.storyId === +id);
    setProposal(currentProposal);

    if (currentProposal) {
      const userVoteOption = await getUserProposalVote(
        currentProposal.storyId,
        account?.address
      );
      setHasVoted(userVoteOption > 0);
      setUserVote(userVoteOption);
      setIsProposalLoading(isProposalLoading);
    }
  }, [id, account]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  if (isProposalLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Proposal Not Found
          </h1>
          <Link to="/proposals">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Proposals
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = proposal.proposalYesVotes + proposal.proposalNoVotes;
  const approvalPercentage =
    totalVotes > 0 ? (proposal.proposalYesVotes / totalVotes) * 100 : 0;

  const handleVote = async (voteType) => {
    if (hasVoted) return;

    toast({
      title: "Submitting your vote...",
      description: "Please wait while we process your vote.",
    });
    const transactionHash = await voteOnProposal(
      proposal.storyId,
      voteType,
      account // the account sending the transaction
    );

    if (transactionHash) {
      toast({
        title: "Vote submitted",
        description: `You voted ${
          voteType === 1 ? "For" : "Against"
        } this proposal.`,
      });

      fetchProposal();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Share this proposal with others.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/proposals">
            <Button variant="ghost" className="hover:bg-muted/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Proposals
            </Button>
          </Link>
        </div>

        {/* Proposal Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover Image */}
            <div className="lg:w-1/3">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src={proposal.ipfsHashImage}
                  alt={proposal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={
                      proposal.status === 0 ? "bg-primary" : "bg-muted"
                    }
                  >
                    {proposal.status === 0 ? "Voting Open" : "Voting Closed"}
                  </Badge>
                </div>

                {/* Time Left */}
                {proposal.status === 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeRemaining(proposal.proposalVoteEndTime)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Proposal Info */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
                {proposal.title}
              </h1>

              <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Crown className="h-4 w-4" />
                  <span>by {formatAddress(proposal.writer)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Proposed {getTimeAgo(proposal.createdAt)}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {proposal.summary}
              </p>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {proposal.chapters[0].genres.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Voting Stats */}
              <div className="bg-card rounded-xl border border-border p-6 mb-6">
                <h3 className="font-display font-semibold mb-4">
                  Voting Results
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="h-4 w-4 text-primary" />
                        <span className="font-semibold">
                          {proposal.proposalYesVotes}
                        </span>
                        <span className="text-muted-foreground">For</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ThumbsDown className="h-4 w-4 text-destructive" />
                        <span className="font-semibold">
                          {proposal.proposalNoVotes}
                        </span>
                        <span className="text-muted-foreground">Against</span>
                      </div>
                    </div>
                    <span className="font-semibold">
                      {Math.round(approvalPercentage)}% approval
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${approvalPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {proposal.status === 0 && !hasVoted ? (
                <div className="flex flex-wrap gap-3 mb-4">
                  <Button
                    className="btn-mystical"
                    onClick={() => handleVote(1)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Vote For
                  </Button>
                  <Button variant="destructive" onClick={() => handleVote(2)}>
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Vote Against
                  </Button>
                </div>
              ) : hasVoted ? (
                <div className="mb-4">
                  <Badge className="bg-primary/90 text-white">
                    <Vote className="h-3 w-3 mr-1" />
                    You voted{" "}
                    {userVote > 0 && (userVote === 1 ? "For" : "Against")}
                  </Badge>
                </div>
              ) : (
                <div className="mb-4">
                  <Badge variant="outline">Voting Closed</Badge>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* First Chapter Preview */}
        <div className="bg-card rounded-xl border border-border p-8">
          <h2 className="text-xl font-display font-bold mb-4">
            First Chapter Preview
          </h2>
          <h3 className="text-lg font-semibold mb-4">
            {proposal.chapters[0].title}
          </h3>

          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-foreground leading-relaxed">
              {proposal.chapters[0].content}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Potential Choices:</h4>
            {proposal.chapters[0].votingOptions.map((choice, index) => (
              <div
                key={index}
                className="p-3 bg-muted/30 rounded-lg border border-border"
              >
                <span className="text-sm">{choice.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetail;
