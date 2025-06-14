import { useState, useEffect, useCallback } from 'react';

// Simple auction data structure
export interface AuctionData {
  nft_id: string;
  highest_bid: number;
  highest_bidder: string | null;
  end_time?: string;
  time_left_seconds?: number;
  status?: 'active' | 'ended';
  winner?: string;
}

// A simplified auction hook that uses HTTP only for reliability
export function useAuctionHttp(nftId: string, userWalletAddress: string | undefined) {
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bidSuccessful, setBidSuccessful] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second timer
  const [auctionEnded, setAuctionEnded] = useState(false);

  // Function to fetch auction data
  const fetchAuctionData = useCallback(async () => {
    if (!nftId) return null;
    
    setIsLoading(true);
    try {
      console.log(`Fetching auction data for NFT ${nftId} via HTTP`);
      const response = await fetch(`https://agent-mint-back.onrender.com/auction/${nftId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch auction data');
      }
      
      const data = await response.json();
      console.log('Received auction data via HTTP:', data);
      
      // Extract just the data we need
      const simplifiedData: AuctionData = {
        nft_id: data.nft_id,
        highest_bid: data.highest_bid || 0,
        highest_bidder: data.highest_bidder,
        status: data.status || 'active',
        time_left_seconds: timeLeft, // Use our local timer
        winner: data.highest_bidder // Current highest bidder is potential winner
      };
      
      // Check if user is the highest bidder
      if (userWalletAddress && simplifiedData.highest_bidder === userWalletAddress) {
        setIsWinner(true);
      } else {
        setIsWinner(false);
      }
      
      setAuctionData(simplifiedData);
      setError(null);
      return simplifiedData;
    } catch (err) {
      console.error('Error fetching auction data:', err);
      setError('Failed to load auction data. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [nftId, userWalletAddress, timeLeft]);

  // Countdown timer logic
  useEffect(() => {
    if (auctionEnded) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setAuctionEnded(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [auctionEnded]);
  
  // Update auction data when timer changes
  useEffect(() => {
    if (auctionData) {
      setAuctionData(prev => prev ? {
        ...prev,
        time_left_seconds: timeLeft,
        status: timeLeft > 0 ? 'active' : 'ended'
      } : null);
    }
  }, [timeLeft]);

  // Load auction data on initial render
  useEffect(() => {
    fetchAuctionData();
    
    // Set up polling to refresh data every 5 seconds
    const intervalId = setInterval(() => {
      fetchAuctionData();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [fetchAuctionData]);

  // Function to place a bid via HTTP
  const placeBid = useCallback(async (amount: number): Promise<boolean> => {
    if (!userWalletAddress) {
      setError('Please connect your wallet first');
      return false;
    }
    
    if (!nftId) {
      setError('Invalid NFT ID');
      return false;
    }
    
    setIsLoading(true);
    setBidSuccessful(false);
    
    try {
      console.log(`Placing bid: ${amount} ETH for NFT ${nftId}`);
      
      const bidData = {
        nftId: nftId,
        bidderWallet: userWalletAddress,
        amount: amount,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch('https://agent-mint-back.onrender.com/place-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.detail || 'Failed to place bid');
        return false;
      }
      
      console.log('Bid placed successfully:', data);
      setError(null);
      setBidSuccessful(true);
      
      // Reset timer on successful bid - if you want to extend time when someone bids
      if (timeLeft < 10) {
        setTimeLeft(10); // Give at least 10 seconds after a bid
      }
      
      // Refresh auction data to show the new bid
      await fetchAuctionData();
      
      // The bidder is now the highest - potential winner
      setIsWinner(true);
      
      return true;
    } catch (err) {
      console.error('Error placing bid:', err);
      setError('Failed to place bid. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [nftId, userWalletAddress, fetchAuctionData, timeLeft]);

  // Restart the auction timer (for demo purposes)
  const restartAuction = useCallback(() => {
    setTimeLeft(30);
    setAuctionEnded(false);
    setIsWinner(false);
    setBidSuccessful(false);
    fetchAuctionData();
  }, [fetchAuctionData]);

  return {
    auctionData,
    error,
    isLoading,
    bidSuccessful,
    isWinner,
    timeLeft,
    auctionEnded,
    placeBid,
    refreshAuction: fetchAuctionData,
    restartAuction
  };
}

// Helper function to format remaining time
export function formatTimeLeft(seconds: number): string {
  if (seconds <= 0) return 'Auction ended';
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s remaining`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s remaining`;
  } else {
    return `${remainingSeconds}s remaining`;
  }
}
