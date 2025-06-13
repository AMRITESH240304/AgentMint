import { useState, useEffect } from 'react';
import { Search, Filter, Star, Activity, Clock, Coins, ShoppingCart, Tag } from 'lucide-react';
import { AIAgent } from '../types/agent';
import { fetchMappings } from '../utils/mongodb';
import { getPinataUrl } from '../utils/pinata';
import { useRainbowKit } from '../hooks/useRainbowKit';

interface AgentGalleryProps {
  agents: AIAgent[];
  setActiveSection: (section: string) => void;
}

export default function AgentGallery({ agents: propAgents, setActiveSection }: AgentGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'price'>('newest');
  const [agents, setAgents] = useState<AIAgent[]>(propAgents);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mappings, setMappings] = useState<Array<{ wallet_address: string, nft_id: string }>>([]);

  const categories = ['All', 'Assistant', 'Creative', 'Analytical', 'Gaming', 'Trading', 'Social'];

  useEffect(() => {
    async function loadAgentsFromMappings() {
      try {
        setIsLoading(true);
        const response = await fetchMappings();
        // Explicitly type the response to match expected structure
        const result = response as unknown as { 
          mappings: Array<{ wallet_address: string, nft_id: string }> 
        };
        
        if (result && result.mappings && Array.isArray(result.mappings)) {
          setMappings(result.mappings);
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
              
              // Convert the Pinata data format to our AIAgent format
              const agent = {
                id: nftId,
                name: agentData.title || 'Unnamed Agent',
                description: agentData.description || 'No description available',
                avatar: "https://gateway.pinata.cloud/ipfs/QmSamy4zqP91X42k6wS7kLJQVzuYJuW2EN94couPaq82A8",
                category: agentData.category || 'Uncategorized',
                capabilities: agentData.capabilities || [],
                creator: agentData.creators?.[0]?.name || 'Unknown',
                blockchain: {
                  tokenId: nftId,
                  contractAddress: "0x1234...",
                  transactionHash: "0x5678...",
                  mintedAt: new Date().toISOString()
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
                price: 0.1,
                isForSale: true
              };
              return agent;
            } catch (err) {
              console.error(`Error fetching agent data for NFT ID: ${nftId}`, err);
              return null;
            }
          });
          
          const fetchedAgents = (await Promise.all(agentPromises))
            .filter((agent): agent is AIAgent => agent !== null) as AIAgent[];
          setAgents([...propAgents, ...fetchedAgents]);
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

  const filteredAgents = agents
    .filter(agent => 
      (agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       agent.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       '')
    )
    .filter(agent => selectedCategory === 'All' || agent.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.performance?.rating || 0) - (a.performance?.rating || 0);
        case 'price':
          return (b.price || 0) - (a.price || 0);
        default:
          return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
      }
    });

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">AI Agent Gallery</h2>
          <p className="text-xl text-gray-300">Discover and explore registered AI agent NFTs</p>
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
                placeholder="Search agents..."
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

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'price')}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            >
              <option value="newest" className="bg-gray-800">Newest First</option>
              <option value="rating" className="bg-gray-800">Highest Rated</option>
              <option value="price" className="bg-gray-800">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading agents from blockchain...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Error</h3>
              <p className="text-red-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Agent Grid */}
        {!isLoading && !error && filteredAgents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">No Agents Found</h3>
              <p className="text-gray-300 mb-6">
                {agents.length === 0 
                  ? "Be the first to register an AI agent!"
                  : "No agents match your search criteria."}
              </p>
              <button
                onClick={() => setActiveSection('register')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
              >
                Register Agent
              </button>
            </div>
          </div>
        ) : (
          !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} mappings={mappings} />
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}

function AgentCard({ agent, mappings }: { agent: AIAgent, mappings: Array<{ wallet_address: string, nft_id: string }> }) {
  const { address, isConnected, openConnectModal } = useRainbowKit();
  
  // Find if the current agent has a mapping
  const agentMapping = mappings.find(mapping => mapping.nft_id === agent.id);
  // Check if the current user is the owner
  const isOwner = isConnected && address && agentMapping?.wallet_address.toLowerCase() === address.toLowerCase();
  
  // Handle buy/sell action
  const handleTransactionClick = () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    }
    
    if (isOwner) {
      // Implement sell logic here
      console.log("Selling agent:", agent.id);
      alert("Sell functionality will be implemented soon!");
    } else {
      // Implement buy logic here
      console.log("Buying agent:", agent.id);
      alert("Buy functionality will be implemented soon!");
    }
  };

  return (
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img
          src={agent.avatar || 'https://via.placeholder.com/400x200?text=AI+Agent'}
          alt={agent.name || 'AI Agent'}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-sm font-medium text-white">
            {agent.category || 'Uncategorized'}
          </span>
        </div>
        {agent.isForSale && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm rounded-full text-sm font-medium text-white flex items-center space-x-1">
              <Coins className="h-3 w-3" />
              <span>{agent.price || 0} ETH</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{agent.name || 'Unnamed Agent'}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description || 'No description available'}</p>

        {/* Performance Metrics */}
        <div className="flex items-center space-x-4 mb-4 text-sm">
          {agent.performance?.rating !== undefined && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span>{(agent.performance.rating || 0).toFixed(1)}</span>
            </div>
          )}
          
          {agent.performance?.tasks !== undefined && (
            <div className="flex items-center space-x-1 text-cyan-400">
              <Activity className="h-4 w-4" />
              <span>{agent.performance.tasks || 0}</span>
            </div>
          )}
          
          {agent.performance?.uptime !== undefined && (
            <div className="flex items-center space-x-1 text-green-400">
              <Clock className="h-4 w-4" />
              <span>{agent.performance.uptime || 0}%</span>
            </div>
          )}
        </div>

        {/* Capabilities */}
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {agent.capabilities.slice(0, 2).map((capability) => (
              <span
                key={capability}
                className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300"
              >
                {capability}
              </span>
            ))}
            {agent.capabilities.length > 2 && (
              <span className="px-2 py-1 bg-gray-500/20 border border-gray-500/30 rounded text-xs text-gray-300">
                +{agent.capabilities.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Buy/Sell Button */}
        <button
          onClick={handleTransactionClick}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 mb-4 flex items-center justify-center ${
            isOwner 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400" 
              : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
          }`}
        >
          {isOwner ? (
            <>
              <Tag className="h-4 w-4 mr-2" />
              Sell Agent
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Agent
            </>
          )}
        </button>

        {/* Blockchain Info */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Token ID: {agent.blockchain?.tokenId || 'N/A'}</span>
            <span>By {agent.creator || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}