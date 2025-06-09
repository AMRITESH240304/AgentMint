import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export default function WalletButton() {
  const { 
    isConnected, 
    address, 
    chainId, 
    isConnecting, 
    connectWallet, 
    disconnectWallet,
    isMetaMaskInstalled 
  } = useWallet();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  const getNetworkName = (id: number) => {
    switch (id) {
      case 1: return 'Ethereum';
      case 5: return 'Goerli';
      case 11155111: return 'Sepolia';
      case 137: return 'Polygon';
      case 80001: return 'Mumbai';
      default: return `Chain ${id}`;
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-lg font-medium text-white transition-all duration-300 flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>Install MetaMask</span>
      </a>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-medium text-white transition-all duration-300 flex items-center space-x-2 disabled:cursor-not-allowed"
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium text-white transition-all duration-300 flex items-center space-x-2"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span>{formatAddress(address!)}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Connected Account</span>
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                {getNetworkName(chainId!)}
              </span>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <div className="text-white font-mono text-sm break-all">
                {address}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Address</span>
              </button>
              
              <button
                onClick={openEtherscan}
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Etherscan</span>
              </button>
              
              <hr className="border-white/10" />
              
              <button
                onClick={() => {
                  disconnectWallet();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}