import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Initialize the Story Protocol client
const privateKey = "fe8023a3058fd3d89c3d1185d4eb5bb0ec0de39831f20692d2655111d337f75e";
const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, '')}`);

const config: StoryConfig = {
    account, // Use the account derived from the private key
  transport: http("https://aeneid.storyrpc.io"), // Default Aeneid RPC URL
  chainId: "aeneid", // Use "aeneid" for testnet
};

export const client = StoryClient.newClient(config);

// NFT contract address to use for minting
export const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc";