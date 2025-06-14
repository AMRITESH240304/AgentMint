import { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock3, Info, X, CheckCircle } from 'lucide-react';
import type { AIAgent } from '../types/agent';
import { useAccount } from 'wagmi';

// Define interface for rental data
interface RentalData {
  nft_id: string;
  owner_wallet: string;
  renter_wallet: string;
  rental_start: string;
  rental_end: string;
}

// Sample agent for demo purposes
const sampleAgent: AIAgent = {
  id: '4',
  name: 'Trading Pro AI',
  description: 'Advanced trading AI with real-time market analysis and automated strategy execution.',
  category: 'Trading',
  price: 7.2,
  isForSale: true,
  avatar: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzVneXh1MXN0ZmpraHM2MzJzd3Vmc2g5ZjZtdDk4cHl5MGZzbWlpZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JqDeI2yjpSRgdh35oe/giphy.gif',
  capabilities: ['market analysis', 'algorithmic trading', 'portfolio management'],
  creator: 'FinTech Labs',
  performance: { rating: 4.9, tasks: 1250, uptime: 99.7 },
  metadata: { 
    model: 'FinGPT-4', 
    version: '2.1', 
    training: 'Reinforcement Learning on Market Data', 
    parameters: '175000000000' 
  },
  blockchain: {
    tokenId: '1004',
    contractAddress: '0xabcd1234...',
    transactionHash: '0xefgh5678...',
    mintedAt: new Date().toISOString(),
    ownerAddress: '0x3a84fbD5f512ef389c541C5f6D1a0c8c6DCCe9C4' // Added owner address
  },
  createdAt: new Date().toISOString()
};

interface RentalPlan {
  id: string;
  name: string;
  duration: string;
  durationHours: number;
  priceETH: number;
  priceUSD: number;
  features: string[];
}

