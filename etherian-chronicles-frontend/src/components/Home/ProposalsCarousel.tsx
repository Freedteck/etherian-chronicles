import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProposalCard from "@/components/Proposal/ProposalCard";
import CardLoading from "../ui/cardLoaing";

const ProposalsCarousel = ({ proposals, isLoading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-card/30 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
              Ongoing Proposals
            </h2>
            <p className="text-muted-foreground">
              Vote on new story ideas from the community
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("left")}
              className="hidden sm:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("right")}
              className="hidden sm:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            <CardLoading />
          ) : (
            proposals.map((proposal) => (
              <div key={proposal.storyId} className="flex-none w-80 min-w-80">
                <ProposalCard proposal={proposal} />
              </div>
            ))
          )}
        </div>

        {/* Mobile scroll hint */}
        <div className="sm:hidden text-center mt-4">
          <p className="text-xs text-muted-foreground">
            Swipe left to see more proposals
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProposalsCarousel;
