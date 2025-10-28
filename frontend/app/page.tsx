"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Shield, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
            Secure Identity & <span className="text-primary">Capsule Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Control your digital identity with encrypted capsules, guardian recovery, and zero-knowledge proofs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="glass p-8 rounded-xl">
            <Lock className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Encrypted Capsules</h3>
            <p className="text-sm text-muted-foreground">
              Store sensitive data in encrypted capsules with client-side encryption and IPFS storage
            </p>
          </div>

          <div className="glass p-8 rounded-xl">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Guardian Recovery</h3>
            <p className="text-sm text-muted-foreground">
              Set up trusted guardians to help recover your identity with multi-sig approval
            </p>
          </div>

          <div className="glass p-8 rounded-xl">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">ZK Verification</h3>
            <p className="text-sm text-muted-foreground">
              Prove attributes without revealing identity using zero-knowledge proofs
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="glass p-12 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to secure your identity?</h2>
          <p className="text-muted-foreground mb-6">Connect your wallet to get started</p>
          <Link href="/dashboard">
            <Button size="lg">Connect Wallet</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
