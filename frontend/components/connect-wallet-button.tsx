"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { web3 } from "@/lib/web3"
import { Wallet, Copy, LogOut } from "lucide-react"

export function ConnectWalletButton() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const wallet = await web3.connectWallet()
      if (wallet) {
        setAddress(wallet)
        setConnected(true)
      }
    } catch (error) {
      console.error("Connection failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    setConnected(false)
    setAddress(null)
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  if (!connected) {
    return (
      <Button onClick={handleConnect} disabled={loading} className="gap-2">
        <Wallet className="w-4 h-4" />
        {loading ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="glass px-3 py-2 rounded-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button onClick={copyAddress} className="hover:text-primary transition">
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <Button variant="ghost" size="icon" onClick={handleDisconnect} className="rounded-lg">
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
