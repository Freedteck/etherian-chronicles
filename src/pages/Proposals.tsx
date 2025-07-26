import { useEffect, useState } from "react";
import { Vote, Filter, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Layout/Header";
import PageBanner from "@/components/Layout/PageBanner";
import ProposalCard from "@/components/Proposal/ProposalCard";
import { mockProposals } from "@/data/mockData";
import { getActiveProposals } from "@/data/proposalData";
import CardLoading from "@/components/ui/cardLoaing";

const Proposals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeProposals, setActiveProposals] = useState([]);
  const [isProposalLoading, setIsProposalLoading] = useState(false);

  useEffect(() => {
    const fetchProposals = async () => {
      setIsProposalLoading(true);
      const { activeProposals, isProposalLoading: isLoading } =
        await getActiveProposals();
      setActiveProposals(activeProposals);
      setIsProposalLoading(isLoading);
    };

    fetchProposals();
  }, []);

  const filteredProposals = activeProposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || proposal.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageBanner
        title="Story Proposals"
        subtitle="Vote on community-submitted story ideas and help decide which tales come to life"
        badge={{ icon: Vote, text: "Community Voting" }}
        backgroundImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
        size="medium"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === "voting" ? "default" : "outline"}
              onClick={() => setFilter("voting")}
              size="sm"
            >
              Voting Open
            </Button>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isProposalLoading ? (
            <CardLoading />
          ) : (
            filteredProposals.map((proposal) => (
              <ProposalCard key={proposal.storyId} proposal={proposal} />
            ))
          )}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No proposals found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proposals;
