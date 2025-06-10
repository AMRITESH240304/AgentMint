import { Address } from "viem";
import { client, SPG_NFT_CONTRACT } from "./storyProtocol";
import { createMetadataHash, mockUploadToIPFS, getIPFSUrl } from "./ipfs";
import type { AIAgent, RegistrationForm } from "../types/agent";

/**
 * Registers an AI agent as an IP asset on the Story Protocol blockchain
 */
export const registerAgentAsIpAsset = async (form: RegistrationForm): Promise<{
  agent: AIAgent;
  ipId: string;
  txHash: string;
}> => {
  try {
    // Create IP metadata from the form data
    const ipMetadata = {
      title: form.name,
      description: form.description,
      image: form.avatar || "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      mediaUrl: form.avatar || "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
      mediaType: "image/jpeg",
      creators: [
        {
          name: "AI Agent Creator",
          address: "0x67ee74EE04A0E6d14Ca6C27428B27F3EFd5CD084", // Replace with the actual user's address
          description: "Creator of AI Agents",
          contributionPercent: 100,
          socialMedia: [],
        },
      ],
      capabilities: form.capabilities,
      category: form.category,
      metadata: {
        model: form.model,
        version: form.version,
        training: form.training,
        parameters: form.parameters,
      }
    };

    // Create NFT metadata (simpler version of the IP metadata)
    const nftMetadata = {
      name: form.name,
      description: form.description,
      image: form.avatar || "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
    };

    // Upload metadata to IPFS (mock implementation for now)
    const ipIpfsHash = await mockUploadToIPFS(ipMetadata);
    const ipHash = createMetadataHash(ipMetadata);
    const nftIpfsHash = await mockUploadToIPFS(nftMetadata);
    const nftHash = createMetadataHash(nftMetadata);

    // Register IP on Story Protocol using mintAndRegisterIpAssetWithPilTerms
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc",
      ipMetadata: {
        ipMetadataURI: getIPFSUrl(ipIpfsHash),
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: getIPFSUrl(nftIpfsHash),
        nftMetadataHash: `0x${nftHash}`,
      },
    });

    // Create agent with blockchain data
    const newAgent: AIAgent = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      avatar: form.avatar || `https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400`,
      creator: 'You',
      performance: {
        rating: 0,
        tasks: 0,
        uptime: 100,
      },
      metadata: {
        model: form.model,
        version: form.version,
        training: form.training,
        parameters: form.parameters,
      },
      blockchain: {
        tokenId: response.tokenId ? response.tokenId.toString() : `AGENT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        contractAddress: SPG_NFT_CONTRACT,
        transactionHash: response.txHash || '0x' + Math.random().toString(16).substr(2, 64),
        mintedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    return {
      agent: newAgent,
      ipId: response.ipId || '',
      txHash: response.txHash || '0x' + Math.random().toString(16).substr(2, 64),
    };
  } catch (error) {
    console.error("Error registering agent as IP asset:", error);
    throw error;
  }
};
