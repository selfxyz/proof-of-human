# On-Chain Implementation Plan for Proof-of-Human

## Overview
Transform the current off-chain proof-of-human demo into a fully on-chain implementation that integrates with Self Protocol's deployed contracts on Celo Alfajores testnet.

## Architecture Changes

### Current Architecture (Off-chain)
```
User → QR Code → Self App → Backend Verification → Result
```

### New Architecture (On-chain)
```
User → Wallet Connect → Register on-chain → QR Code → Self App → On-chain Verification → Result
```

## Implementation Phases

### Phase 1: Wallet Integration
**Goal**: Add Web3 wallet connectivity to the frontend

**Tasks**:
1. Install Web3 dependencies
   - `wagmi` for Web3 React hooks
   - `viem` for Ethereum interactions
   - `@rainbow-me/rainbowkit` for wallet UI
   - Configure for Celo Alfajores network

2. Create wallet connection components
   - Add connect wallet button to UI
   - Show connected address and balance
   - Add network switching to Alfajores
   - Handle wallet disconnection

3. Add testnet CELO helper
   - "Get Testnet CELO" button
   - Link to Alfajores faucet
   - Show user's CELO balance

### Phase 2: Self Protocol Contract Integration
**Goal**: Integrate with Self Protocol's deployed contracts on Alfajores

**Tasks**:
1. Obtain contract addresses and ABIs
   - IdentityVerificationHub address
   - IdentityRegistry address
   - Required verifier contracts
   - Get ABIs from Self Protocol contracts

2. Create contract interaction hooks
   - `useIdentityRegistry` - for registration
   - `useVerificationHub` - for verification
   - Handle transaction states (pending, success, error)

3. Implement registration check
   - Check if wallet is already registered
   - Use localStorage for caching
   - Clear cache on wallet change

### Phase 3: Registration Flow
**Goal**: Implement on-chain identity registration

**Tasks**:
1. Add registration UI components
   - "Register Identity" button (shows when not registered)
   - Registration status indicator
   - Transaction progress modal

2. Implement registration logic
   - Generate QR code for registration proof
   - Handle registration transaction
   - Wait for transaction confirmation
   - Update UI and cache on success

3. Error handling
   - Insufficient funds error
   - Transaction rejection
   - Network errors
   - Already registered handling

### Phase 4: Verification Flow Updates
**Goal**: Update verification to use on-chain proofs

**Tasks**:
1. Modify QR code generation
   - Include on-chain verification parameters
   - Add wallet address to verification request
   - Ensure compatibility with Self app

2. Update backend verification
   - Add on-chain verification endpoint
   - Integrate with Self Protocol's on-chain verifier
   - Return transaction details with result

3. Frontend verification updates
   - Show on-chain verification status
   - Display transaction hash
   - Link to Celoscan for transaction details

### Phase 5: Mock/Real Passport Toggle
**Goal**: Support both mock and real passports

**Tasks**:
1. Add settings UI
   - Toggle switch for mock/real mode
   - Persist preference in localStorage
   - Clear registration when switching modes

2. Update QR code generation
   - Pass mock mode flag to Self app
   - Different disclosure requirements for each mode

3. Backend adjustments
   - Handle both mock and real proof verification
   - Appropriate error messages for each mode

### Phase 6: UI/UX Enhancements
**Goal**: Polish the on-chain experience

**Tasks**:
1. Loading states
   - Wallet connection loading
   - Registration pending UI
   - Verification in progress

2. Success/Error states
   - Transaction success animations
   - Clear error messages
   - Retry mechanisms

3. Educational elements
   - Explain why registration is needed
   - Gas fee explanations
   - Blockchain transaction info

### Phase 7: Testing & Documentation
**Goal**: Ensure reliability and usability

**Tasks**:
1. Testing
   - Test with multiple wallets
   - Test registration flow
   - Test verification flow
   - Test error scenarios

2. Documentation updates
   - Update README with on-chain instructions
   - Add troubleshooting section
   - Include testnet faucet links
   - Contract addresses reference

## Technical Requirements

### Dependencies to Add
```json
{
  "@rainbow-me/rainbowkit": "^2.x",
  "wagmi": "^2.x",
  "viem": "^2.x",
  "@tanstack/react-query": "^5.x"
}
```

### Environment Variables Needed
```
NEXT_PUBLIC_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=<to be obtained>
NEXT_PUBLIC_VERIFICATION_HUB_ADDRESS=<to be obtained>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<for WalletConnect>
```

### Smart Contract Information Needed
1. Contract addresses on Alfajores
2. Contract ABIs
3. Supported verifier types
4. Gas estimation for transactions

## Implementation Order

1. **Day 1**: Wallet Integration (Phase 1)
   - Basic wallet connection
   - Network configuration
   - UI components

2. **Day 2**: Contract Setup (Phase 2) + Registration Flow (Phase 3)
   - Contract integration
   - Registration implementation
   - Caching logic

3. **Day 3**: Verification Updates (Phase 4) + Mock/Real Toggle (Phase 5)
   - On-chain verification
   - Dual mode support
   - Backend updates

4. **Day 4**: Polish & Testing (Phase 6 & 7)
   - UI enhancements
   - Comprehensive testing
   - Documentation

## Questions/Blockers to Resolve

1. **Contract Addresses**: Need Self Protocol's deployed contract addresses on Alfajores
2. **Circuit Types**: Which verification circuits are deployed and available?
3. **Gas Costs**: Estimated gas for registration and verification
4. **Backend Changes**: Scope of backend modifications needed

## Success Criteria

- [ ] Users can connect wallets and switch to Alfajores
- [ ] Users can register their identity on-chain
- [ ] Registration status is properly cached and displayed
- [ ] Users can verify their identity using on-chain proofs
- [ ] Both mock and real passports are supported
- [ ] Clear error handling and user feedback
- [ ] Comprehensive documentation for developers

## Next Steps

1. Obtain Self Protocol contract addresses and ABIs
2. Set up development environment with testnet access
3. Begin Phase 1 implementation
4. Regular testing on Alfajores testnet

---

This plan transforms proof-of-human from a simple off-chain demo into a production-ready on-chain implementation while maintaining ease of use for workshop participants and developers.