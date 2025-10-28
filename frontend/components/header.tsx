"use client"

import Link from "next/link"
import { useTheme } from "@/lib/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu } from "lucide-react"
import { useState } from "react"
import { ConnectWalletButton } from "@/components/web3/connect-wallet-button"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">ID</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">IDRA</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/dashboard" className="text-sm hover:text-primary transition">
              Dashboard
            </Link>
            <Link href="/capsules" className="text-sm hover:text-primary transition">
              Capsules
            </Link>
            <Link href="/requests" className="text-sm hover:text-primary transition">
              Requests
            </Link>
            <Link href="/security" className="text-sm hover:text-primary transition">
              Security
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <div className="hidden sm:block">
              <ConnectWalletButton />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Link href="/dashboard" className="text-sm hover:text-primary transition py-2">
              Dashboard
            </Link>
            <Link href="/capsules" className="text-sm hover:text-primary transition py-2">
              Capsules
            </Link>
            <Link href="/requests" className="text-sm hover:text-primary transition py-2">
              Requests
            </Link>
            <Link href="/security" className="text-sm hover:text-primary transition py-2">
              Security
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
