import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Crown,
  Star,
  BookOpen,
  Vote,
  Award,
  Settings,
  Users,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Layout/Header";
import PageBanner from "@/components/Layout/PageBanner";
import { StoryDataContext } from "@/contexts/storyDataContext";
import { Blobbie, useActiveAccount } from "thirdweb/react";
import {
  formatAddress,
  getRarityConfig,
  getTimeAgo,
  getUserLevelConfig,
} from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProfileDataContext } from "@/contexts/profileDataContext";
import NFTCard from "@/components/NFT/NftCard";
import ProposalLoading from "@/components/ui/proposalLoading";

const Profile = () => {
  const { stories, isLoading: storiesLoading } = useContext(StoryDataContext);
  const { userId } = useParams();
  const {
    claimableBonuses,
    ownedNFTs,
    isLoading,
    claimableNFTs,
    mintLoreFragment,
    mintCompletionFragment,
    userProfile,
    getUserProfile,
  } = useContext(ProfileDataContext);
  const account = useActiveAccount();

  const currentUser = userId.toLocaleLowerCase();
  const isOwner = currentUser === account?.address.toLocaleLowerCase();
  const nftCollections = [...ownedNFTs, ...claimableNFTs, ...claimableBonuses];
  const achievements = [...ownedNFTs];
  const claimables = [...claimableNFTs, ...claimableBonuses];

  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      getUserProfile({ address: userId });
    }
  }, [userId, getUserProfile]);

  // Tabs definition
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "stories", label: "My Stories", icon: BookOpen },
    { id: "collaborations", label: "Collaborations", icon: Users },
    { id: "collection", label: "NFT Collection", icon: Award },
  ];

  if (isOwner) {
    tabs.push({ id: "claimables", label: "Claimables", icon: Star });
  }

  // User data
  const userStories = stories?.filter(
    (story) => story?.writer?.toLowerCase() === currentUser
  );

  const totalVotes = userStories?.reduce((acc, story) => {
    const chapters = story?.chapters || [];
    return chapters.reduce((acc, chapter) => {
      return acc + (chapter?.voteCountSum || 0);
    }, acc);
  }, 0);

  const userCollaborations = stories?.filter((story) =>
    story.collaborators.some((collab) => collab?.toLowerCase() === currentUser)
  );

  if (storiesLoading || isLoading) {
    return <ProposalLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <PageBanner
        title={formatAddress(currentUser)}
        subtitle="Your storytelling journey and achievements"
        badge={{ icon: User, text: "Profile" }}
        backgroundImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
        size="small"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-start space-x-4">
              <Blobbie
                className="w-20 h-20 rounded-full"
                address={currentUser}
              />
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-foreground mb-2">
                  {formatAddress(currentUser)}
                </h2>
                <div className="flex items-center space-x-2 mb-3">
                  {(() => {
                    const levelConfig = getUserLevelConfig(
                      userStories?.length || 0
                    );
                    return (
                      <Badge className={levelConfig.color}>
                        {React.createElement(levelConfig.icon, {
                          className: "h-3 w-3 mr-1",
                        })}
                        {levelConfig?.name}
                      </Badge>
                    );
                  })()}
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-primary" />
                    <span>{userProfile?.totalPoints || 0} reputation</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Master storyteller crafting epic tales since{" "}
                  {new Date(
                    userProfile?.registeredAt.toString() * 1000
                  ).getFullYear() || "2025"}
                </p>
                <div className="flex flex-row gap-4">
                  {isOwner && (
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  <Link to="/create">
                    <Button size="sm" variant="secondary">
                      <Crown className="h-4 w-4 mr-2" />
                      Create Your Story
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {userStories?.length}
            </div>
            <div className="text-sm text-muted-foreground">Stories Created</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Vote className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {totalVotes}
            </div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 border-b border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>
                {React.createElement(tab.icon, { className: "h-4 w-4" })}
              </span>{" "}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Overview (sidebar + activity feed) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-xl border border-border p-6">
                <h4 className="font-display font-semibold mb-4">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">Today</div>
                    <div className="text-foreground">
                      Voted on "The Clockwork Rebellion"
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">2 days ago</div>
                    <div className="text-foreground">
                      Published new chapter in "Shattered Crown"
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">1 week ago</div>
                    <div className="text-foreground">
                      Joined collaboration on "Alexandria Library"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h4 className="font-display font-semibold mb-4">Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      NFTs Owned
                    </span>
                    <span className="text-sm font-medium">
                      {ownedNFTs.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Reputation
                    </span>
                    <span className="text-sm font-medium">
                      {userProfile?.totalPoints || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Member Since
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(
                        userProfile?.registeredAt * 1000
                      ).getFullYear() || "2024"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Winning Votes
                    </span>
                    <span className="text-sm font-medium">
                      {userProfile?.winningVotes || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Referrals
                    </span>
                    <span className="text-sm font-medium">
                      {userProfile?.referralCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stories" && (
          <div className="space-y-8">
            <h3 className="text-xl font-display font-bold text-foreground flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              My Stories
            </h3>

            {userStories?.length > 0 ? (
              <div className="space-y-4">
                {userStories.map((story) => (
                  <div
                    key={story.storyId}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={story?.ipfsHashImage}
                        alt={story?.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground mb-1 truncate">
                              {story?.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {story?.summary}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{story?.votesTotal} votes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{getTimeAgo(story?.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              story?.status === 1 ? "default" : "secondary"
                            }
                            className="ml-2"
                          >
                            {story?.status === 1 ? "Active" : "Complete"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">
                  No stories yet
                </h4>
                <p className="text-muted-foreground mb-4">
                  Start your storytelling journey by creating your first tale
                </p>
                <Button
                  className="btn-mystical"
                  onClick={() => navigate("/create")}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Create Your First Story
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "collaborations" && (
          <div className="space-y-8">
            <h3 className="text-xl font-display font-bold text-foreground mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-secondary" />
              Collaborations
            </h3>

            {userCollaborations?.length > 0 ? (
              <div className="space-y-4">
                {userCollaborations.map((story) => (
                  <div
                    key={story.storyId}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={story?.ipfsHashImage}
                        alt={story?.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground mb-1 truncate">
                              {story?.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Created by {story?.writer}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>
                                  {story?.collaborators?.length} collaborators
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Vote className="h-3 w-3" />
                                <span>{story?.votesTotal} votes</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">Collaborating</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">
                  No collaborations yet
                </h4>
                <p className="text-muted-foreground">
                  Join other storytellers to create amazing collaborative tales
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "collection" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-foreground flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                NFT Collection
              </h3>
              <div className="text-sm text-muted-foreground">
                {ownedNFTs.length} items collected
              </div>
            </div>

            {ownedNFTs?.length > 0 ? (
              <div className="space-y-6">
                {/* Rarity breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((rarity) => {
                    const config = getRarityConfig(rarity);
                    const count = ownedNFTs.filter(
                      (nft) => (nft.rarity || 0) === rarity
                    ).length;
                    return (
                      <div
                        key={rarity}
                        className="bg-card rounded-lg border border-border p-4 text-center"
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${config.color} mx-auto mb-2`}
                        />
                        <div className="text-lg font-bold text-foreground">
                          {count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {config.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* NFT Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ownedNFTs.map((nft, index) => (
                    <NFTCard
                      key={nft.tokenId || index}
                      nft={nft}
                      isClaimable={false}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">
                  No NFTs collected yet
                </h4>
                <p className="text-muted-foreground mb-4">
                  Vote on story chapters and claim your winning NFTs to start
                  your collection
                </p>
                <Button variant="outline" onClick={() => navigate("/stories")}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Stories
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "claimables" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-foreground flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Claimable Rewards
              </h3>
              <div className="text-sm text-muted-foreground">
                {claimables.length} rewards available
              </div>
            </div>

            {claimables?.length > 0 ? (
              <div className="space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {claimableNFTs.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          NFTs to claim
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          {claimableBonuses.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Completion bonuses
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claimable Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {claimableNFTs.map((nft, index) => (
                    <NFTCard
                      key={`nft-${index}`}
                      nft={nft}
                      isClaimable={true}
                      onClaim={() =>
                        mintLoreFragment(nft?.storyId, nft.chapterIndex)
                      }
                    />
                  ))}
                  {claimableBonuses.map((bonus, index) => (
                    <NFTCard
                      key={`bonus-${index}`}
                      nft={bonus}
                      isClaimable={true}
                      onClaim={() => mintCompletionFragment(bonus?.storyId)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">
                  No rewards to claim
                </h4>
                <p className="text-muted-foreground mb-4">
                  Vote on active stories to earn claimable NFTs and bonuses
                </p>
                <Button variant="outline" onClick={() => navigate("/stories")}>
                  <Vote className="h-4 w-4 mr-2" />
                  Start Voting
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
