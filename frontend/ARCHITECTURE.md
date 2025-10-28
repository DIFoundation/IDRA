# IDRA Architecture

## System Overview

IDRA is a Web3-native identity management system built on Next.js with the following architecture:

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  Pages: Home, Dashboard, Capsules, Requests, Recovery, Admin │
│  Components: Web3, Onboarding, Capsules, Requests, Recovery │
│  Hooks: useSiweAuth, useAccount, useConnect                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Route Handlers)                │
├─────────────────────────────────────────────────────────────┤
│  /api/auth/* - Authentication (SIWE)                        │
│  /api/requests/* - Access request management                │
│  /api/capsules/* - Capsule operations                       │
│  /api/recovery/* - Recovery flow                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (Database)                      │
├─────────────────────────────────────────────────────────────┤
│  Users, Capsules, AccessRequests, GuardianApprovals         │
│  Sessions, AuditLogs                                        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Authentication Flow

### SIWE (Sign-In with Ethereum)

1. User connects wallet via wagmi
2. Frontend requests nonce from `/api/auth/nonce`
3. User signs SIWE message with wallet
4. Frontend sends signature to `/api/auth/verify`
5. Server verifies signature and creates session
6. Session cookie set for authenticated requests

## Capsule Encryption

Capsules use client-side AES-256 encryption:
1. User uploads file
2. File encrypted in browser before upload
3. Encrypted file stored on server
4. Only user can decrypt with their key
5. Access requests require approval before decryption

## Guardian Recovery

Multi-signature recovery process:
1. User initiates recovery with identity verification
2. Recovery request sent to all guardians
3. Guardians receive notification and approve/reject
4. After threshold met (e.g., 2/3), recovery completes
5. User regains access to account and capsules

## Access Control

Fine-grained permission system:
1. User requests access to another's capsule
2. Owner receives access request
3. Owner approves/rejects with optional expiration
4. Approved access logged in audit trail
5. Access can be revoked at any time

## State Management

- **React Query**: Server state (API data)
- **React Context**: Theme, Web3 provider
- **Local State**: Form inputs, UI state
- **Cookies**: Session management

## Security Layers

1. **Client-side**: Encryption before upload
2. **Transport**: HTTPS only
3. **Server**: SIWE verification, session validation
4. **Database**: Row-level security, encrypted fields
5. **Audit**: All actions logged for compliance

## Scalability Considerations

- Stateless API design for horizontal scaling
- Database indexing on frequently queried fields
- Caching layer for read-heavy operations
- CDN for static assets
- Message queue for async operations

## Future Enhancements

- Zero-knowledge proofs for privacy
- IPFS integration for decentralized storage
- Multi-chain support
- DAO governance
- Biometric authentication
- Hardware wallet support
