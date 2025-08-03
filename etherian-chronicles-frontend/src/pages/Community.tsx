import { Users, Crown, Star, TrendingUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Layout/Header";
import PageBanner from "@/components/Layout/PageBanner";
import { useContext } from "react";
import { ProfileDataContext } from "@/contexts/profileDataContext";
import { Blobbie } from "thirdweb/react";
import { formatAddress } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import CardLoading from "@/components/ui/cardLoaing";

const Community = () => {
  const { leaderboard, isLoading } = useContext(ProfileDataContext);
  const navigate = useNavigate();
  const topCreators = leaderboard;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageBanner
        title="Community"
        subtitle="Meet the talented storytellers shaping the EtherianChronicle"
        badge={{ icon: Users, text: "Active Community" }}
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
        size="small"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Community Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="text-2xl font-display font-bold text-primary mb-2">
                2,847
              </div>
              <div className="text-sm text-muted-foreground">
                Active Storytellers
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="text-2xl font-display font-bold text-secondary mb-2">
                156
              </div>
              <div className="text-sm text-muted-foreground">
                Stories Created
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="text-2xl font-display font-bold text-accent mb-2">
                34.2K
              </div>
              <div className="text-sm text-muted-foreground">Votes Cast</div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="text-2xl font-display font-bold text-primary mb-2">
                892
              </div>
              <div className="text-sm text-muted-foreground">NFTs Earned</div>
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                Top Contributors
              </h2>
              <p className="text-muted-foreground">
                Recognized storytellers leading our community
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <CardLoading />
            ) : (
              topCreators.map((user, index) => (
                <div
                  key={user.user}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Blobbie
                        address={user.user}
                        className="w-9 h-9 rounded-full"
                      />
                      <div>
                        <h3 className="font-display font-semibold text-foreground">
                          {formatAddress(user.user)}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {user.points} reputation
                          </span>
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-primary/90 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Top Contributor
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-foreground">
                        {user.storiesParticipated}
                      </div>
                      <div className="text-muted-foreground">Participation</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {user.winningVotes}
                      </div>
                      <div className="text-muted-foreground">Winning Votes</div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {user.nfts}
                      </div>
                      <div className="text-muted-foreground">NFTs</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/profile/${user.user}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="bg-card/30 rounded-xl border border-border p-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Community Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Be Respectful
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Treat fellow storytellers with respect and kindness.
                Constructive feedback is encouraged.
              </p>

              <h3 className="font-semibold text-foreground mb-2">
                Original Content
              </h3>
              <p className="text-sm text-muted-foreground">
                Share original ideas and respect others' intellectual property.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Collaborative Spirit
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Embrace collaboration and be open to different storytelling
                perspectives.
              </p>

              <h3 className="font-semibold text-foreground mb-2">
                Quality Focus
              </h3>
              <p className="text-sm text-muted-foreground">
                Strive for quality in your contributions and help maintain high
                standards.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Community;
