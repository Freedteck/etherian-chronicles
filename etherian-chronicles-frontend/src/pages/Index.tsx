import { Link } from "react-router-dom";
import {
  Crown,
  Users,
  Scroll,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/Story/StoryCard";
import Header from "@/components/Layout/Header";
import StorySlideshow from "@/components/Home/StorySlideshow";
import ProposalsCarousel from "@/components/Home/ProposalsCarousel";
import { useContext } from "react";
import { StoryDataContext } from "@/contexts/storyDataContext";

const Index = () => {
  const { isLoading, stories, proposals } = useContext(StoryDataContext);
  const filteredProposals = proposals.filter(
    (proposal) => proposal?.title !== "csdc"
  );

  const featuredStories = stories
    .map((story) => {
      const totalVotes = story?.proposalYesVotes + story?.proposalNoVotes || 0;
      return {
        ...story,
        totalVotes,
        isTrending: totalVotes > 0 && story?.chapters.length > 0,
      };
    })
    .filter((story) => {
      return story?.isTrending;
    })
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Story Slideshow */}
      <StorySlideshow stories={featuredStories} />

      {/* Proposals Carousel */}
      {filteredProposals.length > 0 && (
        <ProposalsCarousel
          proposals={filteredProposals}
          isLoading={isLoading}
        />
      )}

      {/* Featured Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                Featured Stories
              </h2>
              <p className="text-muted-foreground">
                Join these epic adventures and shape their destiny
              </p>
            </div>
            <Link to="/stories">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredStories.map((story) => (
              <StoryCard key={story?.storyId} story={story} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link to="/stories">
              <Button variant="outline">
                View All Stories
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From proposal to completion, every story is shaped by community
              choices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scroll className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                Propose & Vote
              </h3>
              <p className="text-sm text-muted-foreground">
                Submit story ideas and vote on community proposals to bring the
                best tales to life
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                Collaborate & Shape
              </h3>
              <p className="text-sm text-muted-foreground">
                Join as collaborators and vote on story choices that determine
                each chapter's direction
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                Earn & Collect
              </h3>
              <p className="text-sm text-muted-foreground">
                Gain NFT rewards and build your reputation as stories reach
                completion milestones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of storytellers creating the next generation of
            interactive fiction
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/proposals">
              <Button size="lg" className="btn-mystical">
                <TrendingUp className="h-5 w-5 mr-2" />
                Vote on Proposals
              </Button>
            </Link>
            <Link to="/create">
              <Button size="lg" className="btn-golden">
                <Crown className="h-5 w-5 mr-2" />
                Create Your Story
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
