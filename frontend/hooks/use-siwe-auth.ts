"use client"

import { useAccount, useSignMessage } from "wagmi"
import { useCallback, useEffect, useState } from "react"
import { siweConfig } from "@/lib/siwe-config"

interface SiweMessage {
  domain: string
  address: string
  statement: string
  uri: string
  version: string
  chainId: number
  nonce: string
  issuedAt: string
}

export function useSiweAuth() {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (!address) {
        setIsAuthenticated(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error("[v0] Auth check failed:", err)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [address])

  const signIn = useCallback(async () => {
    if (!address) {
      setError("Wallet not connected")
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get nonce from server
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })

      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce")
      }

      const { nonce } = await nonceResponse.json()

      // Create SIWE message
      const message: SiweMessage = {
        ...siweConfig,
        address,
        nonce,
        issuedAt: new Date().toISOString(),
      }

      const messageString = formatSiweMessage(message)

      // Sign message
      const signature = await signMessageAsync({
        message: messageString,
      })

      // Verify signature on server
      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          message: messageString,
          signature,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Signature verification failed")
      }

      setIsAuthenticated(true)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed"
      setError(errorMessage)
      setIsAuthenticated(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [address, signMessageAsync])

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setIsAuthenticated(false)
    } catch (err) {
      console.error("[v0] Logout failed:", err)
      setIsAuthenticated(false)
    }
  }, [])

  return {
    address,
    isConnected,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
  }
}

function formatSiweMessage(message: SiweMessage): string {
  return `${message.domain} wants you to sign in with your Ethereum account:
${message.address}

${message.statement}

URI: ${message.uri}
Version: ${message.version}
Chain ID: ${message.chainId}
Nonce: ${message.nonce}
Issued At: ${message.issuedAt}`
}
