import React, { useState } from 'react';
import { Coins, TrendingUp, PieChart, History, ArrowRight, X } from 'lucide-react';

export default function AgentRoyaltyStreams() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(5);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    { id: 'basic', name: 'Basic', percentage: 3, description: 'Basic royalty stream for simple agents' },
    { id: 'standard', name: 'Standard', percentage: 5, description: 'Standard royalty for most agent types' },
    { id: 'premium', name: 'Premium', percentage: 7, description: 'Premium royalties for high-value agents' },
    { id: 'custom', name: 'Custom', percentage: 'custom', description: 'Set a custom royalty percentage' }
  ];

  // Example sales and earnings data
  const salesData = [
    { month: 'Jan', sales: 4, earnings: 0.12 },
    { month: 'Feb', sales: 7, earnings: 0.21 },
    { month: 'Mar', sales: 6, earnings: 0.18 },
    { month: 'Apr', sales: 9, earnings: 0.27 },
    { month: 'May', sales: 12, earnings: 0.36 },
    { month: 'Jun', sales: 15, earnings: 0.45 }
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    if (tierId !== 'custom') {
      const tier = tiers.find(t => t.id === tierId);
      if (tier && typeof tier.percentage === 'number') {
        setRoyaltyPercentage(tier.percentage);
      }
    }
  };

  const handleCustomPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 15) {
      setRoyaltyPercentage(value);
    }
  };

  const handleSubmit = () => {
    alert(`Royalty Stream Setup: ${royaltyPercentage}% royalty will be applied to future sales of your AI agents. This feature will be implemented soon!`);
    closeModal();
  };

  // Simple bar chart renderer
  const RoyaltyBarChart = ({ data }: { data: { month: string; earnings: number }[] }) => {
    const maxEarning = Math.max(...data.map(d => d.earnings));
    
    return (
      <div className="mt-2">
        <div className="flex items-end justify-between h-32 px-2">
          {data.map((item, index) => {
            const heightPercentage = (item.earnings / maxEarning) * 100;
            return (
              <div key={index} className="flex flex-col items-center w-full">
                <div 
                  className="text-xs text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ height: '20px' }}
                >
                  {item.earnings} ETH
                </div>
                <div className="flex flex-col items-center justify-end group relative">
                  <div 
                    className="w-8 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-sm hover:from-amber-400 hover:to-orange-300 transition-colors relative group cursor-pointer"
                    style={{ height: `${Math.max(heightPercentage, 5)}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.earnings} ETH
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden relative">
      {/* Featured badge */}
      <div className="absolute top-0 right-0">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          FEATURED
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-lg">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Agent Royalty Streams</h3>
        </div>
        
        <p className="text-gray-300 mb-6">
          Earn passive income from your AI agents every time they are resold in the marketplace. Set up royalty percentages and watch your earnings grow over time.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h4 className="font-medium text-white">Lifetime Earnings</h4>
            </div>
            <p className="text-2xl font-bold text-white">1.59 ETH</p>
            <p className="text-green-400 text-sm">+0.45 ETH this month</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <PieChart className="h-5 w-5 text-purple-400" />
              <h4 className="font-medium text-white">Current Royalty</h4>
            </div>
            <p className="text-2xl font-bold text-white">5-7%</p>
            <p className="text-gray-400 text-sm">Per secondary sale</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <History className="h-5 w-5 text-cyan-400" />
            <h4 className="font-medium text-white">Recent Royalty Earnings</h4>
          </div>
          
          {/* Royalty earnings bar chart */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1 text-center">Monthly Earnings (ETH)</p>
            <RoyaltyBarChart data={salesData} />
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-2 text-left">Month</th>
                  <th className="pb-2 text-center">Sales</th>
                  <th className="pb-2 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    <td className="py-2 text-white">{data.month}</td>
                    <td className="py-2 text-center text-white">{data.sales}</td>
                    <td className="py-2 text-right text-green-400">{data.earnings} ETH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <button
          onClick={openModal}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold text-white hover:from-amber-400 hover:to-orange-400 transition-colors flex items-center justify-center"
        >
          Set Up Royalty Stream <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
      
      {/* Modal for setting up royalty */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-purple-500 rounded-xl p-6 max-w-md mx-4 animate-scale-in shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Set Up Royalty Stream</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-300 mb-4">
              Choose a royalty tier that will apply to all future sales of your AI agents on our marketplace.
            </p>
            
            <div className="space-y-3 mb-6">
              {tiers.map(tier => (
                <div 
                  key={tier.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTier === tier.id 
                      ? 'bg-purple-600/20 border-purple-500' 
                      : 'bg-white/5 border-gray-700 hover:bg-white/10'
                  }`}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{tier.name}</span>
                    <span className="text-cyan-400">
                      {tier.percentage === 'custom' ? 'Custom' : `${tier.percentage}%`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{tier.description}</p>
                </div>
              ))}
            </div>
            
            {selectedTier === 'custom' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Royalty Percentage (1-15%)
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={royaltyPercentage}
                  onChange={handleCustomPercentageChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-400">1%</span>
                  <span className="text-sm font-medium text-white">{royaltyPercentage}%</span>
                  <span className="text-sm text-gray-400">15%</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold text-white hover:from-amber-400 hover:to-orange-400 transition-colors"
            >
              Confirm Royalty Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
