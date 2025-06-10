// Helper function to create a hash for metadata using browser-compatible approach
export const createMetadataHash = (metadata: any): string => {
  // Simple hashing function for browser environment
  // This is not cryptographically secure but works for demo purposes
  const str = JSON.stringify(metadata);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex string and ensure it's positive
  return Math.abs(hash).toString(16).padStart(64, '0');
};

// Mock function for IPFS upload since we don't have Pinata integration yet
export const mockUploadToIPFS = async (metadata: any): Promise<string> => {
  // In a real implementation, this would upload to IPFS via Pinata or similar
  // For now, we'll just return a mock IPFS hash
  return `mock-ipfs-hash-${Math.random().toString(36).substring(2, 15)}`;
};

// Get IPFS gateway URL
export const getIPFSUrl = (ipfsHash: string): string => {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
};