export default function RentAgentCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isRenting, setIsRenting] = useState(false);
  const [rentalSuccess, setRentalSuccess] = useState(false);
  const [activeRentals, setActiveRentals] = useState<RentalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the user's wallet address
  const { address } = useAccount();
  
  // Fetch active rentals when component mounts
  useEffect(() => {
    fetchActiveRentals();
  }, []);
  
  // Function to fetch active rentals
  const fetchActiveRentals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://agent-mint-back.onrender.com/active-rentals");
      if (!response.ok) {
        throw new Error("Failed to fetch active rentals");
      }
      const data = await response.json();
      setActiveRentals(data.active_rentals);
    } catch (err) {
      console.error("Error fetching active rentals:", err);
      setError("Failed to load active rentals");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Rental plans
  const rentalPlans: RentalPlan[] = [
    {
      id: 'hourly',
      name: 'Hourly Access',
      duration: '1 Hour',
      durationHours: 1,
      priceETH: 0.05,
      priceUSD: 10,
      features: ['Full API access', 'Up to 100 requests', 'Basic support']
    },
    {
      id: 'daily',
      name: 'Daily Pass',
      duration: '24 Hours',
      durationHours: 24,
      priceETH: 0.2,
      priceUSD: 40,
      features: ['Full API access', 'Unlimited requests', 'Priority support', 'Usage analytics']
    },
    {
      id: 'weekly',
      name: 'Weekly Access',
      duration: '7 Days',
      durationHours: 168,
      priceETH: 1.0,
      priceUSD: 200,
      features: ['Full API access', 'Unlimited requests', 'Premium support', 'Usage analytics', 'Custom configuration']
    },
    {
      id: 'monthly',
      name: 'Extended Access',
      duration: '30 Days',
      durationHours: 720,
      priceETH: 3.5,
      priceUSD: 700,
      features: ['Full API access', 'Unlimited requests', 'Premium support', 'Usage analytics', 'Custom configuration', 'White-labeling options']
    }
  ];

  const openModal = () => {
    setIsModalOpen(true);
    setRentalSuccess(false);
    setError(null); // Clear any previous errors
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleRentNow = async () => {
    if (!selectedPlan || !address) return;
    
    // Get selected plan details
    const plan = rentalPlans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    setIsRenting(true);
    
    try {
      // Calculate rental period based on the selected plan
      const now = new Date();
      const endDate = new Date(now.getTime() + plan.durationHours * 60 * 60 * 1000);
      
      // Check if user is trying to rent their own NFT
      if (address.toLowerCase() === sampleAgent.blockchain.ownerAddress?.toLowerCase()) {
        setError("You cannot rent your own NFT");
        setIsRenting(false);
        return;
      }
      
      // Call the rent API
      const response = await fetch("https://agent-mint-back.onrender.com/rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftId: sampleAgent.blockchain.tokenId,
          ownerWallet: sampleAgent.blockchain.ownerAddress,
          renterWallet: address,
          rentalStart: now.toISOString(),
          rentalEnd: endDate.toISOString()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to rent agent");
      }
      
      // Refresh active rentals after successful rental
      await fetchActiveRentals();
      
      setRentalSuccess(true);
    } catch (err) {
      console.error("Error renting agent:", err);
      setError("Failed to rent the agent. Please try again.");
    } finally {
      setIsRenting(false);
    }
  };

  // Calculate time remaining for active rentals
  const calculateTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return { hours: 0, minutes: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden relative h-full flex flex-col">
      {/* Featured badge */}
      <div className="absolute top-0 right-0">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          NEW
        </div>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-2.5 rounded-lg">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Rent this Agent</h3>
        </div>
        
        <p className="text-gray-300 mb-4 text-sm">
          Access premium AI agents without purchasing them outright. Rent for hours, days, or weeks based on your needs.
        </p>
        
        {/* Featured Agent for Rent */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 mb-4 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={sampleAgent.avatar} 
                alt={sampleAgent.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-white">{sampleAgent.name}</h4>
              <p className="text-xs text-gray-400 line-clamp-1">{sampleAgent.description}</p>
              <div className="flex items-center mt-1">
                <span className="bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded text-xs">
                  {sampleAgent.category}
                </span>
                <span className="mx-2 text-gray-500">•</span>
                <div className="flex items-center text-amber-400 text-xs">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span className="ml-1 text-white">{sampleAgent.performance.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button 
                onClick={openModal}
                className="px-2.5 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white text-xs font-medium hover:from-blue-400 hover:to-cyan-400 transition-colors"
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Rentals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white flex items-center">
              <Clock3 className="h-5 w-5 mr-2 text-cyan-400" />
              Active Rentals
            </h4>
            <span className="text-xs text-gray-400">{activeRentals.length} active</span>
          </div>
          
          {isLoading ? (
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Loading active rentals...</p>
            </div>
          ) : error ? (
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : activeRentals.length > 0 ? (
            <div className="space-y-3">
              {activeRentals.map((rental, index) => {
                // Calculate time remaining
                const endTime = new Date(rental.rental_end);
                const { hours, minutes } = calculateTimeRemaining(endTime);
                
                // Calculate usage percentage (time elapsed / total rental duration)
                const startTime = new Date(rental.rental_start);
                const totalDuration = endTime.getTime() - startTime.getTime();
                const elapsed = new Date().getTime() - startTime.getTime();
                const usagePercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                
                return (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {rental.nft_id.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-white text-sm">Agent #{rental.nft_id}</h5>
                        <div className="flex items-center text-xs text-gray-400">
                          <span>Active Rental</span>
                          <span className="mx-1">•</span>
                          <span className="text-cyan-400">{hours}h {minutes}m remaining</span>
                        </div>
                      </div>
                      <div className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                          style={{ width: `${usagePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">No active rentals at this time</p>
            </div>
          )}
        </div>
        
        {/* Popular Rental Options */}
        <div className="mb-6">
          <h4 className="font-medium text-white flex items-center mb-3">
            <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
            Popular Rental Periods
          </h4>
          
          <div className="grid grid-cols-2 gap-2 text-center">
            {rentalPlans.slice(0, 4).map((plan) => (
              <div 
                key={plan.id}
                className="bg-white/5 rounded-lg p-2 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedPlan(plan.id);
                  openModal();
                }}
              >
                <h5 className="font-medium text-white text-sm">{plan.name}</h5>
                <p className="text-cyan-400 text-xs">{plan.duration}</p>
                <p className="text-gray-300 mt-1">{plan.priceETH} ETH</p>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={openModal}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-blue-400 hover:to-cyan-400 transition-colors flex items-center justify-center"
        >
          Explore Rental Options
        </button>
      </div>
      
      {/* Rental Modal */}
      {isModalOpen && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/80 backdrop-blur-sm rounded-2xl"
          onClick={closeModal}
        >
          <div 
            className="bg-gray-800 border border-purple-500 rounded-xl p-4 w-full max-w-[90%] mx-auto animate-zoom-in shadow-xl overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {rentalSuccess ? (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Rental Successful!</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  You now have access to {sampleAgent.name} for the selected duration.
                  Your rental has been recorded on the blockchain.
                </p>
                <div className="bg-white/5 rounded-lg p-3 mb-4 text-left">
                  <h4 className="font-medium text-white text-sm mb-2">Rental Information</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-gray-400">Agent ID:</span>
                    <span className="text-cyan-400 font-mono text-xs break-all">{sampleAgent.blockchain.tokenId}</span>
                    <span className="text-gray-400">Rented From:</span>
                    <span className="text-cyan-400 font-mono">{sampleAgent.blockchain.ownerAddress?.substring(0, 6)}...{sampleAgent.blockchain.ownerAddress?.substring(sampleAgent.blockchain.ownerAddress.length - 4)}</span>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    closeModal();
                    fetchActiveRentals(); // Refresh the active rentals list
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium text-white hover:from-blue-400 hover:to-cyan-400 transition-colors text-sm"
                >
                  View My Rentals
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-white">Rent {sampleAgent.name}</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={sampleAgent.avatar} 
                      alt={sampleAgent.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{sampleAgent.name}</h4>
                    <p className="text-xs text-gray-400 line-clamp-1">{sampleAgent.description}</p>
                  </div>
                </div>
                
                <h4 className="font-medium text-white mb-2 text-sm">Select Rental Period</h4>
                
                <div className="space-y-2 mb-4">
                  {rentalPlans.map(plan => (
                    <div 
                      key={plan.id}
                      className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                        selectedPlan === plan.id 
                          ? 'bg-blue-600/20 border-blue-500' 
                          : 'bg-white/5 border-gray-700 hover:bg-white/10'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-white text-sm">{plan.name}</span>
                        <div className="text-right">
                          <span className="text-cyan-400 font-medium text-sm">{plan.priceETH} ETH</span>
                          <span className="text-gray-400 text-xs ml-1">(~${plan.priceUSD})</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-xs text-gray-400">{plan.duration}</span>
                        <span className="text-xs text-gray-400">${(plan.priceUSD / plan.durationHours).toFixed(2)}/hour</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="inline-block px-1.5 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
                            {feature}
                          </span>
                        ))}
                        {plan.features.length > 3 && (
                          <span className="inline-block px-1.5 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300">
                            +{plan.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-2 mb-4 flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300">
                    Renting gives you temporary access to this agent's capabilities through our API. You'll receive access credentials after payment.
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-2 mb-4 flex items-start space-x-2">
                    <Info className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">
                      {error}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleRentNow}
                  disabled={!selectedPlan || isRenting}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-blue-400 hover:to-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                  {isRenting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    'Rent Now'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
