import { Link } from "react-router-dom";
import { Crown, ThumbsUp, ThumbsDown, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/lib/utils";

const ProposalCard = ({ proposal, className = "" }) => {
  const totalVotes = proposal.proposalYesVote + proposal.proposalNoVote;
  const approvalPercentage =
    totalVotes > 0 ? (proposal.proposalYesVote / totalVotes) * 100 : 0;
  const daysLeft = Math.ceil(
    (new Date(proposal.proposalVoteEndTime).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      to={`/proposals/${proposal.storyId}`}
      className={`proposal-card block hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border border-border rounded-xl overflow-hidden ${className}`}
    >
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={proposal.ipfsHashImage}
          alt={proposal.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`
            ${proposal.status === 0 ? "bg-primary/90 text-white" : "bg-muted"}
          `}
          >
            {proposal.status === 0 ? "Voting Open" : "Voting Closed"}
          </Badge>
        </div>

        {/* Time Left */}
        {proposal.status === 0 && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="outline"
              className="bg-background/90 text-foreground border-border/50"
            >
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft > 0 ? `${daysLeft}d left` : "Ending soon"}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Creator */}
        <div className="mb-3">
          <h3 className="text-lg font-display font-semibold text-foreground mb-1 line-clamp-2">
            {proposal.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Crown className="h-3 w-3" />
            <span>by {formatAddress(proposal.writer)}</span>
            <span>•</span>
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(proposal.proposalVoteEndTime).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {proposal.summary}
        </p>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {proposal.chapters[0].tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {proposal.chapters[0].tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{proposal.chapters[0].tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Voting Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-3 w-3 text-primary" />
                <span>{proposal.proposalYesVote}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsDown className="h-3 w-3 text-destructive" />
                <span>{proposal.proposalNoVote}</span>
              </div>
            </div>
            <span>{Math.round(approvalPercentage)}% approval</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${approvalPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProposalCard;
