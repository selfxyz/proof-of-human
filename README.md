# Proof of Human - On-Chain Identity Verification

A demonstration application showcasing on-chain human verification using Self Protocol on Celo blockchain. This implementation allows users to prove their humanity through passport verification with zero-knowledge proofs, storing the verification status on-chain.

## 🌟 Features

- **On-Chain Verification**: All verifications are stored on the Celo blockchain
- **Zero-Knowledge Proofs**: Verify identity without revealing sensitive information
- **Wallet Integration**: Connect with MetaMask or other Web3 wallets
- **Mock/Real Passport Support**: Toggle between test and production modes
- **Privacy-Preserving**: Only disclose what's necessary (nationality, age, etc.)

## 🏗 Architecture

### Smart Contract
- **Contract Name**: ProofOfHuman
- **Network**: Celo Alfajores Testnet
- **Contract Address**: `0x659B19b52D21762bBf955BE138aaBa84fa78f347`
- **Explorer**: [View on Celoscan](https://alfajores.celoscan.io/address/0x659B19b52D21762bBf955BE138aaBa84fa78f347#code)

### Self Protocol Integration
- **Identity Verification Hub**: `0x3e2487a250e2A7b56c7ef5307Fb591Cc8C83623D`
- **Protocol**: Self Protocol V2 Architecture
- **Chain ID**: 44787 (Celo Alfajores)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MetaMask or compatible Web3 wallet
- Self mobile app ([iOS](https://apps.apple.com/app/self/id6448697253) / [Android](https://play.google.com/store/apps/details?id=com.self))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/selfxyz/proof-of-human.git
cd proof-of-human
git checkout on-chain  # Important: Use the on-chain branch
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Smart Contracts (if you want to deploy your own):**
```bash
cd ../contracts
npm install
```

### 3. Environment Setup

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0xE1A05bbee7D8DF2ee2A81dEE8FB22e07B07D1084
NEXT_PUBLIC_IDENTITY_VERIFICATION_HUB_ADDRESS=0x68c931C9a534D37aa78094877F46fE46a49F1A51
NEXT_PUBLIC_PROOF_OF_HUMAN_CONTRACT=0x659B19b52D21762bBf955BE138aaBa84fa78f347
```

To get a WalletConnect Project ID:
1. Visit https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID

### 4. Run the Application

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing Guide

### Step 1: Get Testnet CELO
1. Visit [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
2. Enter your wallet address
3. Request testnet CELO (you'll need this for gas fees)

### Step 2: Connect Your Wallet
1. Click "Connect Wallet" in the app
2. Select MetaMask or your preferred wallet
3. Switch to Celo Alfajores network if prompted
4. Ensure you have testnet CELO balance

### Step 3: Configure Settings
1. Click the gear icon (⚙️) in the header
2. Toggle "Use Mock Passport" ON for testing (OFF for real passports)
3. Close settings

### Step 4: Register Your Identity
First-time users must register their identity on-chain:

1. Click "Register Identity"
2. Scan the QR code with Self app
3. Follow prompts in Self app to scan passport
4. Approve the registration
5. Wait for confirmation

### Step 5: Verify Your Humanity
After registration:

1. Scan the verification QR code with Self app
2. Approve the verification
3. Wait for "Verifying On-Chain..." status
4. Success! Your verification is stored on-chain

### Step 6: Check Your Status
- Refresh the page - your verification persists
- View transaction on [Celoscan](https://alfajores.celoscan.io)
- Check contract state using Read Contract functions

## 🛠 Development

### Smart Contract Deployment

If you want to deploy your own contract:

1. Set up environment:
```bash
cd contracts
cp .env.example .env
# Edit .env with your private key and settings
```

2. Deploy:
```bash
npm run deploy
```

3. Update frontend with new contract address

### Contract Functions

**Read Functions:**
- `isVerifiedHuman(address user)`: Check if address is verified
- `getVerificationDetails(address user)`: Get full verification details
- `verifiedHumans(address)`: Direct mapping access
- `userNationality(address)`: Get user's nationality if disclosed

**Events:**
- `HumanVerified(address indexed user, uint256 timestamp, string nationality)`
- `VerificationAttempted(address indexed user)`

## 🏛 Architecture Details

### Frontend Stack
- **Framework**: Next.js 15.2
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem
- **Wallet UI**: RainbowKit
- **Self Integration**: @selfxyz/qrcode

### Smart Contract Stack
- **Language**: Solidity 0.8.28
- **Framework**: Hardhat
- **Base Contract**: SelfVerificationRoot
- **Verification**: Self Protocol V2

### Verification Flow
1. **Registration**: User creates identity commitment on-chain
2. **QR Generation**: Frontend creates verification request
3. **Self App**: User scans and approves with passport
4. **On-Chain Proof**: Zero-knowledge proof verified by smart contract
5. **Storage**: Verification status stored permanently on-chain

## 🔐 Security Considerations

- All passport data stays on user's device
- Only zero-knowledge proofs are submitted on-chain
- Nullifiers prevent proof reuse
- Contract verified on Celoscan
- No backend required - fully decentralized

## 📚 Resources

- [Self Protocol Documentation](https://docs.self.xyz)
- [Celo Documentation](https://docs.celo.org)
- [Contract on Celoscan](https://alfajores.celoscan.io/address/0x659B19b52D21762bBf955BE138aaBa84fa78f347)
- [Self Mobile App](https://self.xyz)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♀️ Support

- For Self Protocol issues: [Self Discord](https://discord.gg/self)
- For this implementation: [Open an issue](https://github.com/selfxyz/proof-of-human/issues)

## 🎯 Use Cases

This template can be adapted for:
- Sybil-resistant airdrops
- Human-only social platforms
- Age-restricted applications
- Nationality-based services
- KYC-light applications
- DAO membership verification

---

Built with ❤️ using [Self Protocol](https://self.xyz)