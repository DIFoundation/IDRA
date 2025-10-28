// Web3 utilities and SIWE helpers
export const web3 = {
  connectWallet: async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        return accounts[0]
      } catch (error) {
        console.error("Wallet connection failed:", error)
        return null
      }
    }
    return null
  },

  getConnectedWallet: async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        return accounts[0] || null
      } catch (error) {
        return null
      }
    }
    return null
  },

  signMessage: async (message: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, accounts[0]],
        })
        return signature
      } catch (error) {
        console.error("Message signing failed:", error)
        return null
      }
    }
    return null
  },
}
