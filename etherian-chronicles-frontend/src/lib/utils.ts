/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createThirdwebClient, getContract } from "thirdweb";
import { etherlinkTestnet } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import CONTRACT_ADDRESS_JSON from "../deployed_addresses.json";
import { EtherianChronicle__factory } from "@/typechain-types";
import { checksumAddress } from "thirdweb/utils";
import { format, fromUnixTime, formatDistanceToNow, isPast } from "date-fns";
import { createConfig } from "@0xsequence/connect";
import { SequenceWaaS } from "@0xsequence/waas";

const projectAccessKey = import.meta.env.VITE_PROJECT_ACCESS_KEY;
const waasConfigKey = import.meta.env.VITE_WAAS_CONFIG_KEY;
const enableConfirmationModal = true; // change to your preference
const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig("waas", {
  projectAccessKey,
  position: "center",
  defaultTheme: "dark",
  signIn: {
    projectName: "Etherian Chronicle",
  },
  defaultChainId: 128123,
  chainIds: [42793, 128123],
  appName: "Etherian Chronicle",
  waasConfigKey,
  email: true,
  google: { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID },
  apple: false,
  walletConnect: {
    projectId: walletConnectProjectId,
  },
  coinbase: false,
  metaMask: true,
  wagmiConfig: {
    multiInjectedProviderDiscovery: true,
  },
  enableConfirmationModal,
});

export async function createProposal(data) {
  const sequence = new SequenceWaaS({
    projectAccessKey: import.meta.env.VITE_PROJECT_ACCESS_KEY,
    waasConfigKey: import.meta.env.VITE_WAAS_CONFIG_KEY,
    network: "etherlinkTestnet",
  });

  try {
    const tx = await sequence.callContract({
      to: CONTRACT_ADDRESS_JSON["EtherianChronicle#EtherianChronicle"], // Contract address
      abi: EtherianChronicle__factory?.abi as any, // ABI
      func: "createStoryProposal", // Function name
      args: data,
      value: 0, // Value to send
    });
    return tx;
  } catch (e) {
    console.log(e);
  }
}

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
