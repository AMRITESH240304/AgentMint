import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, X, Code, ChevronDown, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

type LeaderboardTab = 'bidders' | 'agents' | 'creators';
type TimeRange = '24h' | '7d' | '30d' | 'all';

interface LeaderboardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardsModal({ isOpen, onClose }: LeaderboardsModalProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('bidders');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [showFilters, setShowFilters] = useState(false);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bidders':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bids Placed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ETH Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Auctions Won</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className={i < 3 ? "bg-gradient-to-r from-transparent via-purple-900/10 to-transparent" : ""}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-300' : i === 2 ? 'bg-amber-700' : 'bg-gray-700'
                      } text-black font-bold text-xs`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mr-3"></div>
                        <div>
                          <div className="text-white">User{i + 1}</div>
                          <div className="text-xs text-gray-400">
                            {i === 0 ? "Crypto Whale 🐋" : i === 1 ? "Auction Master 🏆" : ""}
                          </div>
                        </div>
                        {i < 2 && <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500/20 rounded-full text-purple-300">Top Bidder</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{30 - i * 5}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{(10 - i * 1.5).toFixed(2)} ETH</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{8 - i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'agents':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agent Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uses</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tasks Completed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className={i < 3 ? "bg-gradient-to-r from-transparent via-purple-900/10 to-transparent" : ""}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-300' : i === 2 ? 'bg-amber-700' : 'bg-gray-700'
                      } text-black font-bold text-xs`}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></div>
                        <div className="text-white">CryptoTraderAI {5-i}.0</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">Owner{i + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{10000 - i * 1500}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{8500 - i * 1200}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
                        {i % 3 === 0 ? "Trading" : i % 3 === 1 ? "Coding" : "Writing"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{(25 - i * 3.5).toFixed(2)} ETH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'creators':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Creator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Agents Minted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Royalties Earned</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg. Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className={i < 3 ? "bg-gradient-to-r from-transparent via-purple-900/10 to-transparent" : ""}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mr-3 flex items-center justify-center text-white text-xs font-bold`}>
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-white">Creator{i + 1}</div>
                          <div className="text-xs text-gray-400">
                            {i === 0 ? "Builder Supreme 👑" : i === 1 ? "Agent Architect 🏗️" : ""}
                          </div>
                        </div>
                        {i === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-pink-500/20 rounded-full text-pink-300">Verified Genius</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{50 - i * 8}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{(120 - i * 20).toFixed(2)} ETH</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-300">{(24 - i * 4).toFixed(2)} ETH</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400">{(4.9 - i * 0.2).toFixed(1)}</span>
                        <div className="w-20 h-2 bg-gray-700 rounded-full ml-2 overflow-hidden">
                          <div className={`h-full bg-gradient-to-r from-yellow-400 to-yellow-500`} style={{width: `${(4.9 - i * 0.2) / 5 * 100}%`}}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-800 border border-purple-500/30 rounded-2xl p-6 w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Leaderboards</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'bidders' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
              onClick={() => setActiveTab('bidders')}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Top Bidders
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'agents' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
              onClick={() => setActiveTab('agents')}
            >
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Top Agents
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'creators' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
              onClick={() => setActiveTab('creators')}
            >
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Top Creators
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                className="flex items-center space-x-1 bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg text-white text-sm transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-purple-500/30 rounded-lg shadow-xl z-10">
                  <div className="p-2 border-b border-purple-500/30">
                    <p className="text-xs text-gray-400 mb-1">Time Range</p>
                    <div className="grid grid-cols-2 gap-1">
                      {(['24h', '7d', '30d', 'all'] as TimeRange[]).map((range) => (
                        <button
                          key={range}
                          className={`px-2 py-1 text-xs rounded ${timeRange === range ? 'bg-purple-500/30 text-purple-300' : 'hover:bg-white/5 text-gray-300'}`}
                          onClick={() => setTimeRange(range)}
                        >
                          {range === 'all' ? 'All Time' : range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-400 mb-1">Categories</p>
                    <div className="space-y-1">
                      {['All', 'Coding', 'Trading', 'Writing'].map((cat) => (
                        <div key={cat} className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`cat-${cat}`} 
                            className="mr-2 accent-purple-500"
                            defaultChecked={cat === 'All'} 
                          />
                          <label htmlFor={`cat-${cat}`} className="text-xs text-gray-300">{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <select 
              className="bg-gray-700/50 border border-gray-600 text-white rounded-lg text-sm px-3 py-1.5 appearance-none cursor-pointer"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto flex-1 rounded-xl border border-purple-500/20">
          {renderTabContent()}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing top performers for <span className="text-white font-medium">{timeRange === 'all' ? 'all time' : `last ${timeRange}`}</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-1.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-white/5 transition-colors text-sm">
              View All
            </button>
            <button className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white text-sm hover:opacity-90 transition-opacity">
              Join Leaderboard
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}