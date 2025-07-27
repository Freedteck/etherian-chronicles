import { useContext, useEffect, useState } from "react";
import { Search, BookOpen, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StoryCard from "@/components/Story/StoryCard";
import Header from "@/components/Layout/Header";
import PageBanner from "@/components/Layout/PageBanner";
import CardLoading from "@/components/ui/cardLoaing";
import { StoryDataContext } from "@/contexts/storyDataContext";

const Stories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const { stories, isLoading } = useContext(StoryDataContext);

  const allGenres = [
    "all",
    "Fantasy",
    "Adventure",
    "Steampunk",
    "Political",
    "Revolution",
    "Technology",
  ];

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" ||
      story.chapters[0].genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    const storyATotalVotes = a.proposalYesVotes + a.proposalNoVotes || 0;
    const storyBTotalVotes = b.proposalYesVotes + b.proposalNoVotes || 0;
    switch (sortBy) {
      case "trending":
        return storyBTotalVotes - storyATotalVotes;
      case "newest":
        return (
          new Date(b.createdAt * 1000).getTime() -
          new Date(a.createdAt * 1000).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageBanner
        title="Story Collection"
        subtitle="Discover epic tales shaped by community choices"
        badge={{ icon: BookOpen, text: "Interactive Stories" }}
        backgroundImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
        size="small"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              {allGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre ? "btn-mystical" : ""}
                >
                  {genre === "all" ? "All Genres" : genre}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex space-x-1">
                {[
                  { key: "trending", label: "Trending", icon: TrendingUp },
                  { key: "newest", label: "Newest", icon: Clock },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.key}
                      variant={sortBy === option.key ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSortBy(option.key)}
                      className={`${
                        sortBy === option.key ? "btn-mystical" : ""
                      } flex items-center space-x-1`}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {sortedStories.length} of {stories.length} stories
          </p>
        </div>

        {/* Stories Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <CardLoading />
          ) : sortedStories.length > 0 ? (
            sortedStories.map((story) => (
              <StoryCard key={story.storyId} story={story} />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No stories found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Load More Button (for future pagination) */}
        {sortedStories.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Stories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
