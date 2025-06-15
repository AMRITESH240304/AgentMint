# AgentMint - AI Agent NFT Marketplace

AgentMint is a decentralized platform for registering, trading, and auctioning AI agents as NFTs on the Story Protocol blockchain. The platform enables AI developers to monetize their agents, while allowing users to discover, purchase, and utilize AI agents for various purposes.

## Features

- **Agent Registration**: Register AI agents with detailed metadata as NFTs on the Story Protocol blockchain
- **NFT Gallery**: Browse and discover AI agents in a searchable gallery with filtering options
- **Auctions**: Participate in time-based auctions for AI agent NFTs with real-time bidding
- **Marketplace**: Buy and sell AI agents directly with cryptocurrency
- **Rentals**: Rent AI agent capabilities for specific time periods without full ownership
- **Royalty Streams**: Configure royalty percentages to earn passive income on secondary sales

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, Lucide React
- **Web3**: Wagmi, RainbowKit, Viem
- **Storage**: IPFS via Pinata
- **Blockchain**: Story Protocol for NFT minting and IP registration
- **API**: RESTful API for auction functionality and wallet-to-NFT mappings

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask or another web3 wallet
- Story Protocol testnet account

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/agent-mint.git
cd agent-mint
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
VITE_PINATA_JWT=your_pinata_jwt_token
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Connect Wallet**: Use the connect wallet button to link your MetaMask or other web3 wallet
2. **Register an Agent**: Navigate to the Registration page to mint your AI agent as an NFT
3. **Explore Gallery**: Browse the gallery to discover AI agents created by others
4. **Join Auctions**: Participate in auctions to bid on AI agents
5. **Buy/Sell/Rent**: Use the marketplace to buy, sell, or rent AI agents

## Smart Contract Architecture

The platform interacts with Story Protocol's smart contracts for:

- IP asset registration and minting
- Ownership transfers
- Royalty configuration
- License management

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Story Protocol for the blockchain infrastructure
- RainbowKit for the wallet connection UI
- Tailwind CSS for the styling framework
