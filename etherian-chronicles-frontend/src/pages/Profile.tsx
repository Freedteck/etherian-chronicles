import React, { useContext, useState } from "react";
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
import { formatAddress, getTimeAgo } from "@/lib/utils";

const Profile = () => {
  const { stories } = useContext(StoryDataContext);
  const account = useActiveAccount();

  const currentUser = account?.address?.toLowerCase();

  const [activeTab, setActiveTab] = useState("overview");

  // Tabs definition
  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "stories", label: "My Stories", icon: "📚" },
    { id: "collaborations", label: "Collaborations", icon: "🤝" },
    { id: "nfts", label: "NFT Collection", icon: "🎨" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
  ];

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
                  <Badge className="bg-primary/90 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Legendary Storyteller
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-primary" />
                    <span>{11} reputation</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Master storyteller crafting epic tales since{" "}
                  {new Date(11).getFullYear() || "2025"}
                </p>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3 mr-2" />
                  Edit Profile
                </Button>
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
              <span>{tab.icon}</span> {tab.label}
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
                    <span className="text-sm font-medium">{222}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Reputation
                    </span>
                    <span className="text-sm font-medium">{111}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Member Since
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(11).getFullYear() || "2025"}
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
                <Button className="btn-mystical">
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
                                <span>{story.votesTotal} votes</span>
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

        {activeTab === "nfts" && (
          <div>
            <h3 className="text-xl font-bold mb-4">NFT Collection</h3>
            <p className="text-muted-foreground">
              NFTs display will go here...
            </p>
          </div>
        )}

        {activeTab === "achievements" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Achievements</h3>
            <p className="text-muted-foreground">
              Achievements display will go here...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
