import { Link } from "react-router-dom";
import { Clock, Users, BookOpen, Crown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatAddress, getTimeAgo } from "@/lib/utils";

const StoryCard = ({ story, className = "" }) => {
  const totalVotes =
    story?.chapters?.reduce((acc, chapter) => acc + chapter?.voteCountSum, 0) ||
    0;
  story.trending = totalVotes >= 2;
  return (
    <Link
      to={`/stories/${story?.storyId}`}
      className={`story-card block hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card border border-border rounded-xl overflow-hidden ${className}`}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={story?.ipfsHashImage}
          alt={story?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-primary/90 text-white border-0"
          >
            {story?.status === 1
              ? "Active"
              : story?.status === 3
              ? "Completed"
              : "Paused"}
          </Badge>
        </div>

        {/* Trending Badge */}
        {story?.trending && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-secondary/90 text-secondary-foreground border-0"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Creator */}
        <div className="mb-3">
          <h3 className="text-lg font-display font-semibold text-foreground mb-1 line-clamp-2">
            {story?.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Crown className="h-3 w-3" />
            <span>by {formatAddress(story?.writer)}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {story?.summary}
        </p>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {story?.chapters[0].genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
          {story?.chapters[0].genres.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{story?.chapters[0].genres.length - 2}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{totalVotes} votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>{story?.collaborators.length + 1} authors</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(story?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
