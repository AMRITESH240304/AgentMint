import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Coins, Circle, XCircle } from 'lucide-react';
import type { AIAgent } from '../types/agent';
import BidScreen from './BidScreen'; // Import the new BidScreen component
import { fetchMappings, getAuctionDetails } from '../utils/mongodb';
import { getPinataUrl } from '../utils/pinata';
import { useRainbowKit } from '../hooks/useRainbowKit';

interface AuctionListingsProps {
  agents: AIAgent[];
}

export default function AuctionListings({ agents: propAgents }: AuctionListingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAgentForBid, setSelectedAgentForBid] = useState<AIAgent | null>(null);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAuctions, setActiveAuctions] = useState<Record<string, boolean>>({});
  const { address } = useRainbowKit();

  const categories = ['All', 'Assistant', 'Creative', 'Analytical', 'Gaming', 'Trading', 'Social'];

  useEffect(() => {
    async function loadAgentsFromMappings() {
      try {
        setIsLoading(true);
        const response = await fetchMappings();          
        // Explicitly type the response to match expected structure
        const result = response as unknown as { 
          mappings: Array<{ 
            wallet_address: string, 
            nft_id: string, 
            auction_started?: boolean,
            auction_start_time?: string
          }> 
        };
        
        if (result && result.mappings && Array.isArray(result.mappings)) {
          // Track which NFTs have active auctions
          const auctionsMap: Record<string, boolean> = {};
          result.mappings.forEach(mapping => {
            if (mapping.auction_started) {
              auctionsMap[mapping.nft_id] = true;
            }
          });
          setActiveAuctions(auctionsMap);
          
          const nftIds = result.mappings.map(mapping => mapping.nft_id);
          
          // Fetch agent data from Pinata for each NFT ID
          const agentPromises = nftIds.map(async (nftId) => {
            try {
              const pinataUrl = getPinataUrl(nftId);
              const response = await fetch(pinataUrl);
              if (!response.ok) {
                console.error(`Failed to fetch agent data for NFT ID: ${nftId}`);
                return null;
              }
              
              const agentData = await response.json();
              
              // Check if this agent has an active auction
              const hasActiveAuction = result.mappings.find(m => 
                m.nft_id === nftId && m.auction_started
              );
              
              // Get auction details if available
              let auctionDetails = null;
              if (hasActiveAuction) {
                try {
                  auctionDetails = await getAuctionDetails(nftId);
                } catch (err) {
                  console.error(`Error fetching auction details for NFT ID: ${nftId}`, err);
                }
              }
              
              // Convert the Pinata data format to our AIAgent format
              const agent: AIAgent = {
                id: nftId,
                name: agentData.title || 'Unnamed Agent',
                description: agentData.description || 'No description available',
                avatar: "https://gateway.pinata.cloud/ipfs/QmSamy4zqP91X42k6wS7kLJQVzuYJuW2EN94couPaq82A8",
                category: (agentData.category || 'Uncategorized') as AIAgent['category'],
                capabilities: agentData.capabilities || [],
                creator: agentData.creators?.[0]?.name || 'Unknown',
                blockchain: {
                  tokenId: nftId,
                  contractAddress: "0x1234...",
                  transactionHash: "0x5678...",
                  mintedAt: new Date().toISOString(),
                  ownerAddress: result.mappings.find(m => m.nft_id === nftId)?.wallet_address
                },
                metadata: {
                  model: agentData.metadata?.model || "unknown",
                  version: agentData.metadata?.version || "1.0",
                  training: agentData.metadata?.training || "standard",
                  parameters: agentData.metadata?.parameters || "0"
                },
                createdAt: new Date().toISOString(),
                performance: {
                  rating: 4.5,
                  tasks: 120,
                  uptime: 99
                },
                // Use highest bid from auction if available
                price: auctionDetails?.highest_bid || 0.1,
                isForSale: !!hasActiveAuction // Only agents with active auctions are for sale
              };
              return agent;
            } catch (err) {
              console.error(`Error fetching agent data for NFT ID: ${nftId}`, err);
              return null;
            }
          });
          
          const fetchedAgents = (await Promise.all(agentPromises))
            .filter((agent): agent is AIAgent => agent !== null) as AIAgent[];
          
          // Only display agents with active auctions
          const auctionAgents = fetchedAgents.filter(agent => 
            result.mappings.find(m => m.nft_id === agent.id && m.auction_started)
          );
          
          // Combine fetched agents with sample agents for demonstration
          setAgents([...auctionAgents, ...sampleAgents]);
        }
      } catch (err) {
        console.error("Error loading agent mappings:", err);
        setError("Failed to load agents from blockchain");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAgentsFromMappings();
  }, [propAgents]);

  // Updated sample data with real GIF URLs - keeping for demonstration
  const sampleAgents: AIAgent[] = [
    {
      id: '1',
      name: 'AI Agent 1',
      description: 'Sample AI agent for auction. This agent specializes in natural language processing and can assist with a wide range of text-based tasks.',
      category: 'Assistant',
      price: 2.2,
      isForSale: true,
      avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXprOHl5NHRrMmRlOW02cHlzeWJkYXhxYmF4bjRzbWNzODh0dWp1NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlQXlQ3nHyLMvte/giphy.gif',
      capabilities: ['text generation', 'search'],
      creator: 'User1',
      performance: { rating: 0.9, tasks: 150, uptime: 0.95 },
      metadata: { version: '1.1', model: 'GPT-4', training: 'Supervised', parameters: '1750000000' },
      blockchain: {
        tokenId: '1001',
        contractAddress: '0x1234...',
        transactionHash: '0x9876...',
        mintedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'AI Agent 2',
      description: 'Another sample AI agent specialized in creative design and image generation tasks.',
      category: 'Creative',
      price: 3.5,
      isForSale: true,
      avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjZqMTQzYm8zNHRtYnFieGN4amdtMnJ3dG80cXplOXc2c2p1YXJreiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKNV6C9D5PEEJVu/giphy.gif',
      capabilities: ['image generation', 'text to image'],
      creator: 'User2',
      performance: { rating: 0.85, tasks: 120, uptime: 0.9 },
      metadata: { version: '1.1', model: 'GPT-4', training: 'Supervised', parameters: '1750000000' },
      blockchain: {
        tokenId: '1002',
        contractAddress: '0x5678...',
        transactionHash: '0xabcd...',
        mintedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Trading Bot',
      description: 'Specialized AI agent for financial analysis and automated trading strategies.',
      category: 'Trading',
      price: 5.8,
      isForSale: true,
      avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTFrZTRqbWk1cDRoYWJuYmE3aWZzNTdweHQwenJwdXkzdzhlMmxiZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vRaak6fktTWBCS4/giphy.gif',
      capabilities: ['market analysis', 'algorithmic trading'],
      creator: 'TradeMaster',
      performance: { rating: 0.95, tasks: 500, uptime: 0.99 },
      metadata: { version: '2.0', model: 'Custom', training: 'Reinforcement Learning', parameters: '3500000000' },
      blockchain: {
        tokenId: '1003',
        contractAddress: '0xabcd...',
        transactionHash: '0xefgh...',
        mintedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    }
  ];

  const auctionAgents = agents
    .filter(agent => agent.isForSale)
    .filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agent => selectedCategory === 'All' || agent.category === selectedCategory);

  const handleOpenBidScreen = (agent: AIAgent) => {
    setSelectedAgentForBid(agent);
  };

  const handleCloseBidScreen = () => {
    setSelectedAgentForBid(null);
  };

  if (selectedAgentForBid) {
    return <BidScreen agent={selectedAgentForBid} onBack={handleCloseBidScreen} />;
  }

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">AI Agent Auctions</h2>
          <p className="text-xl text-gray-300">Discover and bid on available AI agent NFTs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search auctions..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Auction Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              <p className="text-gray-400">Loading auction listings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4 text-center max-w-md">
              <XCircle className="w-12 h-12 text-red-500" />
              <p className="text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : auctionAgents.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4 text-center max-w-md">
              <p className="text-gray-400">No agents found matching your criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionAgents.map((agent) => (
              <AuctionCard key={agent.id} agent={agent} onPlaceBidClick={() => handleOpenBidScreen(agent)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AuctionCard({ agent, onPlaceBidClick }: { agent: AIAgent; onPlaceBidClick: () => void }) {
  const [timeRemaining, setTimeRemaining] = useState<string>("Loading...");
  const [auctionData, setAuctionData] = useState<any>(null);

  // Fetch auction details and set up timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchAuctionInfo = async () => {
      try {
        const data = await getAuctionDetails(agent.id);
        setAuctionData(data);
        
        // Update time remaining
        if (data && data.time_left_seconds) {
          // Initial update
          updateTimeRemaining(data.time_left_seconds);
          
          // Set interval to update time every second
          interval = setInterval(() => {
            const newSecondsLeft = Math.max(0, data.time_left_seconds - 1);
            data.time_left_seconds = newSecondsLeft;
            updateTimeRemaining(newSecondsLeft);
            
            // Clear interval if auction ended
            if (newSecondsLeft <= 0) {
              clearInterval(interval);
            }
          }, 1000);
        } else {
          setTimeRemaining("Auction ended");
        }
      } catch (err) {
        console.error("Error fetching auction details:", err);
        setTimeRemaining("Error loading time");
      }
    };
    
    fetchAuctionInfo();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [agent.id]);
  
  // Format time remaining
  const updateTimeRemaining = (seconds: number) => {
    if (seconds <= 0) {
      setTimeRemaining("Auction ended");
      return;
    }
    
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h remaining`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    } else if (minutes > 0) {
      setTimeRemaining(`${minutes}m ${remainingSeconds}s remaining`);
    } else {
      setTimeRemaining(`${remainingSeconds}s remaining`);
    }
  };

  return (
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-sm font-medium text-white">
            {agent.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description}</p>

        {/* Auction Info */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-1 text-cyan-400">
            <Clock className="h-4 w-4" />
            <span>{timeRemaining}</span>
          </div>
          <div className="text-gray-300">
            <span>Current Bid: {agent.price.toFixed(4)} ETH</span>
          </div>
        </div>

        <button 
          onClick={onPlaceBidClick} 
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
        >
          Place Bid 🔨
        </button>
      </div>
    </div>
  );
}