import React, { useState } from 'react';
import { Bot, Upload, Zap, CheckCircle, Loader } from 'lucide-react';
import type { RegistrationForm, AIAgent } from '../types/agent';

interface AgentRegistrationProps {
  onRegister: (agent: AIAgent) => void;
}

export default function AgentRegistration({ onRegister }: AgentRegistrationProps) {
  const [form, setForm] = useState<RegistrationForm>({
    name: '',
    description: '',
    capabilities: [],
    category: 'Assistant',
    avatar: '',
    model: '',
    version: '',
    training: '',
    parameters: '',
    price: 0,
    isForSale: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [capabilityInput, setCapabilityInput] = useState('');

  const categories: AIAgent['category'][] = ['Assistant', 'Creative', 'Analytical', 'Gaming', 'Trading', 'Social'];

  const addCapability = () => {
    if (capabilityInput.trim() && !form.capabilities.includes(capabilityInput.trim())) {
      setForm(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capabilityInput.trim()]
      }));
      setCapabilityInput('');
    }
  };

  const removeCapability = (capability: string) => {
    setForm(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate blockchain minting process
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newAgent: AIAgent = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      avatar: form.avatar || `https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400`,
      creator: 'You',
      performance: {
        rating: 0,
        tasks: 0,
        uptime: 100,
      },
      metadata: {
        model: form.model,
        version: form.version,
        training: form.training,
        parameters: form.parameters,
      },
      blockchain: {
        tokenId: `AGENT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        mintedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    onRegister(newAgent);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-12">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Agent Successfully Minted!</h2>
            <p className="text-gray-300 mb-8">
              Your AI agent has been successfully registered as an NFT on the Story blockchain.
              You can now view it in the gallery and manage it in the marketplace.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: '',
                  description: '',
                  capabilities: [],
                  category: 'Assistant',
                  avatar: '',
                  model: '',
                  version: '',
                  training: '',
                  parameters: '',
                  price: 0,
                  isForSale: false,
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
            >
              Register Another Agent
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Register Your AI Agent</h2>
          <p className="text-xl text-gray-300">Transform your AI agent into a unique NFT on the Story blockchain</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Bot className="h-5 w-5 text-cyan-400" />
                <span>Basic Information</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter agent name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Describe your AI agent's purpose and functionality"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as AIAgent['category'] }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg (optional)"
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-400" />
                <span>Technical Specs</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
                <input
                  type="text"
                  required
                  value={form.model}
                  onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g., GPT-4, Claude-3, Custom Model"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Version</label>
                <input
                  type="text"
                  required
                  value={form.version}
                  onChange={(e) => setForm(prev => ({ ...prev, version: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g., v1.0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Training Data</label>
                <input
                  type="text"
                  required
                  value={form.training}
                  onChange={(e) => setForm(prev => ({ ...prev, training: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g., Custom Dataset, Public Web, Specialized Domain"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Parameters</label>
                <input
                  type="text"
                  required
                  value={form.parameters}
                  onChange={(e) => setForm(prev => ({ ...prev, parameters: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g., 175B, 70B, Custom"
                />
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Capabilities</label>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={capabilityInput}
                onChange={(e) => setCapabilityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Add a capability (e.g., Natural Language Processing)"
              />
              <button
                type="button"
                onClick={addCapability}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-white font-medium transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                >
                  <span>{capability}</span>
                  <button
                    type="button"
                    onClick={() => removeCapability(capability)}
                    className="text-purple-400 hover:text-purple-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Marketplace Settings */}
          <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Marketplace Settings</h3>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="checkbox"
                id="forSale"
                checked={form.isForSale}
                onChange={(e) => setForm(prev => ({ ...prev, isForSale: e.target.checked }))}
                className="w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400"
              />
              <label htmlFor="forSale" className="text-gray-300">List for sale in marketplace</label>
            </div>
            {form.isForSale && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="0.1"
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Minting on Story Blockchain...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Register & Mint NFT</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}