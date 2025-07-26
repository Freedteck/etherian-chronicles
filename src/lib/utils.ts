import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d82711f (Update contract call)
import { createThirdwebClient, getContract } from "thirdweb";
import { etherlinkTestnet } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import CONTRACT_ADDRESS_JSON from "../deployed_addresses.json";
import { EtherianChronicle__factory } from "@/typechain-types";
import { checksumAddress } from "thirdweb/utils";
<<<<<<< HEAD
=======
import { createThirdwebClient } from "thirdweb";
>>>>>>> 6732061 (Add thirdweb and relevant libraries)
=======
>>>>>>> d82711f (Update contract call)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> d82711f (Update contract call)

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

export const formatAddress = (address: string) => {
  const formattedAddress = checksumAddress(address);
  return `${formattedAddress.slice(0, 6)}...${formattedAddress.slice(-4)}`;
};
<<<<<<< HEAD
=======
>>>>>>> 6732061 (Add thirdweb and relevant libraries)
=======
>>>>>>> d82711f (Update contract call)
