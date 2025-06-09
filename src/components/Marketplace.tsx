import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Users } from 'lucide-react';
import type { AIAgent } from '../types/agent';

interface MarketplaceProps {
  agents: AIAgent[];
}

export default function Marketplace({ agents }: MarketplaceProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  const forSaleAgents = agents.filter(agent => agent.isForSale);
  const totalVolume = forSaleAgents.reduce((sum, agent) => sum + agent.price, 0);
  const avgPrice = forSaleAgents.length > 0 ? totalVolume / forSaleAgents.length : 0;

  const handlePurchase = (agent: AIAgent) => {
    setSelectedAgent(agent);
    // Simulate purchase process
    setTimeout(() => {
      alert(`Successfully purchased ${agent.name} for ${agent.price} ETH!`);
      setSelectedAgent(null);
    }, 2000);
  };

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">AI Agent Marketplace</h2>
          <p className="text-xl text-gray-300">Buy and sell AI agent NFTs with confidence</p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <ShoppingCart className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{forSaleAgents.length}</div>
            <div className="text-sm text-gray-400">Listed Agents</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalVolume.toFixed(2)} ETH</div>
            <div className="text-sm text-gray-400">Total Volume</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{avgPrice.toFixed(3)} ETH</div>
            <div className="text-sm text-gray-400">Average Price</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{agents.length}</div>
            <div className="text-sm text-gray-400">Total Agents</div>
          </div>
        </div>

        {/* Featured Listings */}
        {forSaleAgents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">No Agents for Sale</h3>
              <p className="text-gray-300">
                Check back later for new listings, or register your own agent to start selling!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forSaleAgents.map((agent) => (
              <MarketplaceCard
                key={agent.id}
                agent={agent}
                onPurchase={handlePurchase}
                isPurchasing={selectedAgent?.id === agent.id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MarketplaceCard({ 
  agent, 
  onPurchase, 
  isPurchasing 
}: { 
  agent: AIAgent; 
  onPurchase: (agent: AIAgent) => void;
  isPurchasing: boolean;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
      <div className="relative">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-white">{agent.name}</h3>
              <p className="text-gray-300 text-sm">{agent.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{agent.price} ETH</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agent.description}</p>

        {/* Performance Metrics */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center space-x-1 text-yellow-400">
            <span>★ {agent.performance.rating.toFixed(1)}</span>
          </div>
          <div className="text-cyan-400">
            {agent.performance.tasks} tasks
          </div>
          <div className="text-green-400">
            {agent.performance.uptime}% uptime
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-white/5 rounded-lg p-3 mb-4 text-xs">
          <div className="grid grid-cols-2 gap-2 text-gray-400">
            <div>Model: <span className="text-white">{agent.metadata.model}</span></div>
            <div>Version: <span className="text-white">{agent.metadata.version}</span></div>
            <div>Parameters: <span className="text-white">{agent.metadata.parameters}</span></div>
            <div>Training: <span className="text-white">{agent.metadata.training}</span></div>
          </div>
        </div>

        {/* Blockchain Info */}
        <div className="text-xs text-gray-400 mb-4">
          <div>Token ID: {agent.blockchain.tokenId}</div>
          <div>Creator: {agent.creator}</div>
        </div>

        <button
          onClick={() => onPurchase(agent)}
          disabled={isPurchasing}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isPurchasing ? 'Processing...' : `Buy for ${agent.price} ETH`}
        </button>
      </div>
    </div>
  );
}