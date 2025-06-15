# 🤖 Agent Mint - Decentralized AI Agent Marketplace Powered by Story Protocol

Welcome to **Agent Mint**, the next-gen Web3 platform to **mint, monetize, and manage AI agents** as digital IP assets. Harnessing the power of **Story Protocol**, we enable developers, creators, and collectors to unlock real economic value from autonomous AI agents via **rentals**, **auctions**, and **peer-to-peer licensing**.

> 🌍 Own. 📈 Rent. 🛒 Trade. All on-chain.

---

## 🚀 Key Features

### 🔐 1. On-Chain IP Registration
Each AI agent is uniquely registered as an IP asset on-chain using **Story Protocol’s IPAsset module** — ensuring tamper-proof provenance, attribution, and royalty enforcement.

- Immutable metadata: logic, model type, usage docs
- Publicly verifiable agent origin
- Developer attribution baked into the protocol

### ⏳ 2. Rentable AI Agents (Time-Bound Licensing)
Enable **temporary access** to high-value agents with built-in **usage windows** and **pay-per-period** models.

- Powered by `createCommercialRemixTerms()` from Story SDK
- Custom license terms: 1-day, 7-day, 30-day rentals
- Ideal for limited-time inference, consulting agents, or project-specific tasks

### 🏷️ 3. Buy & Sell (Transferable License Tokens)
Allow users to **purchase full or limited commercial rights** to AI agents.

- Minted via `LicenseModule` from Story Protocol
- License tokens (ERC-721/1155) tradable on secondary markets
- Smart contract-enforced royalty distribution to agent creators

### 🔨 4. On-Chain Auctions for Exclusive AI Agents
Host **time-bound auctions** where users bid for access or exclusive licensing rights.

- Seamlessly integrate auction winners with `mintLicenseToWinner()`
- Creator receives upfront and/or recurring revenue
- Transparent, trustless auction mechanics

### 💸 5. Royalty Automation
Creators earn royalties from every **resale, sub-license, or remix** via **Story Protocol's Royalty Engine**.

- Programmed royalty percentages (e.g., 5–15%)
- Automated royalty split between original creator and remixers
- Enforced directly via the protocol, no middlemen

---

## 🧱 Powered By Story Protocol

| Module | Use Case |
|--------|----------|
| `IPAsset` | Register AI agent as intellectual property |
| `LicenseModule` | Create, distribute, and track agent licenses |
| `CommercialRemixTerms` | Define terms for rentals and remixing |
| `RoyaltyModule` | Automate payout distribution for sales and reuse |
| `LicenseToken` | Transferable on-chain proof of usage rights |

---

## 🛠️ Tech Stack

- **Frontend**: Vite + Tailwind + RainbowKit integrations
- **Blockchain**: Ethereum / Layer 2s (e.g., Base, Optimism)
- **Smart Contracts**: Story Protocol SDK + Custom Auction Contracts
- **Storage**: IPFS + Arweave for agent metadata and model URIs
- **Auth & Payments**: MetaMask + viem for seamless Web3 UX

---

## 📎 Example Use Case

1. Creator mints `GPT-Resume-Writer` as an IP asset.
2. Sets rental at `0.05 ETH / 3 days` via Story License terms.
3. Buyer A rents the agent for 3 days to build CVs.
4. Buyer B enters a 7-day auction for exclusive rights.
5. Creator receives payment + 10% royalty on resale to Buyer C.

> 💥 Code meets commerce. Logic becomes liquidity.


