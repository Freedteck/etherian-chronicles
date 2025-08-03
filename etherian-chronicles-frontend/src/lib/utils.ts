import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createThirdwebClient, getContract } from "thirdweb";
import { etherlinkTestnet } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import CONTRACT_ADDRESS_JSON from "../deployed_addresses.json";
import { EtherianChronicle__factory } from "@/typechain-types";
import { checksumAddress } from "thirdweb/utils";
import { format, fromUnixTime, formatDistanceToNow, isPast } from "date-fns";
import { Award, BookOpen, Crown, Star, User } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
    executionMode: {
      mode: "EIP7702",
      sponsorGas: true,
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export const contract = getContract({
  abi: EtherianChronicle__factory.abi,
  client,
  address: CONTRACT_ADDRESS_JSON["EtherianChronicle#EtherianChronicle"],
  chain: etherlinkTestnet, // or your chain
});

export const getIpfsDetails = async (ipfsUrl: string) => {
  const response = await fetch(ipfsUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch IPFS data: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const formatAddress = (address?: string) => {
  if (!address) return "";
  const formattedAddress = checksumAddress(address);
  return `${formattedAddress.slice(0, 6)}...${formattedAddress.slice(-4)}`;
};

// Format blockchain timestamps
export const formatBlockchainDate = (timestamp) => {
  return format(fromUnixTime(timestamp), "MMM dd, yyyy 'at' h:mm a");
};

// Get time ago
export const getTimeAgo = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  // Handle future timestamps
  if (diff < 0) return "in the future";

  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
};

// Check if voting is still active
export const isVotingActive = (endTimestamp) => {
  return !isPast(fromUnixTime(endTimestamp));
};

// Get time remaining for voting
export const getTimeRemaining = (endTimestamp) => {
  const endDate = fromUnixTime(endTimestamp);

  if (isPast(endDate)) {
    return "Voting ended";
  }

  return `${formatDistanceToNow(endDate)} remaining`;
};

// Format for different contexts
export const formatForList = (timestamp) => {
  return format(fromUnixTime(timestamp), "MMM dd, yyyy");
};

export const formatForDetails = (timestamp) => {
  return format(fromUnixTime(timestamp), "PPPP");
};

export const getRarityConfig = (rarity) => {
  const rarityConfigs = {
    0: {
      name: "Common",
      color: "bg-gray-500",
      border: "border-gray-500",
      gradient: "from-gray-400 to-gray-600",
    },
    1: {
      name: "Rare",
      color: "bg-blue-500",
      border: "border-blue-500",
      gradient: "from-blue-400 to-blue-600",
    },
    2: {
      name: "Epic",
      color: "bg-purple-500",
      border: "border-purple-500",
      gradient: "from-purple-400 to-purple-600",
    },
    3: {
      name: "Legendary",
      color: "bg-yellow-500",
      border: "border-yellow-500",
      gradient: "from-yellow-400 to-yellow-600",
    },
  };
  return rarityConfigs[rarity] || rarityConfigs[0];
};

export const getUserLevelConfig = (storiesCount: number) => {
  if (storiesCount === 0) {
    return {
      level: 0,
      name: "New User",
      icon: User,
      color: "bg-gray-500/90 text-white",
      bgColor: "bg-gray-500/10",
      textColor: "text-gray-600",
    };
  } else if (storiesCount <= 2) {
    return {
      level: 1,
      name: "Rising Writer",
      icon: Star,
      color: "bg-blue-500/90 text-white",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600",
    };
  } else if (storiesCount <= 5) {
    return {
      level: 2,
      name: "Story Crafter",
      icon: BookOpen,
      color: "bg-green-500/90 text-white",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600",
    };
  } else if (storiesCount <= 10) {
    return {
      level: 3,
      name: "Master Storyteller",
      icon: Award,
      color: "bg-purple-500/90 text-white",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600",
    };
  } else {
    return {
      level: 4,
      name: "Legendary Creator",
      icon: Crown,
      color: "bg-amber-500/90 text-white",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600",
    };
  }
};
