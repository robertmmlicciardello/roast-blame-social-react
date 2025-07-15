
# RoastBlame - Local Development Setup

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Development Environment**
   ```bash
   npm run setup
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Navigate to: http://localhost:5173

## Environment Configuration

### Option 1: Mock Data (Default)
The application works out-of-the-box with mock data. No additional configuration needed.

### Option 2: Firebase Integration
1. Copy `.env.example` to `.env`
2. Update the Firebase configuration variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

## Features Available in Development

### ✅ Core Features (Always Available)
- User authentication (mock/Firebase)
- Post creation and management
- Reactions and comments
- Admin panel
- Responsive design

### ✅ Crypto Features
- Premium subscriptions with crypto payments
- Creator tipping (requires MetaMask)
- NFT minting for exclusive content
- Wallet connection and management

### 🔧 Development Tools
- Error boundaries for graceful error handling
- Mock data for offline development
- TypeScript support
- Hot module replacement
- Automatic environment setup

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   npm run type-check
   npm run lint
   ```

2. **Environment Issues**
   ```bash
   npm run check-env
   ```

3. **Crypto Features Not Working**
   - Install MetaMask browser extension
   - Ensure you're on a supported network
   - Check browser console for Web3 errors

4. **Firebase Connection Issues**
   - Verify `.env` configuration
   - Check Firebase project settings
   - Ensure Firebase services are enabled

### Development Scripts

- `npm run dev` - Start development server with setup
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run setup` - Setup development environment
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── crypto/         # Crypto-related components
│   ├── auth/           # Authentication components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | No* |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | No* |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | No* |
| `VITE_USE_MOCK_DATA` | Enable mock data mode | No |
| `VITE_ENABLE_CRYPTO_FEATURES` | Enable crypto features | No |

*Not required for mock data mode

## Next Steps

1. **Production Deployment**: See `DEPLOYMENT.md`
2. **Customization**: See `CUSTOMIZATION.md`
3. **Firebase Setup**: See `INSTALLATION.md`

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your environment setup
3. Ensure all dependencies are installed
4. Try clearing browser cache and localStorage
