# Prove You're Human - Self Protocol Demo

A simple, no-blockchain template for demonstrating Self protocol passport verification. Perfect for hackathons, workshops, and getting started with Self!

## 🎯 What This Does

- **Verify humanity** using passport verification (no blockchain required!)
- **Zero complexity** - just frontend + backend API
- **5-minute setup** - clone, install, scan QR code
- **Perfect for demos** - works with mock passports

## ⚡ Quick Start (5 minutes)

### 1. Clone and Install
```bash
git clone <this-repo>
cd prove-human

# Install frontend
cd frontend && yarn install

# Install backend
cd ../backend && yarn install
```

### 2. Start Both Services
```bash
# Terminal 1: Start backend
cd backend && yarn dev
# Backend runs on http://localhost:3001

# Terminal 2: Start frontend
cd frontend && yarn dev
# Frontend runs on http://localhost:3000
```

### 3. Set Up ngrok (Required for Self)
```bash
# Terminal 3: Create HTTPS tunnel
ngrok http 3001
# Copy the HTTPS URL (e.g., https://abc123.ngrok.app)
```

### 4. Update Frontend Configuration
Edit `frontend/app/page.tsx` and replace the ngrok URL:
```javascript
endpoint: "https://your-ngrok-url.ngrok.app/api/verify"
```

### 5. Test It!
1. Open http://localhost:3000
2. Scan QR code with Self mobile app
3. Complete passport verification
4. See "✅ Verified Human!" message

## 📱 Self Mobile App Setup

### For Testing (Mock Passports)
1. Download Self app from app store
2. Create mock passport in app
3. Use any details (name, nationality, etc.)
4. Scan QR code to verify

### For Production (Real Passports)
1. Scan your real passport with Self app
2. Update backend to use production mode
3. Change `mockPassport: true` to `false` in backend

## 🏗️ Architecture

### Frontend (Next.js)
- **QR Code Display**: Uses `@selfxyz/qrcode` package
- **User Interface**: Beautiful verification flow with success/error states
- **No Blockchain**: Pure web app, no wallet connections needed

### Backend (Express.js)
- **Proof Verification**: Uses `@selfxyz/core` SelfBackendVerifier
- **API Endpoint**: Self backend calls `/api/verify` to validate proofs
- **No Smart Contracts**: Verification happens off-chain

### Self Protocol Integration
- **Frontend**: Generates QR codes with verification requests
- **Self App**: User scans passport and QR code
- **Backend**: Receives and verifies cryptographic proofs
- **Result**: Confirmed human verification

## 🔧 Configuration

### Frontend Configuration (`frontend/app/page.tsx`)
```javascript
const selfApp = new SelfAppBuilder({
  appName: "Prove You're Human",
  scope: "prove-human-demo",           // Unique app identifier
  endpoint: "https://your-ngrok.ngrok.app/api/verify",
  endpointType: "https",               // Backend API mode
  userId: uuidv4(),                    // Unique user ID
  userIdType: "uuid",                  // ID type
  disclosures: {                       // What data to request
    issuing_state: true,
    name: true,
    nationality: true,
  },
  devMode: true,                       // Development mode
}).build();
```

