// Mock API client - replace with real endpoints
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export const api = {
  // Auth
  getSiweChallenge: async () => {
    return { nonce: Math.random().toString(36).substring(7) }
  },

  verifySiwe: async (message: string, signature: string) => {
    return { authenticated: true, token: "mock-token" }
  },

  // Identity
  registerIdentity: async (identity: any) => {
    return { success: true, id: Math.random().toString(36).substring(7) }
  },

  getIdentity: async (wallet: string) => {
    return {
      wallet,
      name: "John Doe",
      contact: "john@example.com",
      country: "US",
      state: "CA",
      guardians: [],
    }
  },

  // Capsules
  uploadCapsule: async (payload: any) => {
    return { payloadCID: `QmMock${Math.random().toString(36).substring(7)}` }
  },

  getCapsules: async (wallet: string) => {
    return [
      {
        id: "1",
        type: "identity",
        payloadCID: "QmMock123",
        attestations: [],
        createdAt: new Date().toISOString(),
      },
    ]
  },

  // Access Requests
  createAccessRequest: async (request: any) => {
    return { id: Math.random().toString(36).substring(7), ...request, status: "pending" }
  },

  getAccessRequests: async (wallet: string) => {
    return [
      {
        id: "1",
        requester: "0x123...",
        scope: ["identity", "contact"],
        duration: 3600,
        status: "pending",
        fraudScore: 0.15,
      },
    ]
  },

  approveAccessRequest: async (requestId: string) => {
    return { success: true }
  },

  // Recovery
  initiateRecovery: async (newWallet: string) => {
    return { recoveryId: Math.random().toString(36).substring(7) }
  },

  approveRecovery: async (recoveryId: string, guardianWallet: string) => {
    return { success: true }
  },
}
