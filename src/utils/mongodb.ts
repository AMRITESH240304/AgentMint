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

export async function fetchMappings(): Promise<{ mappings: Array<{ wallet_address: string, nft_id: string }> }> {
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
