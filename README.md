# Etherian Chronicle

_A community-governed fantasy saga where readers don't just follow the story — they **shape** it, vote by vote, chapter by chapter, on-chain._

---

## Overview

**Etherian Chronicle** is a decentralized, collaborative storytelling platform that transforms readers into co-authors. Powered by **on-chain voting**, **dynamic NFT rewards**, and the blazing speed of **Etherlink**, it allows users to vote in real time on key narrative decisions — and see the next chapter unfold _instantly_ based on collective consensus.

Forget passive reading. Every chapter is a cliffhanger. Every vote is a turning point. And every decision is recorded immutably on-chain.

---

## Features

- Real-time on-chain voting on chapter decisions
- Chapter-by-chapter story progression driven by community consensus
- Story proposal & approval system
- IPFS storage for story content
- Instant wallet connection using thirdweb
- Dynamic UI with live vote counts
- NFT Rewards System:

---

## How It Works

1. **Connect Wallet**  
   Log in using your Web3 wallet.

2. **Create or Approve a Story**  
   Writers submit a proposal. The community votes to approve it.

3. **Vote on Chapter Outcomes**  
   Each chapter ends with a narrative choice. Readers vote on what happens next.

4. **Resolve Chapter**  
   The option with the highest votes is locked in. The next chapter is written based on that choice.

5. **Earn NFTs**
   - After each chapter vote, 10 random voters (who voted for the winning option) receive a unique **Chapter Relic NFT**.
   - At story completion, the user with the most correct predictions earns a **Chronicle Champion NFT**.

---

## Tech Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Frontend        | TypeScript, Tailwind CSS  |
| Web3 Auth       | thirdweb SDK              |
| Smart Contracts | Solidity (Etherlink)      |
| Blockchain      | Etherlink (low-fee, fast) |
| Storage         | IPFS via Pinata           |
| Randomness      | Pseudo-random (MVP)       |

---

## Live Demo

- 🌐 [https://etherian-chronicles.vercel.app/](https://etherian-chronicles.vercel.app/)

---

## Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo-link-here
cd etherian-chronicle
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env.local` in the root of the project and paste the following values:

```env
VITE_THIRDWEB_CLIENT_ID=517007e6ba4b15eaaad1074860c4c1f0
VITE_PINATA_GATEWAY=black-harsh-ant-656.mypinata.cloud
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Compile & Deploy Contracts (Optional)

```bash
npx hardhat compile
npx hardhat deploy --network etherlink
```

---

## Smart Contracts

- Contracts handle:

  - Proposal voting
  - Chapter outcome voting
  - NFT minting

- Written in **Solidity**, deployed on **Etherlink**
- Interaction handled via **thirdweb SDK**

---

## License

This project is licensed under the [MIT License](./LICENSE).

—

## Inspiration

> We're not just building a reading platform.
> We're building a **living, breathing story** — shaped by the community, protected by the blockchain, and brought to life one vote at a time.

---

## Post-Hackathon Roadmap

- Launch DAO-style governance for writers/contributors
- Add visual generative art to NFTs based on story outcome
- 🔗 Integrate Chainlink VRF for provable randomness
