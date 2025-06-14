import React from 'react';
import { Vote, Users, TrendingUp } from 'lucide-react';
import AgentRoyaltyStreams from './AgentRoyaltyStreams';
import RentAgentCard from './RentAgentCard';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function FeatureCard({ title, description, icon, onClick }: FeatureCardProps) {
  return (
    <div 
      className="bg-gray-800/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 animate-feature-card cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdvancedFeatures() {
  const showFeatureAlert = (feature: string) => {
    // Create a custom alert overlay instead of using the browser alert
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm';
    
    const alertBox = document.createElement('div');
    alertBox.className = 'bg-gray-800 border border-purple-500 rounded-xl p-6 max-w-md mx-auto animate-zoom-in shadow-xl';
    
    const title = document.createElement('h3');
    title.className = 'text-xl font-bold text-white mb-3';
    title.textContent = 'Coming Soon!';
    
    const message = document.createElement('p');
    message.className = 'text-gray-300 mb-4';
    message.textContent = `The "${feature}" feature will be implemented soon!`;
    
    const button = document.createElement('button');
    button.className = 'w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity';
    button.textContent = 'OK';
    button.onclick = () => {
      document.body.removeChild(overlay);
    };
    
    alertBox.appendChild(title);
    alertBox.appendChild(message);
    alertBox.appendChild(button);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
  };

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white inline-block mb-3">COMING SOON</span>
          <h2 className="text-4xl font-bold text-white mb-4">Advanced Features</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Cutting-edge capabilities for the AI agent ecosystem. Our platform is constantly evolving to bring you the most innovative features.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <FeatureCard 
            title="DAO Voting on Super Agents"
            description="Let your community vote on rare agent drops and determine the next generation of AI assistants."
            icon={<Vote className="h-8 w-8 text-white" />}
            onClick={() => showFeatureAlert('DAO Voting')}
          />
          
          <FeatureCard 
            title="Agent-as-a-Service"
            description="Let buyers rent out the agent to others after purchase, creating a new revenue stream."
            icon={<Users className="h-8 w-8 text-white" />}
            onClick={() => showFeatureAlert('Agent-as-a-Service')}
          />
          
          {/* Custom detailed component for Agent Royalty Streams */}
          <AgentRoyaltyStreams />
          
          <FeatureCard 
            title="Leaderboards"
            description="Discover top bidders, most used agents, and other community highlights."
            icon={<TrendingUp className="h-8 w-8 text-white" />}
            onClick={() => showFeatureAlert('Leaderboards')}
          />
          
          {/* Custom detailed component for Rent this Agent */}
          <RentAgentCard />
        </div>
        
        <div className="text-center">
          <p className="text-gray-400 mb-4">We're constantly working on new features. Have suggestions?</p>
          <button 
            onClick={() => showFeatureAlert('Feature Suggestion')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
          >
            Submit Feature Request
          </button>
        </div>
      </div>
    </section>
  );
}
