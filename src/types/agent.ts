export interface AIAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  category: 'Assistant' | 'Creative' | 'Analytical' | 'Gaming' | 'Trading' | 'Social';
  avatar: string;
  creator: string;
  price: number;
  performance: {
    rating: number;
    tasks: number;
    uptime: number;
  };
  metadata: {
    model: string;
    version: string;
    training: string;
    parameters: string;
  };
  blockchain: {
    tokenId: string;
    contractAddress: string;
    transactionHash: string;
    mintedAt: string;
  };
  isForSale: boolean;
  createdAt: string;
}

export interface RegistrationForm {
  name: string;
  description: string;
  capabilities: string[];
  category: AIAgent['category'];
  avatar: string;
  model: string;
  version: string;
  training: string;
  parameters: string;
  price: number;
  isForSale: boolean;
}