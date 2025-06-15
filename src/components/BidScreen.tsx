import { useState, useEffect } from 'react';
import type { AIAgent } from '../types/agent';
import { ArrowLeft, Info, CheckCircle, XCircle, Hammer, Clock, RefreshCw, Trophy, RotateCcw, Shield, Key, AlertCircle } from 'lucide-react';
import { useAuctionHttp } from '../utils/auctionSocket';
import { useRainbowKit } from '../hooks/useRainbowKit';
import { 
  authorizeWallet, 
  isWalletAuthorized, 
  registerAgentAsIP,
  processAuctionPayment,
  setupLicenseTerms,
  getTransactionStatus
} from '../utils/storyAuction';

interface BidScreenProps {
  agent: AIAgent;
  onBack: () => void;
}

export default function BidScreen({ agent, onBack }: BidScreenProps) {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isBidding, setIsBidding] = useState(false);
  const [bidStatus, setBidStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHammerAnimation, setShowHammerAnimation] = useState(false);
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
  
  // Story Protocol wallet authorization states
  const [privateKey, setPrivateKey] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Transaction processing states
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'payment' | 'registration' | 'complete' | 'error'>('idle');
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [ipId, setIpId] = useState<string | null>(null);
  
  const { address } = useRainbowKit();
  
  // Use the simplified HTTP-only auction hook
  const { 
    auctionData, 
    error, 
    isLoading,
    bidSuccessful,
    isWinner,
    timeLeft,
    auctionEnded,
    placeBid,
    refreshAuction,
    restartAuction
  } = useAuctionHttp(agent.id, address);
  
  // Get current highest bid from either auction data or agent price
  const currentHighestBid = auctionData?.highest_bid ?? agent.price;
  
  // Check if wallet is already authorized with Story Protocol
  const isWalletReady = address ? isWalletAuthorized(address) : false;
  
  // Handle wallet authorization with Story Protocol
  const handleAuthorizeWallet = async () => {
    if (!address) {
      setAuthError("Please connect your wallet first");
      setAuthStatus('error');
      return;
    }
    
    if (!privateKey) {
      setAuthError("Please enter your private key");
      setAuthStatus('error');
      return;
    }
    
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      const success = await authorizeWallet(address, privateKey);
      
      if (success) {
        setAuthStatus('success');
        // Clear private key from state after successful authentication
        setPrivateKey('');
        
        // Hide the modal after a delay
        setTimeout(() => {
          setShowAuthModal(false);
        }, 1500);
      } else {
        setAuthStatus('error');
        setAuthError('Failed to authorize wallet. Please try again.');
      }
    } catch (error: any) {
      setAuthStatus('error');
      setAuthError(error.message || 'An unexpected error occurred');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  // Process winning transaction through Story Protocol
  const processWinningTransaction = async () => {
    if (!address || !isWinner || !auctionEnded) {
      return;
    }
    
    // Ensure wallet is authorized
    if (!isWalletReady) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      // Start payment processing
      setTransactionStatus('payment');
      setTransactionError(null);
      
      // Process payment
      const paymentTxHash = await processAuctionPayment(agent, address, currentHighestBid);
      setTransactionHash(paymentTxHash);
      
      // Start IP registration
      setTransactionStatus('registration');
      
      // Register the agent as an IP asset
      const registration = await registerAgentAsIP(agent, address);
      setTransactionHash(registration.txHash);
      setIpId(registration.ipId);
      
      // Set up license terms
      await setupLicenseTerms(agent);
      
      // Complete the process
      setTransactionStatus('complete');
    } catch (error: any) {
      setTransactionStatus('error');
      setTransactionError(error.message || 'An unexpected error occurred during transaction processing');
      console.error('Transaction processing error:', error);
    }
  };
  
  // Check for winner status and process transaction
  useEffect(() => {
    if (isWinner && auctionEnded && address) {
      // Get existing transaction status
      const existingTx = getTransactionStatus(agent.id);
      
      if (existingTx) {
        // If transaction already exists, update our state
        setTransactionHash(existingTx.txHash);
        setIpId(existingTx.ipId);
        setTransactionStatus('complete');
      } else if (isWalletReady) {
        // Auto-process the transaction if wallet is already authorized
        processWinningTransaction();
      }
    }
  }, [isWinner, auctionEnded, address, isWalletReady, agent.id]);
  
  // Update UI based on auction data and errors
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setBidStatus('error');
    }
    
    if (bidSuccessful) {
      setBidStatus('success');
    }
  }, [error, bidSuccessful]);
  
  
  // Set up a simple countdown timer
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  
  useEffect(() => {
    if (!auctionData) {
      setTimeRemaining('Loading auction data...');
      return;
    }
    
    // Update time remaining
    if (timeLeft > 0) {
      setTimeRemaining(`${timeLeft}s remaining`);
    } else {
      setTimeRemaining('Auction ended');
      
      // If user is the winner, show the animation
      if (isWinner && !showWinnerAnimation) {
        setShowWinnerAnimation(true);
        setTimeout(() => setShowWinnerAnimation(false), 5000); // Hide after 5 seconds
      }
    }
    
  }, [auctionData, timeLeft, isWinner]);

  const handlePlaceBid = async () => {
    if (!address) {
      setErrorMessage("Please connect your wallet first");
      setBidStatus('error');
      return;
    }
    
    // Check if wallet is authorized with Story Protocol
    if (!isWalletReady) {
      setShowAuthModal(true);
      return;
    }
    
    if (!bidAmount || parseFloat(bidAmount) <= currentHighestBid) {
      setErrorMessage(`Your bid must be higher than the current highest bid of ${currentHighestBid.toFixed(4)} ETH.`);
      setBidStatus('error');
      return;
    }
    
    // Show hammer animation
    setShowHammerAnimation(true);
    
    // Process bid after a short delay for animation
    setTimeout(async () => {
      setIsBidding(true);
      setErrorMessage(null);
      
      try {
        // Use our simplified bid function
        const success = await placeBid(parseFloat(bidAmount));
        
        if (success) {
          setBidStatus('success');
        } else {
          setBidStatus('error');
          if (!errorMessage) {
            setErrorMessage('Bid placement failed. Please try again.');
          }
        }
      } catch (error: any) {
        setBidStatus('error');
        setErrorMessage(error.message || 'An unexpected error occurred');
      }
      
      setIsBidding(false);
      
      // Hide animation after a delay
      setTimeout(() => {
        setShowHammerAnimation(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-500 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden">
        {/* Hammer Animation */}
        {showHammerAnimation && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative">
              <Hammer 
                size={120} 
                className="text-amber-500 animate-hammer-fall"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.5))",
                }}
              />
              <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-500/50 rounded-full animate-hammer-impact"></div>
              <span className="absolute top-[120%] left-1/2 transform -translate-x-1/2 text-3xl font-bold text-amber-500 animate-bid-text">BID PLACED!</span>
            </div>
          </div>
        )}
        
        {/* Winner Animation */}
        {showWinnerAnimation && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="relative animate-bounce-slow">
              <Trophy 
                size={140} 
                className="text-yellow-500"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(234, 179, 8, 0.8))",
                }}
              />
            </div>
            <h2 className="mt-8 text-4xl font-bold text-yellow-500 animate-winner-text">
              YOU WON THE AUCTION!
            </h2>
            
            {/* Transaction Processing Section */}
            <div className="mt-6 w-full max-w-md">
              {transactionStatus === 'idle' && !isWalletReady && (
                <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2" /> Wallet Authorization Required
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    To complete your purchase on the Story Protocol, please authorize your wallet for instant payment.
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium flex items-center justify-center w-full"
                  >
                    <Key className="w-4 h-4 mr-2" /> Authorize Wallet
                  </button>
                </div>
              )}
              
              {transactionStatus === 'payment' && (
                <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                      Processing Payment
                    </h3>
                    <div className="animate-spin h-5 w-5 text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Processing payment of {currentHighestBid.toFixed(4)} ETH through Story Protocol...
                  </p>
                </div>
              )}
              
              {transactionStatus === 'registration' && (
                <div className="bg-indigo-500/20 border border-indigo-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
                      Registering IP Asset
                    </h3>
                    <div className="animate-spin h-5 w-5 text-indigo-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Registering {agent.name} as an IP asset on the Story Protocol...
                  </p>
                </div>
              )}
              
              {transactionStatus === 'complete' && (
                <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-green-400 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" /> Transaction Complete
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    Successfully registered {agent.name} as an IP asset on the Story Protocol!
                  </p>
                  {transactionHash && (
                    <div className="bg-gray-700/50 rounded p-2 text-xs font-mono text-gray-300 break-all">
                      Transaction: {transactionHash}
                    </div>
                  )}
                  {ipId && (
                    <div className="mt-2 bg-gray-700/50 rounded p-2 text-xs font-mono text-gray-300 break-all">
                      IP Asset ID: {ipId}
                    </div>
                  )}
                </div>
              )}
              
              {transactionStatus === 'error' && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-red-400 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" /> Transaction Failed
                    </h3>
                  </div>
                  <p className="text-sm text-red-300 mb-2">
                    {transactionError || "An error occurred while processing your transaction."}
                  </p>
                  <button
                    onClick={processWinningTransaction}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium flex items-center justify-center w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Retry Transaction
                  </button>
                </div>
              )}
            </div>
            
            <p className="mt-4 text-xl text-white">
              Congratulations! This NFT is now yours!
            </p>
            <div className="mt-8 flex space-x-4">
              <button 
                onClick={onBack} 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold text-white flex items-center"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
              </button>
              <button 
                onClick={restartAuction} 
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white flex items-center"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> Restart Demo Auction
              </button>
            </div>
          </div>
        )}

        {/* Auction Ended Display */}
        {auctionEnded && !showWinnerAnimation && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-4">
              Auction Has Ended!
            </h2>
            {auctionData?.highest_bidder ? (
              <p className="text-xl text-gray-300 mb-6">
                Winner: {auctionData.highest_bidder.substring(0, 6)}...{auctionData.highest_bidder.substring(auctionData.highest_bidder.length - 4)}
              </p>
            ) : (
              <p className="text-xl text-gray-300 mb-6">
                No bids were placed
              </p>
            )}
            <p className="text-2xl font-semibold text-green-500 mb-8">
              Final Price: {auctionData?.highest_bid.toFixed(4) || '0'} ETH
            </p>
            <button 
              onClick={restartAuction} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white flex items-center"
            >
              <RotateCcw className="mr-2 h-5 w-5" /> Restart Demo Auction
            </button>
          </div>
        )}

        {/* Header with Back Button */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Auctions
          </button>
          <h2 className="text-2xl font-bold text-white">Bid on {agent.name}</h2>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {/* Left Column: Agent Info & Try Area */}
          <div className="flex flex-col space-y-6">
            <div className="relative aspect-square w-full max-w-sm mx-auto bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                {agent.category}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Try the agent before bidding?</h3>
              <div className="h-40 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">
                A space to try the AI agent a person is going to bid for
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Interface */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <div className="flex items-center space-x-1 text-cyan-400">
                    <Clock className="h-4 w-4" />
                    <span className={timeLeft <= 10 && timeLeft > 0 ? 'animate-pulse font-bold text-red-500' : ''}>
                      {timeRemaining}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => refreshAuction()}
                      className="text-gray-400 hover:text-white"
                      title="Refresh auction data"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    {auctionEnded && (
                      <button
                        onClick={restartAuction}
                        className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                        title="Restart auction"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" /> Restart
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-gray-500">
                    {auctionEnded ? 'Auction has ended' : 'Auction in progress'}
                  </p>
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      isLoading ? 'bg-yellow-500' : 
                      auctionEnded ? 'bg-red-500' : 
                      'bg-green-500'
                    }`}></div>
                    <span className="text-gray-400">
                      {isLoading ? 'Loading...' : 
                       auctionEnded ? 'Ended' : 
                       'Active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400">Current Highest Bid</p>
                <p className="text-4xl font-bold text-white">{currentHighestBid.toFixed(4)} ETH</p>
                {auctionData?.highest_bidder && (
                  <p className={`text-xs ${isWinner ? 'text-green-400 font-semibold' : 'text-gray-400'}`}>
                    Current highest bidder: 
                    {isWinner ? ' You!' : 
                      ` ${auctionData.highest_bidder.substring(0, 6)}...${auctionData.highest_bidder.substring(auctionData.highest_bidder.length - 4)}`
                    }
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="bidAmount" className="block text-sm font-semibold text-gray-300 mb-1">
                  SET YOUR MAX BID <Info size={12} className="inline text-gray-400"/>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                      setBidStatus('idle');
                      setErrorMessage(null);
                    }}
                    placeholder={`> ${currentHighestBid} ETH`}
                    className="w-full pl-3 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                    min={(currentHighestBid + 0.00000001).toString()} // Small increment for min value
                    step="0.01"
                    disabled={isBidding || bidStatus === 'success'}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">ETH</span>
                </div>
                {address && (
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${isWalletReady ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-xs text-gray-400">
                        {isWalletReady ? 
                          'Wallet authorized for instant payment' : 
                          'Wallet not authorized for Story Protocol'}
                      </span>
                    </div>
                    {!isWalletReady && (
                      <button 
                        onClick={() => setShowAuthModal(true)}
                        className="text-xs text-cyan-400 hover:underline flex items-center"
                      >
                        <Shield className="w-3 h-3 mr-1" /> Authorize
                      </button>
                    )}
                  </div>
                )}
              </div>

              {bidStatus === 'error' && errorMessage && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center">
                  <XCircle size={18} className="mr-2" /> {errorMessage}
                </div>
              )}

              {bidStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm flex items-center">
                  <CheckCircle size={18} className="mr-2" /> Bid placed successfully!
                </div>
              )}
            </div>

            <div className="mt-auto">
              <button
                onClick={handlePlaceBid}
                disabled={isBidding || bidStatus === 'success' || !bidAmount || auctionEnded}
                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold text-white hover:from-red-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                {isBidding ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Bid...
                  </>
                ) : bidStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} className="mr-2" /> Bid Placed!
                  </>
                ) : (
                  <>
                    <Hammer size={20} className="mr-2" /> Place Bid
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">Get approved to bid. <a href="#" className="text-cyan-400 hover:underline">Register for Auction</a></p>
            </div>
          </div>
        </div>

        {/* Blockchain Details Section */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">NFT Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Contract:</span>
              <span className="text-cyan-400 font-mono">
                {agent.blockchain?.contractAddress ? 
                  `${agent.blockchain.contractAddress.substring(0, 6)}...${agent.blockchain.contractAddress.substring(agent.blockchain.contractAddress.length - 4)}` : 
                  "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Token ID:</span>
              <span className="text-cyan-400 font-mono">{agent.blockchain?.tokenId || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Minted:</span>
              <span className="text-gray-300">
                {agent.blockchain?.mintedAt ? 
                  new Date(agent.blockchain.mintedAt).toLocaleDateString() : 
                  "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Authentication Modal */}
        {showAuthModal && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="bg-gray-800 p-6 rounded-xl border border-purple-500 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-400" />
                  Authorize Wallet
                </h3>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle size={20} />
                </button>
              </div>
              
              <p className="text-gray-300 mb-4">
                To complete transactions on the Story Protocol, we need your authorization. 
                This enables instant payment and IP registration after winning an auction.
              </p>
              
              <div className="mb-4">
                <label htmlFor="privateKey" className="block text-sm font-medium text-gray-300 mb-1">
                  <div className="flex items-center">
                    <Key className="w-4 h-4 mr-1 text-yellow-400" />
                    Private Key
                    <span className="ml-1 text-xs text-gray-400">(never shared or stored)</span>
                  </div>
                </label>
                <input
                  type="password"
                  id="privateKey"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Enter your wallet's private key"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="mt-1 text-xs text-gray-400">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  In a production app, this would use a secure wallet connection instead of handling private keys directly.
                </p>
              </div>
              
              {authStatus === 'error' && authError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center">
                  <XCircle size={16} className="mr-2" /> {authError}
                </div>
              )}
              
              {authStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm flex items-center">
                  <CheckCircle size={16} className="mr-2" /> Wallet authorized successfully!
                </div>
              )}
              
              <button
                onClick={handleAuthorizeWallet}
                disabled={isAuthenticating || !privateKey || authStatus === 'success'}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAuthenticating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authorizing...
                  </>
                ) : authStatus === 'success' ? (
                  <>
                    <CheckCircle size={16} className="mr-2" /> Authorized
                  </>
                ) : (
                  <>
                    <Shield size={16} className="mr-2" /> Authorize Wallet
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}