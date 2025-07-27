import { useState, useEffect } from "react";
import { CheckCircle, Clock, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const VotingInterface = ({ chapter, onVote, userVote = null }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const { toast } = useToast();
  const selectedChoice = userVote;

  // Calculate time remaining
  useEffect(() => {
    const updateTimer = () => {
      const deadline = new Date(chapter.voteEndTime * 1000); // Convert to milliseconds
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h remaining`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m remaining`);
        } else {
          setTimeLeft(`${minutes}m remaining`);
        }
      } else {
        setTimeLeft("Voting ended");
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [chapter.voteEndTime]);

  const handleVote = (choiceId) => {
    console.log("Voting for choice:", choiceId);
    if (chapter.isResolved) return;
    onVote(choiceId);

    toast({
      title: "Vote Cast!",
      description:
        "Your vote has been recorded. The community decides the story's path.",
    });
  };

  const totalVotes = chapter.voteCountSum;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-1">
            Choose the Next Path
          </h3>
          <p className="text-sm text-muted-foreground">
            Your vote shapes the story's direction
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{totalVotes} total votes</span>
          </div>
        </div>
      </div>

      {/* Voting Status */}
      {chapter.isResolved && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Voting Complete</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            The community has chosen the winning path. The next chapter will
            continue this storyline.
          </p>
        </div>
      )}

      {/* Choices */}
      <div className="space-y-4">
        {chapter.choices.map((choice, index) => {
          const percentage =
            totalVotes > 0 ? (choice.voteCount / totalVotes) * 100 : 0;
          const isSelected = Number(selectedChoice?.choiceIndex) === index;
          const isWinner =
            chapter.isResolved &&
            chapter.winningChoiceIndex === choice.nextChapterIndex;
          const isVotingOpen =
            !chapter.isResolved &&
            new Date() < new Date(chapter.voteEndTime * 1000);

          return (
            <div
              key={index}
              className={`relative border rounded-lg p-4 transition-all duration-300 cursor-pointer hover:border-primary/50 ${
                isSelected ? "border-primary bg-primary/5" : "border-border"
              } ${isWinner ? "ring-2 ring-secondary glow-secondary" : ""}`}
              onClick={() => isVotingOpen && handleVote(index)}
            >
              {/* Choice Content */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Option {String.fromCharCode(65 + index)}
                    </Badge>
                    {isWinner && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    )}
                    {isSelected && !chapter.isResolved && (
                      <Badge className="bg-primary text-primary-foreground">
                        Your Vote
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {choice.text}
                  </p>
                </div>
              </div>

              {/* Vote Count and Progress */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{choice.voteCount} votes</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isWinner ? "bg-secondary" : "bg-primary"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Vote Button for Open Voting */}
              {isVotingOpen && selectedChoice && (
                <div className="mt-3">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`w-full ${isSelected ? "btn-mystical" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(index);
                    }}
                  >
                    {isSelected ? "Vote Cast" : "Cast Vote"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {!chapter.isResolved && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              View Discussion
            </Button>
            {/* <Button className="btn-golden flex-1">Share Story</Button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingInterface;
