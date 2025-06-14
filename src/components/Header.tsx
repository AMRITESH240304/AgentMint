import React from 'react';
import { Bot, Zap, Menu, X } from 'lucide-react';
import WalletButton from './WalletButton';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Register', id: 'register' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Marketplace', id: 'marketplace' },
    { name: 'Advanced', id: 'advanced' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="h-8 w-8 text-cyan-400" />
              <Zap className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AgentMint
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-white/5'
                  } ${
                    item.id === 'advanced' ? 'relative' : ''
                  }`}
                >
                  {item.name}
                  {item.id === 'advanced' && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <WalletButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-md rounded-lg mt-2 p-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium text-left transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-white/5'
                  } ${
                    item.id === 'advanced' ? 'relative' : ''
                  }`}
                >
                  {item.name}
                  {item.id === 'advanced' && (
                    <span className="absolute top-1.5 ml-2 px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-[10px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}