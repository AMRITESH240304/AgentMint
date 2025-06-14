import { useState, useEffect } from 'react';
import { Search, Filter, Star, Activity, Clock, Coins, ShoppingCart, Tag, Gavel } from 'lucide-react';
import { AIAgent } from '../types/agent';
import { fetchMappings, startAuction } from '../utils/mongodb';
import { getPinataUrl } from '../utils/pinata';
import { useRainbowKit } from '../hooks/useRainbowKit';
import { StarIcon, XMarkIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface AgentGalleryProps {
  agents: AIAgent[];
  setActiveSection: (section: string) => void;
}

// Updated interface for mappings to include auction status
interface AgentMapping {
  wallet_address: string;
  nft_id: string;
  auction_started?: boolean;
  auction_start_time?: string;
}

export default function AgentGallery({ agents: propAgents, setActiveSection }: AgentGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'price'>('newest');
  const [agents, setAgents] = useState<AIAgent[]>(propAgents);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mappings, setMappings] = useState<AgentMapping[]>([]);

  const categories = ['All', 'Assistant', 'Creative', 'Analytical', 'Gaming', 'Trading', 'Social'];

  useEffect(() => {
    async function loadAgentsFromMappings() {
      try {
        setIsLoading(true);
        const response = await fetchMappings();
        // Explicitly type the response to match expected structure
        const result = response as unknown as { 
          mappings: AgentMapping[]
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

function AgentCard({ agent, mappings }: { agent: AIAgent, mappings: AgentMapping[] }) {
  const { address, isConnected, openConnectModal } = useRainbowKit();
  const [showDetails, setShowDetails] = useState(false);
  const [isStartingAuction, setIsStartingAuction] = useState(false);
  
  // Find if the current agent has a mapping
  const agentMapping = mappings.find(mapping => mapping.nft_id === agent.id);
  // Check if the current user is the owner
  const isOwner = !!(isConnected && address && agentMapping?.wallet_address.toLowerCase() === address.toLowerCase());
  // Check if there's an active auction for this agent
  const isInAuction = agentMapping?.auction_started || false;
  
  // Handle buy/sell action
  const handleTransactionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (!isConnected && openConnectModal) {
      openConnectModal();
      return;
    }
    
    console.log("Transaction clicked for agent:", agent.id);
    console.log("Agent mapping:", agentMapping);
    console.log("Is owner:", isOwner);
    console.log("Is in auction:", isInAuction);
    console.log("User address:", address);
    
    if (isOwner) {
      if (isInAuction) {
        alert("This agent is already in an auction. You cannot sell it directly.");
      } else {
        // Show auction start confirmation
        const startAuction = window.confirm("Do you want to start an auction for this agent?");
        if (startAuction) {
          handleStartAuction();
        }
      }
    } else {
      // Implement buy logic here
      console.log("Buying agent:", agent.id);
      alert("Buy functionality will be implemented soon!");
    }
  };
  
  // Function to start an auction
  const handleStartAuction = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      setIsStartingAuction(true);
      await startAuction(agent.id, address);
      alert("Auction started successfully!");
      
      // Refresh the data to update the UI
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to start auction:", error);
      alert(error.message || "Failed to start auction. Please try again.");
    } finally {
      setIsStartingAuction(false);
    }
  };

  return (
    <>
      <div 
        className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
        onClick={() => setShowDetails(true)}
      >
        {/* Auction Badge */}
        {isInAuction && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
            In Auction
          </div>
        )}

        <div className="relative">
          <img
            src={agent.avatar || 'https://via.placeholder.com/400x200?text=AI+Agent'}
            alt={agent.name || 'AI Agent'}
            className="w-full h-48 object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{agent.name || 'Unnamed Agent'}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
                <span>{agent.category || 'General'}</span>
              </div>
              {agent.performance && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.round(agent.performance?.rating || 0) 
                          ? 'text-yellow-400' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-green-400 font-bold">
                {agent.price ? `${agent.price} ETH` : 'Free'}
              </div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {agent.description || 'No description available'}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              
            </div>
            
            <button 
              onClick={handleTransactionClick}
              disabled={isStartingAuction || (isOwner && isInAuction)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isInAuction 
                  ? isOwner 
                    ? 'bg-purple-800 text-purple-200 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  : isOwner 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isStartingAuction ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </div>
              ) : isInAuction ? (
                isOwner ? "In Auction" : "Join Auction"
              ) : (
                isOwner ? "Start Auction" : "Buy Agent"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {showDetails && (
        <AgentDetailsModal 
          agent={agent} 
          isOwner={isOwner}
          isInAuction={isInAuction}
          onClose={() => setShowDetails(false)} 
          onBuySell={handleTransactionClick}
        />
      )}
    </>
  );
}

interface AgentDetailsModalProps {
  agent: AIAgent;
  isOwner: boolean;
  isInAuction: boolean;
  onClose: () => void;
  onBuySell: (e: React.MouseEvent) => void;
}

function AgentDetailsModal({ agent, isOwner, isInAuction, onClose, onBuySell }: AgentDetailsModalProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'agent', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'try' | 'metadata'>('about');
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Simulate agent response (in a real app, this would call an API)
    setTimeout(() => {
      const responses = [
        "I'm here to help! What would you like to know?",
        "That's an interesting question. Let me think about it.",
        "I'm designed to assist with tasks like this. Here's what I can tell you...",
        "Based on my knowledge, I would approach this problem by...",
        "I can certainly help with that. Let me provide some insights."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setConversation(prev => [...prev, { role: 'agent', content: randomResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  // Get transaction button text based on auction and ownership status
  const getActionButtonText = () => {
    if (isInAuction) {
      return isOwner ? "In Auction" : "Join Auction";
    } else {
      return isOwner ? "Start Auction" : "Buy Agent";
    }
  };

  // Get button style based on auction and ownership status
  const getActionButtonStyle = () => {
    if (isInAuction) {
      return isOwner 
        ? "bg-purple-800 text-purple-200 cursor-not-allowed" 
        : "bg-purple-600 hover:bg-purple-700 text-white";
    } else {
      return isOwner 
        ? "bg-green-600 hover:bg-green-700 text-white" 
        : "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex items-center">
            <img 
              src={agent.avatar || 'https://via.placeholder.com/60x60?text=AI'} 
              alt={agent.name || 'AI Agent'} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{agent.name || 'Unnamed Agent'}</h2>
              <div className="flex items-center text-gray-400">
                <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
                <span>{agent.category || 'General'}</span>
                
                {/* Show auction badge in the modal header */}
                {isInAuction && (
                  <span className="ml-2 bg-purple-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold">
                    In Auction
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex border-b border-white/10">
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'about' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'try' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('try')}
          >
            Try Agent
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'metadata' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('metadata')}
          >
            Metadata
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {activeTab === 'about' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">About this Agent</h3>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">{agent.description || 'No description provided'}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-gray-400 mb-2 text-sm">Price</h4>
                    <p className="text-green-400 font-bold text-xl">{agent.price ? `${agent.price} ETH` : 'Free'}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-gray-400 mb-2 text-sm">Downloads</h4>
                    {/* <p className="text-white font-bold text-xl">{agent.downloads || 0}</p> */}
                  </div>
                </div>
                
                {agent.performance && (
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <h4 className="text-gray-400 mb-2 text-sm">Performance</h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-5 w-5 ${
                              i < Math.round(agent.performance?.rating || 0) 
                                ? 'text-yellow-400' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                        <span className="ml-2 text-white font-bold">{agent.performance.rating.toFixed(1)}</span>
                      </div>
                      {/* <div className="text-gray-400">{agent.performance.reviews || 0} reviews</div> */}
                    </div>
                  </div>
                )}
                
                
                
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={onBuySell}
                    disabled={isOwner && isInAuction}
                    className={`px-6 py-3 rounded-lg font-bold ${getActionButtonStyle()}`}
                  >
                    {getActionButtonText()}
                  </button>
                </div>
                
                {/* Show auction explanation if in auction */}
                {isInAuction && (
                  <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                    <div className="text-purple-300 mb-2 font-semibold">
                      Auction in Progress
                    </div>
                    <p className="text-purple-200 text-sm">
                      {isOwner 
                        ? "Your agent is currently listed in an auction. You cannot make changes until the auction ends."
                        : "This agent is currently available through auction. Use the Join Auction button to place a bid."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'try' && (
            <div className="h-full flex flex-col">
              <div className="flex-grow overflow-y-auto mb-4 bg-black/30 rounded-lg p-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-3 text-gray-700" />
                    <p>Send a message to start a conversation with this agent</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-800 text-gray-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-800 text-gray-200 rounded-lg px-4 py-2 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2"
                  disabled={!message.trim() || isLoading}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
              
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={onBuySell}
                  disabled={isOwner && isInAuction}
                  className={`px-6 py-2 rounded-lg text-sm font-medium ${getActionButtonStyle()}`}
                >
                  {getActionButtonText()}
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'metadata' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Agent Metadata</h3>
              
              <div className="bg-black/30 rounded-lg p-4 mb-6 overflow-x-auto">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                  {JSON.stringify({
                    id: agent.id,
                    name: agent.name,
                    description: agent.description,
                    category: agent.category,
                    created: agent.createdAt,
                    // version: agent.version || '1.0.0',
                    // Additional metadata fields
                    // skills: agent.skills,
                    price: agent.price,
                    // downloads: agent.downloads,
                    rating: agent.performance?.rating || 0,
                    // reviews: agent.performance?.reviews || 0,
                  }, null, 2)}
                </pre>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={onBuySell}
                  disabled={isOwner && isInAuction}
                  className={`px-6 py-3 rounded-lg font-bold ${getActionButtonStyle()}`}
                >
                  {getActionButtonText()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}