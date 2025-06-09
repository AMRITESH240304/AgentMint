import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AgentRegistration from './components/AgentRegistration';
import AgentGallery from './components/AgentGallery';
import Marketplace from './components/Marketplace';
import type { AIAgent } from './types/agent';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [agents, setAgents] = useState<AIAgent[]>([]);

  const handleRegisterAgent = (agent: AIAgent) => {
    setAgents(prev => [...prev, agent]);
    setActiveSection('gallery');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'register':
        return <AgentRegistration onRegister={handleRegisterAgent} />;
      case 'gallery':
        return <AgentGallery agents={agents} setActiveSection={setActiveSection} />;
      case 'marketplace':
        return <Marketplace agents={agents} />;
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderSection()}
    </div>
  );
}

export default App;