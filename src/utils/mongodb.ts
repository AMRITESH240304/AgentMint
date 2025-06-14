export async function mapWalletToNft(walletAddress: string, nftId: string): Promise<void> {
  const response = await fetch("https://agent-mint-back.onrender.com/map", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress, nftId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed: ${error.detail}`);
  }

  const result = await response.json();
  console.log("Response from server:", result);
}

export async function startAuction(nftId: string, walletAddress: string): Promise<void> {
  try {
    const response = await fetch("https://agent-mint-back.onrender.com/start-auction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        nftId,
        walletAddress 
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("NFT not found. Please make sure the NFT is registered.");
      } else if (response.status === 400) {
        throw new Error("Auction already started for this NFT.");
      } else if (response.status === 422) {
        throw new Error("Invalid request format. Please check your inputs.");
      } else {
        throw new Error(data.detail || "Failed to start auction");
      }
    }

    console.log("Auction started:", data);
  } catch (error) {
    console.error("Error starting auction:", error);
    throw error;
  }
}

export async function fetchMappings(): Promise<{ mappings: Array<{ wallet_address: string, nft_id: string, auction_started?: boolean, auction_start_time?: string }> }> {
  const response = await fetch("https://agent-mint-back.onrender.com/fetch", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch mappings: ${error.detail}`);
  }

  const result = await response.json();
  return result;
}

export async function placeBid(nftId: string, bidderWallet: string, amount: number): Promise<boolean> {
  try {
    console.log(`Placing bid: ${amount} ETH on NFT ${nftId} from ${bidderWallet}`);
    
    const response = await fetch("http://localhost:8000/place-bid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nftId: nftId,
        bidderWallet: bidderWallet,
        amount: amount,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      console.error(`Bid failed: Status ${response.status}`);
      return false;
    }

    console.log("Bid placed successfully");
    return true;
  } catch (error) {
    console.error("Error placing bid:", error);
    return false;
  }
}

export async function getAuctionDetails(nftId: string): Promise<any> {
  try {
    // Use the FastAPI auction endpoint
    const response = await fetch(`http://localhost:8000/auction/${nftId}`);
    
    if (!response.ok) {
      console.error(`Error fetching auction details: Status ${response.status}`);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching auction details:", error);
    return null;
  }
}
