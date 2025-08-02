/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRarityConfig } from "@/lib/utils";
import { Clock, Star } from "lucide-react";
import { Button } from "../ui/button";

const NFTCard = ({
  nft,
  isClaimable = false,
  onClaim = (...params: any): Promise<any> => Promise.resolve(),
}) => {
  const rarityConfig = getRarityConfig(nft.rarity || 0);

  return (
    <div
      className={`bg-card rounded-xl border-2 ${rarityConfig.border} p-4 hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
    >
      {/* Rarity gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} opacity-5 pointer-events-none`}
      />

      {/* NFT Image */}
      <div className="relative mb-4">
        <img
          src={nft?.image || nft?.storyImage || "/api/placeholder/200/150"}
          alt={nft?.name || nft?.storyTitle}
          className="w-full h-32 object-cover rounded-lg"
        />

        {/* Rarity badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${rarityConfig.color}`}
        >
          {rarityConfig.name}
        </div>

        {/* Early vote indicator */}
        {nft.isEarlyVote && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white bg-green-500">
            <Clock className="h-3 w-3 inline mr-1" />
            Early
          </div>
        )}
      </div>

      {/* NFT Details */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground truncate">
          {nft?.storyTitle || nft?.name || "Unknown Story"}
        </h4>

        <p className="text-xs text-muted-foreground">
          {isClaimable
            ? `Chapter ${nft.chapterIndex + 1} • ${
                nft.estimatedPoints || nft.bonusPoints || 0
              } points`
            : `Chapter ${(nft.chapterId || nft.chapterIndex) + 1} • ${
                nft.userPointsAtMint || 0
              } points at mint`}
        </p>

        {/* Points display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium">
              {nft.estimatedPoints ||
                nft.bonusPoints ||
                nft.userPointsAtMint ||
                0}{" "}
              pts
            </span>
          </div>

          {nft.mintTimestamp && (
            <span className="text-xs text-muted-foreground">
              {new Date(nft.mintTimestamp * 1000).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Claim button for claimables */}
        {isClaimable && onClaim && (
          <Button
            size="sm"
            className="w-full mt-3"
            onClick={() => onClaim(nft)}
          >
            {nft.type === "completion" ? "Claim Bonus" : "Claim NFT"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
