# IDRA - Identity & Capsule Management

A Web3-powered identity and capsule management system with encrypted storage, guardian recovery, and zero-knowledge proofs.

## Features

- **Web3 Integration**: Connect wallets with wagmi and sign in with Ethereum (SIWE)
- **Encrypted Capsules**: Store sensitive data in AES-256 encrypted capsules
- **Guardian Recovery**: Set up trusted guardians for account recovery
- **Access Control**: Request and approve access to capsules
- **Face Enrollment**: Biometric identity verification
- **Admin Dashboard**: System monitoring and user management
- **Dark Mode**: Full dark mode support with theme switching

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Web3**: wagmi, viem, SIWE
- **State Management**: React Query, Zustand
- **Authentication**: SIWE (Sign-In with Ethereum)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Add your WalletConnect Project ID:
   \`\`\`
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── dashboard/              # User dashboard
├── capsules/               # Capsule management
├── requests/               # Access requests
├── recovery/               # Account recovery
├── admin/                  # Admin dashboard
└── api/                    # API routes

components/
├── header.tsx              # Navigation header
├── web3/                   # Web3 components
├── onboarding/             # Onboarding flow
├── capsules/               # Capsule components
├── requests/               # Request components
├── recovery/               # Recovery components
├── admin/                  # Admin components
└── ui/                     # shadcn/ui components

lib/
├── web3-config.ts          # wagmi configuration
├── siwe-config.ts          # SIWE configuration
├── theme-provider.tsx      # Theme context
└── utils.ts                # Utility functions

hooks/
└── use-siwe-auth.ts        # SIWE authentication hook
\`\`\`

## Key Features

### 1. Web3 Authentication

Users connect their wallets and sign in with Ethereum. The SIWE flow includes:
- Nonce generation for security
- Message signing with wallet
- Server-side signature verification
- Session management with cookies

### 2. Capsule Management

Users can create encrypted capsules to store sensitive data:
- Create and manage multiple capsules
- Upload files with drag-and-drop
- AES-256 encryption
- File management and deletion

### 3. Access Control

Fine-grained access control for capsules:
- Request access to other users' capsules
- Approve or reject access requests
- Set expiration dates for access
- Revoke access at any time

### 4. Guardian Recovery

Multi-signature recovery system:
- Set up trusted guardians
- Initiate recovery with identity verification
- Guardians approve recovery requests
- Automatic account recovery after threshold met

### 5. Admin Dashboard

System administration and monitoring:
- User management
- Security audit logs
- System health metrics
- Real-time performance monitoring

## API Routes

### Authentication
- `POST /api/auth/nonce` - Generate nonce for SIWE
- `POST /api/auth/verify` - Verify SIWE signature
- `POST /api/auth/logout` - Clear session

### Access Requests
- `GET /api/requests` - Get user's access requests
- `POST /api/requests` - Create new access request
- `PATCH /api/requests/[id]` - Update request status

## Animations

The app includes smooth animations for better UX:
- Fade in animations for page loads
- Slide up animations for modals
- Pulse glow effects for active states
- Shimmer effects for loading states

## Testing

Run tests with:
\`\`\`bash
npm run test
\`\`\`

Test utilities are available in `lib/test-utils.ts` with pre-configured providers.

## Security Considerations

- All capsules are encrypted with AES-256
- SIWE prevents phishing attacks
- Nonces prevent replay attacks
- Session cookies are httpOnly and secure
- Row-level security for database access
- Guardian multi-sig for recovery

## Environment Variables

\`\`\`
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
\`\`\`

## Deployment

Deploy to Vercel:
\`\`\`bash
npm run build
vercel deploy
\`\`\`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For support, open an issue on GitHub or contact support@idra.app
