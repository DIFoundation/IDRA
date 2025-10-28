"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSiweAuth } from "@/hooks/use-siwe-auth"

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isAuthenticated, isLoading, signIn, signOut } = useSiweAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleConnect = async (connector: any) => {
    try {
      connect({ connector })
      setIsOpen(false)
    } catch (err) {
      console.error("[v0] Connection failed:", err)
    }
  }

  const handleSignIn = async () => {
    try {
      const success = await signIn()
      if (success) {
        setIsOpen(false)
      }
    } catch (err) {
      console.error("[v0] Sign in failed:", err)
    }
  }

  const handleDisconnect = async () => {
    try {
      await signOut()
      disconnect()
      setIsOpen(false)
    } catch (err) {
      console.error("[v0] Disconnect failed:", err)
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="gap-2">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span className="sm:hidden">{address.slice(0, 4)}...</span>
            {isAuthenticated && <span className="w-2 h-2 bg-green-500 rounded-full" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isAuthenticated && (
            <DropdownMenuItem onClick={handleSignIn} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In with Ethereum"
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {connectors.map((connector) => (
          <DropdownMenuItem key={connector.id} onClick={() => handleConnect(connector)}>
            {connector.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