### Backend Configuration (`backend/src/index.ts`)
```javascript
const selfBackendVerifier = new SelfBackendVerifier(
  'prove-human-demo',    // Same scope as frontend
  verifyEndpoint,        // This backend's verify endpoint
  'uuid',                // User ID type
  true                   // true = mock passports, false = real passports
);
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
1. Deploy frontend to your hosting platform
2. Set environment variables for production API URL
3. Update CORS settings in backend

### Backend (Railway/Render/AWS)
1. Deploy backend to your hosting platform
2. Set `NODE_ENV=production`
3. Update frontend with production backend URL
4. Configure CORS for your frontend domain

### Real Passport Mode
Change backend configuration:
```javascript
const selfBackendVerifier = new SelfBackendVerifier(
  'your-production-scope',
  'https://your-backend.com/api/verify',
  'uuid',
  false  // Use real passports
);
```

## 🔍 API Reference

### POST /api/verify
Verifies Self protocol proofs and returns verification result.

**Request Body:**
```json
{
  "proof": { ... },        // Cryptographic proof from Self app
  "publicSignals": [ ... ] // Public verification data
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "result": true,
  "message": "Human verification successful",
  "data": {
    "userId": "uuid-here",
    "verifiedAt": "2025-06-13T...",
    "nationality": "USA",
    "name": "John Doe",
    "issuingState": "US"
  }
}
```

**Error Response (400/500):**
```json
{
  "status": "error",
  "result": false,
  "message": "Human verification failed",
  "details": { ... }
}
```

## 🛠️ Development

### Project Structure
```
prove-human/
├── frontend/           # Next.js app
│   ├── app/           # Pages and components
│   ├── package.json   # Frontend dependencies
│   └── ...
├── backend/           # Express.js API
│   ├── src/          # TypeScript source
│   ├── package.json  # Backend dependencies
│   └── ...
└── README.md         # This file
```

### Key Dependencies
- **Frontend**: `@selfxyz/qrcode`, `next`, `react`, `uuid`
- **Backend**: `@selfxyz/core`, `express`, `cors`, `helmet`

### Development Commands
```bash
# Frontend
yarn dev      # Start development server
yarn build    # Build for production
yarn lint     # Run ESLint

# Backend
yarn dev      # Start with hot reload
yarn build    # Compile TypeScript
yarn start    # Run production build
```

## 🎮 Workshop Ideas

This template is perfect for:

- **Hackathon kickstarts** - Get Self integration running in 5 minutes
- **Anti-bot systems** - Verify real humans for your platform
- **Identity workshops** - Teach zero-knowledge proofs and privacy
- **Community gating** - Humans-only Discord/Telegram bots
- **Age verification** - Prove 18+ without revealing exact age
- **Nationality checks** - Country-based access control

## 🔐 Security Notes

- **Development Only**: This template uses mock passports and development settings
- **Production**: Switch to real passport mode and proper environment configuration
- **Private Data**: Self protocol ensures passport data stays private and secure
- **No Blockchain**: No gas fees, private keys, or wallet management required

## 🆘 Troubleshooting

### Common Issues

**1. "Endpoint not accessible" error**
- ✅ Make sure ngrok is running on the backend port (3001)
- ✅ Update frontend with correct ngrok HTTPS URL
- ✅ Backend should be accessible via ngrok URL

**2. "CORS error" in browser**
- ✅ Check CORS configuration in backend
- ✅ Make sure frontend origin is allowed
- ✅ Verify FRONTEND_URL environment variable

**3. "Verification failed" message**
- ✅ Check backend logs for detailed error messages
- ✅ Ensure scope matches between frontend and backend
- ✅ Verify mock passport mode is enabled for testing

**4. "QR code not working"**
- ✅ Make sure Self mobile app is installed
- ✅ Check that ngrok URL is HTTPS (not HTTP)
- ✅ Verify QR code is displaying correctly

### Debug Mode
Enable detailed logging:
```bash
# Backend terminal
DEBUG=* yarn dev

# Check browser console for frontend errors
# Check terminal for backend logs
```

## 📚 Next Steps

### Extend This Template

1. **Add Database**: Store verification results
2. **Add Authentication**: User accounts and sessions
3. **Add Features**: Age verification, nationality filtering
4. **Add UI**: Better design, animations, branding
5. **Add Analytics**: Track verification success rates

### Move to Blockchain

Ready for on-chain verification? Check out:
- [Self Contracts Documentation](https://docs.self.xyz/contract-integration)
- [Birthday Example](https://github.com/selfxyz/happy-birthday) - Full smart contract integration
- [Airdrop Example](https://docs.self.xyz/contract-integration/airdrop-example)

## 🤝 Contributing

Found a bug or want to improve this template?

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use this template for your projects!

## 🔗 Resources

- [Self Protocol Website](https://self.xyz)
- [Self Documentation](https://docs.self.xyz)
- [Self SDK Reference](https://docs.self.xyz/sdk-reference)
- [Self Mobile App](https://apps.apple.com/app/self/id6448697253)

---

**Built with ❤️ using Self Protocol**
