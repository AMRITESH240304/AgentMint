import React from 'react';
import { ArrowRight, Sparkles, Shield, Coins } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

export default function Hero({ setActiveSection }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-full px-6 py-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by Story Blockchain</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mint Your AI Agent
            </span>
            <br />
            <span className="text-white">as an NFT</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your intelligent AI agents into unique, tradeable NFTs on the Story blockchain. 
            Own, showcase, and monetize your digital workforce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setActiveSection('register')}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Register Your Agent</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setActiveSection('gallery')}
              className="px-8 py-4 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              Explore Gallery
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <Shield className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure Ownership</h3>
              <p className="text-gray-400">Your AI agents are securely stored on Story blockchain with immutable ownership records.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Unique Metadata</h3>
              <p className="text-gray-400">Each agent NFT contains comprehensive metadata about capabilities and performance.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Tradeable Assets</h3>
              <p className="text-gray-400">Buy, sell, and trade AI agent NFTs in our integrated marketplace.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}